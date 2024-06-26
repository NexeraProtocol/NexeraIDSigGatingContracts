// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@solidstate/contracts/token/ERC721/SolidStateERC721.sol";
import "@solidstate/contracts/access/ownable/SafeOwnable.sol";
import "../../sigVerifiers/diamondBased/TxAuthDataVerifierFacet.sol"; // Ensure this path matches your file structure
import {ExampleGatedNFTFacetStorage} from "./ExampleGatedNFTFacetStorage.sol";

/**
 * @title Example Gated NFT Minter Facet
 * @dev NFT minting contract with gated access based on off-chain signature verification.
 * This contract extends ERC721 for NFT functionality, TxAuthDataVerifier for signature verification,
 * and SafeOwnable for ownership management. It uses a counter to assign unique token IDs to minted NFTs.
 * This contract is designed to be used as a facet in a Diamond Standard (EIP-2535) implementation.
 * @notice This is an example contract, not intended for deployment.
 */
contract ExampleGatedNFTFacet is
    SolidStateERC721,
    TxAuthDataVerifierFacet,
    SafeOwnable
{
    /// @notice Initializes the `ExampleGatedNFTFacet` contract
    /// @param signerAddress The address of the off-chain service responsible for signing transactions
    function initializeExampleGatedNFTFacet(address signerAddress) external {
        initializeTxAuthDataVerifier(signerAddress);
    }

    /// @notice Sets a new signer address
    /// @dev Can only be called by the current owner
    /// @param _signer The address of the new signer
    function setSigner(address _signer) public onlyOwner {
        _setSigner(_signer);
    }

    /// @notice Retrieves the current value of the token ID counter.
    /// @dev Returns the last token ID that was minted.
    /// @return The current value of the token ID counter, which corresponds to the last minted token ID.
    function lastTokenId() public view returns (uint256) {
        return ExampleGatedNFTFacetStorage.layout()._tokenIds;
    }

    /**
     * @dev Internal function to mint a new NFT to a specified recipient.
     * @param recipient The address that will receive the newly minted NFT.
     * @return newItemId The token ID of the newly minted NFT.
     */
    function _mintNFT(address recipient) internal returns (uint256) {
        ExampleGatedNFTFacetStorage.layout()._tokenIds += 1;
        uint256 newItemId = ExampleGatedNFTFacetStorage.layout()._tokenIds;
        _mint(recipient, newItemId);

        return newItemId;
    }

    /**
     * @notice Mints a new NFT to a specified recipient, using an optimized signature verification process.
     * @dev Leverages the `requireTxDataAuth` modifier for efficient signature verification.
     * @param recipient The address to which the NFT will be minted.
     * @return The ID of the newly minted NFT upon successful verification and minting.
     */
    function mintNFTGated(
        address recipient
    ) public requireTxDataAuth returns (uint256) {
        return _mintNFT(recipient);
    }
}
