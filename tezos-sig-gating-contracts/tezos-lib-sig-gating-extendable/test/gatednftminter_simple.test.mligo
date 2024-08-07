#import "./helper/gatednftminter_simple.mligo" "NftMinterHelper"
#import "./helper/assert.mligo" "AssertHelper"
#import "./helper/bootstrap.mligo" "Bootstrap"
#import "../examples/gatednftminter_simple.mligo" "NFTMINTER"
#import "../lib/main.mligo" "SigGatedExtendable"


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// HELPERS
/////////////////////////////////////////////////////////////////////////////////////////////////////////
type 'a raw_payload = {
  public_key: key;
  chain_id: chain_id;
  user: address;
  nonce: nat;
  expiration: nat;
  functioncall_contract: address;
  functioncall_name: string;
  functioncall_params: 'a;
}
let compute_hash (type a) (data : a raw_payload) : bytes * bytes = 
    let key_bytes : bytes = Bytes.pack data.public_key in
    let chain_id_bytes : bytes = Bytes.pack data.chain_id in
    let user_bytes : bytes = Bytes.pack data.user in
    let nonce_bytes : bytes = Bytes.pack data.nonce in 
    let expiration_bytes : bytes = Bytes.pack data.expiration in 
    let functioncall_contract_bytes : bytes = Bytes.pack data.functioncall_contract in
    let functioncall_name_bytes : bytes = Bytes.pack data.functioncall_name in
    let functioncall_params_bytes : bytes = Bytes.pack data.functioncall_params in
    let data : bytes = Bytes.concat key_bytes (Bytes.concat chain_id_bytes (Bytes.concat user_bytes (Bytes.concat nonce_bytes (Bytes.concat expiration_bytes (Bytes.concat functioncall_contract_bytes (Bytes.concat functioncall_name_bytes functioncall_params_bytes)))))) in
    let data_hash = Crypto.keccak data in    
    data_hash, functioncall_params_bytes

let localsigner = {
  address=("tz1TiFzFCcwjv4pyYGTrnncqgq17p59CzAE2": address);
  publicKey=("edpkuoQnnWMys1uS2eJrDkhPnizRNyQYBcsBsyfX4K97jVEaWKTXat" : key);
  privateKey="edskS7YYeT85SiRZEHPFjDpCAzCuUaMwYFi39cWPfguovTuNqxU3U9hXo7LocuJmr7hxkesUFkmDJh26ubQGehwXY8YiGXYCvU"
}

let sign_hash (data_hash : bytes) : signature = 
  Test.Next.Crypto.sign localsigner.privateKey data_hash


/////////////////////////////////////////////////////////////////////////////////////////////////////////
// TESTS
/////////////////////////////////////////////////////////////////////////////////////////////////////////

let test_gatednftmintersimple_initial_storage =
    let (owner1, owner2, owner3, owner4, op1, op2, op3) = Bootstrap.boot_accounts() in
    // DEPLOY NFTMINTER
    let orig_nftminter = NftMinterHelper.boot_nftminter(owner3, localsigner.address, owner3, owner1, owner2, owner3, owner4, op1, op2, op3) in
    let {taddr = nftminter_taddr; code = _ ; size = _} = orig_nftminter in 
    let nftminter_contract = Test.Next.Typed_address.to_contract nftminter_taddr in
    let _nftminter_address : address = Tezos.address nftminter_contract in
    // VERIFY 
    let current_storage = Test.Next.Typed_address.get_storage nftminter_taddr in
    let () = Assert.assert (current_storage.admin = owner3) in
    ()

let test_gatednftmintersimple_set_signer =
    let (owner1, owner2, owner3, owner4, op1, op2, op3) = Bootstrap.boot_accounts() in
    // DEPLOY NFTMINTER
    let orig_nftminter = NftMinterHelper.boot_nftminter(owner3, localsigner.address, owner3, owner1, owner2, owner3, owner4, op1, op2, op3) in
    let {taddr = nftminter_taddr; code = _ ; size = _} = orig_nftminter in 
    let nftminter_contract = Test.Next.Typed_address.to_contract nftminter_taddr in
    let _nftminter_address : address = Tezos.address nftminter_contract in
    // SETSIGNER
    let () = Test.set_source owner3 in
    let r = Test.transfer_to_contract nftminter_contract (SetSigner owner2) 0tez in
    let () = AssertHelper.tx_success r in
    // VERIFY 
    let current_storage = Test.Next.Typed_address.get_storage nftminter_taddr in
    let () = Assert.assert (current_storage.admin = owner3) in
    let () = Assert.assert (current_storage.signerAddress = owner2) in
    ()

