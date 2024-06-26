module ProxyVerifier = struct

    type storage = {
        admin: address;
        signerAddress: address; 
        nonces: (address, nat) big_map 
    }
    type ret = operation list * storage

    module Errors = struct
        let only_owner = "OnlyOwner"
        let block_expired = "BlockExpired"
        let invalid_signature = "InvalidSignature"
        let invalid_nonce = "InvalidNonce"
        let parameter_missmatch = "HashMissmatchParameters"
        let invalid_calldata_wrong_name = "UnknownEntrypoint"
        let invalid_calldata_wrong_arguments = "InvalidEntrypointArguments"
        let invalid_calldata_contract_not_dispatcher = "MissingDispatchEntrypoint"
        let not_expected_signer = "KeyMissmatchSignerAddress"
        let missing_isvalidsignature_view = "MissingIsValidSignatureView"
        let invalid_chain = "InvalidChainId"
    end

    let is_implicit (elt : address) : bool =
        let pack_elt : bytes = Bytes.pack elt in
        let is_imp : bytes = Bytes.sub 6n 1n pack_elt in
        (is_imp = 0x00)

    [@entry]
    let setSigner(newSigner: address) (s: storage) : ret =
        let _ = Assert.Error.assert (Tezos.get_sender() = s.admin) Errors.only_owner in
        let op = Tezos.emit "%setSigner" newSigner in
        [op], { s with signerAddress = newSigner }

    [@view]
    let getSigner(_p: unit)(s: storage) : address = 
        s.signerAddress

    type calldata = address * string * bytes
    [@entry]
    let dispatch (address, name, args: calldata)(s: storage) : ret =
        if (Tezos.get_self_address() = address) then
            failwith Errors.invalid_calldata_wrong_name
        else
        let external_dispatch_opt : calldata contract option = Tezos.get_entrypoint_opt "%dispatch" address in
        let op : operation  = match external_dispatch_opt with
        | Some ep -> Tezos.Next.Operation.transaction (address, name, args) 0mutez ep
        | None -> failwith Errors.invalid_calldata_contract_not_dispatcher
        in
        [op], s

    type txAuthData = {
        //   payload: bytes;   // hash of the following fields (except signature)
        //   chain_id: chain_id;   // chain_id
        userAddress: address;   // user address (used to check nonce)
        //   nonce: nat;   // nonce of the userAddress when forging the signature
        expiration: nat;  // expiration date
        contractAddress: address;  // calldata contract address
        name: string;   // name of the entrypoint of the calldata (for example "%mint")
        args: bytes;   // arguments for the entrypoint of the calldata 
        publicKey: key;     // public key that signed the payload 
        signature: signature;   // signature of the payload signed by the given public key
    }
    let verifyTxAuthData (p: txAuthData)(s: storage) : ret = 
        let { userAddress; expiration; contractAddress; name; args; publicKey=k; signature } = p in
        let chain_id = Tezos.get_chain_id() in
        let nonce, new_nonces = match Big_map.find_opt userAddress s.nonces with
        | None -> (0n, Big_map.update userAddress (Some(1n)) s.nonces)
        | Some nse -> (nse, Big_map.update userAddress (Some(nse + 1n)) s.nonces)
        in
        // VERIFY parameters correspond to payload hash
        let chainid_b = Bytes.pack chain_id in
        let user_b = Bytes.pack userAddress in
        let nonce_b = Bytes.pack nonce in
        let expiration_b = Bytes.pack expiration in
        let key_b = Bytes.pack k in
        let contract_b = Bytes.pack contractAddress in
        let name_b = Bytes.pack name in
        let expected_bytes = Bytes.concat key_b (Bytes.concat chainid_b (Bytes.concat user_b (Bytes.concat nonce_b (Bytes.concat expiration_b (Bytes.concat contract_b (Bytes.concat name_b args)))))) in
        let payload = Crypto.keccak(expected_bytes) in
        // let () = Assert.Error.assert (expected_payload = payload) Errors.parameter_missmatch in
        // Retrieve signer address from public key
        let kh : key_hash = Crypto.hash_key k in
        let signer_address_from_key = Tezos.address(Tezos.implicit_account kh) in
        // NONCE
        // let () = Assert.Error.assert (nonce = current_nonce) Errors.invalid_nonce in
        // EXPIRATION
        let _ = Assert.Error.assert (Tezos.get_level() < expiration) Errors.block_expired in
        // CHAIN ID
        // let _ = Assert.Error.assert (Tezos.get_chain_id() = chain_id) Errors.invalid_chain in
        // VERIFY signer key corresponds to signerAddress 
        let () = if (not is_implicit(s.signerAddress)) then // case signerAddress is a smart contract
            //calls isValidSignature of the smart contract             
            let r = Tezos.call_view "isValidSignature" (k, payload, signature) s.signerAddress in
            match r with
            | None -> failwith Errors.missing_isvalidsignature_view
            | Some status -> Assert.assert (status)
        else   // case signerAddress is a implicit account
            Assert.Error.assert (signer_address_from_key = s.signerAddress) Errors.not_expected_signer
        in
        // VERIFY SIGNATURE
        let is_valid = Crypto.check k signature payload in 
        let _ = Assert.Error.assert (is_valid) Errors.invalid_signature in
        // DISPATCH CALLDATA
        let internal_dispatch_opt : calldata contract option = Tezos.get_entrypoint_opt "%dispatch" (Tezos.get_self_address ()) in
        let op : operation  = match internal_dispatch_opt with
        | Some ep -> Tezos.Next.Operation.transaction (contractAddress, name, args) 0mutez ep
        | None -> failwith Errors.invalid_calldata_contract_not_dispatcher
        in
        [op], { s with nonces=new_nonces }

    [@entry]
    let exec_gated_calldata (p : txAuthData) (s : storage): ret =
        verifyTxAuthData p s 

end