let test_gatednftmintersimple_failure_set_signer_not_admin =
    let (owner1, owner2, owner3, owner4, op1, op2, op3) = Bootstrap.boot_accounts() in
    // DEPLOY NFTMINTER
    let orig_nftminter = NftMinterHelper.boot_nftminter(owner3, localsigner.address, owner3, owner1, owner2, owner3, owner4, op1, op2, op3) in
    let {taddr = nftminter_taddr; code = _ ; size = _} = orig_nftminter in 
    let nftminter_contract = Test.Next.Typed_address.to_contract nftminter_taddr in
    let _nftminter_address : address = Tezos.address nftminter_contract in
    // SETSIGNER
    let () = Test.set_source owner4 in
    let r = Test.transfer_to_contract nftminter_contract (SetSigner owner2) 0tez in
    let () = AssertHelper.string_failure r SigGatedExtendable.Errors.only_admin in
    // VERIFY 
    let current_storage = Test.Next.Typed_address.get_storage nftminter_taddr in
    let () = Assert.assert (current_storage.admin = owner3) in
    let () = Assert.assert (current_storage.signerAddress = localsigner.address) in
    ()


let test_gatednftmintersimple_mint_gated =
    let (owner1, owner2, owner3, owner4, op1, op2, op3) = Bootstrap.boot_accounts() in
    // DEPLOY NFTMINTER
    let orig_nftminter = NftMinterHelper.boot_nftminter(owner3, localsigner.address, owner3, owner1, owner2, owner3, owner4, op1, op2, op3) in
    let {taddr = nftminter_taddr; code = _ ; size = _} = orig_nftminter in 
    let nftminter_contract = Test.Next.Typed_address.to_contract nftminter_taddr in
    let nftminter_address : address = Tezos.address nftminter_contract in

    // PREPARE parameter for EXEC_GATED_CALLDATA call 
    let inputs: NFTMINTER.NftMinterSimple.mint raw_payload = {
      public_key = localsigner.publicKey;
      chain_id = (Tezos.get_chain_id());
      user = owner3;
      nonce = 0n;
      expiration = 100n;
      functioncall_contract = nftminter_address;
      functioncall_name = "%mint_gated";
      functioncall_params = ({
        owner=("tz1fon1Hp3eRff17X82Y3Hc2xyokz33MavFF": address);
        token_id=6n
      }: NFTMINTER.NftMinterSimple.mint)
    } in
    let () = Test.Next.IO.log inputs.chain_id in
    let data_hash, functioncall_params_bytes = compute_hash inputs in 
    let my_sig : signature = sign_hash data_hash in

    let p: NFTMINTER.NftMinterSimple.txAuthInput = {
      userAddress = inputs.user;   // user address (used to check nonce)
      expirationBlock = inputs.expiration;  // expiration date
      //contractAddress = inputs.functioncall_contract;  // calldata contract address
      // functionName = inputs.functioncall_name;   // name of the entrypoint of the calldata (for example "%mint")
      functionArgs = functioncall_params_bytes;   // arguments for the entrypoint of the calldata 
      signerPublicKey = inputs.public_key;     // public key that signed the payload 
      signature = my_sig;   // signature of the payload signed by the given public key
    } in
    // EXEC_GATED_CALLDATA entrypoint call 
    let () = Test.set_source owner1 in
    let r = Test.transfer_to_contract nftminter_contract (Mint_gated p) 0tez in
    let () = AssertHelper.tx_success r in
    // VERIFY modified storage
    let current_storage = Test.Next.Typed_address.get_storage nftminter_taddr in
    let () = Assert.assert (current_storage.admin = owner3) in
    let () = 
        match Big_map.find_opt 6n current_storage.siggated_extension.ledger with
        | Some ownr6 -> Assert.assert (ownr6 = inputs.functioncall_params.owner) 
        | None -> Test.Next.Assert.failwith "Wrong owner ! Mint did not work"
    in
    // VERIFY events
    let events : (chain_id * address * nat * nat * key * address * string * bytes) list = Test.Next.State.last_events nftminter_taddr "SignatureVerified" in
    match events with 
    | [elt] -> 
      let (chain_id,userAddress,nonce,expiration,k,contractAddress,name, args) = elt in
      // let () = Assert.assert (inputs.chain_id = chain_id) in
      let () = Assert.assert (p.userAddress = userAddress) in
      let () = Assert.assert (inputs.nonce = nonce) in
      let () = Assert.assert (p.expirationBlock = expiration) in
      // let () = Assert.assert (p.signerPublicKey = k) in
      let () = Assert.assert (inputs.functioncall_name = name) in
      let () = Assert.assert (p.functionArgs = args) in
      ()
    | _ -> failwith("expected  one event exactly")
    ()


  let test_gatednftmintersimple_mint_gated_failure_wrong_contract =
    let (owner1, owner2, owner3, owner4, op1, op2, op3) = Bootstrap.boot_accounts() in
    // DEPLOY NFTMINTER
    let orig_nftminter = NftMinterHelper.boot_nftminter(owner3, localsigner.address, owner3, owner1, owner2, owner3, owner4, op1, op2, op3) in
    let {taddr = nftminter_taddr; code = _ ; size = _} = orig_nftminter in 
    let nftminter_contract = Test.Next.Typed_address.to_contract nftminter_taddr in
    let _nftminter_address : address = Tezos.address nftminter_contract in

    // PREPARE parameter for EXEC_GATED_CALLDATA call 
    let inputs: NFTMINTER.NftMinterSimple.mint raw_payload = {
      public_key = localsigner.publicKey;
      chain_id = (Tezos.get_chain_id());
      user = owner3;
      nonce = 0n;
      expiration = 100n;
      functioncall_contract = ("KT1TRPRBqSR6GsCKc9ozxF7uJuX4gtPFwHxe": address); // wrong address (not nftminter) 
      functioncall_name = "%mint_gated";
      functioncall_params = ({
        owner=("tz1fon1Hp3eRff17X82Y3Hc2xyokz33MavFF": address);
        token_id=6n
      }: NFTMINTER.NftMinterSimple.mint)
    } in
    let data_hash, functioncall_params_bytes = compute_hash inputs in 
    let my_sig : signature = sign_hash data_hash in

    let p: NFTMINTER.NftMinterSimple.txAuthInput = {
      userAddress = inputs.user;   // user address (used to check nonce)
      expirationBlock = inputs.expiration;  // expiration date
      //contractAddress = inputs.functioncall_contract;  // calldata contract address
      // functionName = inputs.functioncall_name;   // name of the entrypoint of the calldata (for example "%mint")
      functionArgs = functioncall_params_bytes;   // arguments for the entrypoint of the calldata 
      signerPublicKey = inputs.public_key;     // public key that signed the payload 
      signature = my_sig;   // signature of the payload signed by the given public key
    } in
    // EXEC_GATED_CALLDATA entrypoint call should fail (in calldata token_id=7n but signature expects token_id=6n)
    let () = Test.set_source owner1 in
    let r = Test.transfer_to_contract nftminter_contract (Mint_gated p) 0tez in
    let () = AssertHelper.string_failure r SigGatedExtendable.Errors.invalid_signature in
    // let () = AssertHelper.string_failure r SigGatedExtendable.Errors.invalid_calldata_contract_not_dispatcher in
    // VERIFY modified storage
    let current_storage = Test.Next.Typed_address.get_storage nftminter_taddr in
    let () = Assert.assert (current_storage.admin = owner3) in
    let () = 
        match Big_map.find_opt 6n current_storage.siggated_extension.ledger with
        | None -> () 
        | Some _ownr6 -> Test.Next.Assert.failwith "Token 6 should not be owned"
    in
    ()


  let test_gatednftmintersimple_mint_gated_failure_wrong_calldata_param =
    let (owner1, owner2, owner3, owner4, op1, op2, op3) = Bootstrap.boot_accounts() in
    // DEPLOY NFTMINTER
    let orig_nftminter = NftMinterHelper.boot_nftminter(owner3, localsigner.address, owner3, owner1, owner2, owner3, owner4, op1, op2, op3) in
    let {taddr = nftminter_taddr; code = _ ; size = _} = orig_nftminter in 
    let nftminter_contract = Test.Next.Typed_address.to_contract nftminter_taddr in
    let nftminter_address : address = Tezos.address nftminter_contract in

    // PREPARE parameter for EXEC_GATED_CALLDATA call 
    let inputs: NFTMINTER.NftMinterSimple.mint raw_payload = {
      public_key = localsigner.publicKey;
      chain_id = (Tezos.get_chain_id());
      user = owner3;
      nonce = 0n;
      expiration = 100n;
      functioncall_contract = nftminter_address;
      functioncall_name = "%mint_gated";
      functioncall_params = ({
        owner=("tz1fon1Hp3eRff17X82Y3Hc2xyokz33MavFF": address);
        token_id=7n
      }: NFTMINTER.NftMinterSimple.mint)
    } in
    let data_hash, functioncall_params_bytes = compute_hash inputs in 
    let my_sig : signature = ("edsigtcjNvuDj6sfUL9u3Ma4Up3zfiZiPM2gzwDC3Vk1324SJzaGTbVwtdmdJ5q9UbD9qnKm9jdzytFqjSSt54oLY61XuB2mSW5" : signature) in
    // let my_sig : signature = sign_hash data_hash in

    let p: NFTMINTER.NftMinterSimple.txAuthInput = {
      userAddress = inputs.user;   // user address (used to check nonce)
      expirationBlock = inputs.expiration;  // expiration date
      //contractAddress = inputs.functioncall_contract;  // calldata contract address
      // functionName = inputs.functioncall_name;   // name of the entrypoint of the calldata (for example "%mint")
      functionArgs = functioncall_params_bytes;   // arguments for the entrypoint of the calldata 
      signerPublicKey = inputs.public_key;     // public key that signed the payload 
      signature = my_sig;   // signature of the payload signed by the given public key
    } in
    // EXEC_GATED_CALLDATA entrypoint call should fail (in calldata token_id=7n but signature expects token_id=6n)
    let () = Test.set_source owner1 in
    let r = Test.transfer_to_contract nftminter_contract (Mint_gated p) 0tez in
    let () = AssertHelper.string_failure r SigGatedExtendable.Errors.invalid_signature in
    // VERIFY modified storage
    let current_storage = Test.Next.Typed_address.get_storage nftminter_taddr in
    let () = Assert.assert (current_storage.admin = owner3) in
    let () = 
        match Big_map.find_opt 6n current_storage.siggated_extension.ledger with
        | None -> () 
        | Some _ownr6 -> Test.Next.Assert.failwith "Token 6 should not be owned"
    in
    ()

  
  let test_gatednftmintersimple_mint_gated_failure_unknown_calldata_name =
    let (owner1, owner2, owner3, owner4, op1, op2, op3) = Bootstrap.boot_accounts() in
    // DEPLOY NFTMINTER
    let orig_nftminter = NftMinterHelper.boot_nftminter(owner3, localsigner.address, owner3, owner1, owner2, owner3, owner4, op1, op2, op3) in
    let {taddr = nftminter_taddr; code = _ ; size = _} = orig_nftminter in 
    let nftminter_contract = Test.Next.Typed_address.to_contract nftminter_taddr in
    let nftminter_address : address = Tezos.address nftminter_contract in

    // PREPARE parameter for EXEC_GATED_CALLDATA call 
    let inputs: NFTMINTER.NftMinterSimple.mint raw_payload = {
      public_key = localsigner.publicKey;
      chain_id = (Tezos.get_chain_id());
      user = owner3;
      nonce = 0n;
      expiration = 100n;
      functioncall_contract = nftminter_address;
      functioncall_name = "%foobar";
      functioncall_params = ({
        owner=("tz1fon1Hp3eRff17X82Y3Hc2xyokz33MavFF": address);
        token_id=6n
      }: NFTMINTER.NftMinterSimple.mint)
    } in
    let data_hash, functioncall_params_bytes = compute_hash inputs in
    let my_sig : signature = sign_hash data_hash in

    let p: NFTMINTER.NftMinterSimple.txAuthInput = {
      userAddress = inputs.user;   // user address (used to check nonce)
      expirationBlock = inputs.expiration;  // expiration date
      //contractAddress = inputs.functioncall_contract;  // calldata contract address
      // functionName = inputs.functioncall_name;   // name of the entrypoint of the calldata (for example "%mint")
      functionArgs = functioncall_params_bytes;   // arguments for the entrypoint of the calldata 
      signerPublicKey = inputs.public_key;     // public key that signed the payload 
      signature = my_sig;   // signature of the payload signed by the given public key
    } in
    // EXEC_GATED_CALLDATA entrypoint call should fail (in calldata token_id=7n but signature expects token_id=6n)
    let () = Test.set_source owner1 in
    let r = Test.transfer_to_contract nftminter_contract (Mint_gated p) 0tez in
    let () = AssertHelper.string_failure r SigGatedExtendable.Errors.invalid_signature in
    // VERIFY modified storage
    let current_storage = Test.Next.Typed_address.get_storage nftminter_taddr in
    let () = Assert.assert (current_storage.admin = owner3) in
    let () = 
        match Big_map.find_opt 6n current_storage.siggated_extension.ledger with
        | None -> () 
        | Some _ownr6 -> Test.Next.Assert.failwith "Token 6 should not be owned"
    in
    ()

  let test_gatednftmintersimple_mint_gated_failure_replay_attack =
    let (owner1, owner2, owner3, owner4, op1, op2, op3) = Bootstrap.boot_accounts() in
    // DEPLOY NFTMINTER
    let orig_nftminter = NftMinterHelper.boot_nftminter(owner3, localsigner.address, owner3, owner1, owner2, owner3, owner4, op1, op2, op3) in
    let {taddr = nftminter_taddr; code = _ ; size = _} = orig_nftminter in 
    let nftminter_contract = Test.Next.Typed_address.to_contract nftminter_taddr in
    let nftminter_address : address = Tezos.address nftminter_contract in

    // PREPARE parameter for EXEC_GATED_CALLDATA call 
    let inputs: NFTMINTER.NftMinterSimple.mint raw_payload = {
      public_key = localsigner.publicKey;
      chain_id = (Tezos.get_chain_id());
      user = owner3;
      nonce = 0n;
      expiration = 100n;
      functioncall_contract = nftminter_address;
      functioncall_name = "%mint_gated";
      functioncall_params = ({
        owner=("tz1fon1Hp3eRff17X82Y3Hc2xyokz33MavFF": address);
        token_id=6n
      }: NFTMINTER.NftMinterSimple.mint)
    } in
    let data_hash, functioncall_params_bytes = compute_hash inputs in
    let my_sig : signature = sign_hash data_hash in

    let p: NFTMINTER.NftMinterSimple.txAuthInput = {
      userAddress = inputs.user;   // user address (used to check nonce)
      expirationBlock = inputs.expiration;  // expiration date
      //contractAddress = inputs.functioncall_contract;  // calldata contract address
      // functionName = inputs.functioncall_name;   // name of the entrypoint of the calldata (for example "%mint")
      functionArgs = functioncall_params_bytes;   // arguments for the entrypoint of the calldata 
      signerPublicKey = inputs.public_key;     // public key that signed the payload 
      signature = my_sig;   // signature of the payload signed by the given public key
    } in
    // EXEC_GATED_CALLDATA entrypoint call should fail (in calldata token_id=7n but signature expects token_id=6n)
    let () = Test.set_source owner1 in
    let r = Test.transfer_to_contract nftminter_contract (Mint_gated p) 0tez in
    let () = AssertHelper.tx_success r in
    // call VERIFY entrypoint again ... should fail
    let r = Test.transfer_to_contract nftminter_contract (Mint_gated p) 0tez in
    let () = AssertHelper.string_failure r SigGatedExtendable.Errors.invalid_signature in
    // VERIFY modified storage
    let current_storage = Test.Next.Typed_address.get_storage nftminter_taddr in
    let () = Assert.assert (current_storage.admin = owner3) in
    let () = 
        match Big_map.find_opt 6n current_storage.siggated_extension.ledger with
        | Some ownr6 -> Assert.assert (ownr6 = inputs.functioncall_params.owner) 
        | None -> Test.Next.Assert.failwith "Wrong owner ! Mint did not work"
    in
    ()

