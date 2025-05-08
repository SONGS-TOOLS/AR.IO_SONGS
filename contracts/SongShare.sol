// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title SongShare
 * @dev ERC1155 token representing shared ownership in songs
 * Each token ID corresponds to a specific song in the SONGS Protocol
 */
contract SongShare is ERC1155, AccessControl, Pausable, ERC1155Supply {
    using Strings for uint256;
    
    bytes32 public constant URI_SETTER_ROLE = keccak256("URI_SETTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ARTIST_ROLE = keccak256("ARTIST_ROLE");
    
    // Base URI for metadata
    string private _baseURI;
    
    // Mapping from token ID to Arweave transaction ID
    mapping(uint256 => string) private _arweaveTxIds;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) private _creators;
    
    // Per-token supply caps
    mapping(uint256 => uint256) private _supplyCaps;
    
    // Royalty information per token
    struct RoyaltyInfo {
        address recipient;
        uint96 bps; // basis points (1/100 of a percent)
    }
    mapping(uint256 => RoyaltyInfo) private _royalties;
    
    event ArweaveTxIdSet(uint256 indexed tokenId, string arweaveTxId);
    event SupplyCapSet(uint256 indexed tokenId, uint256 maxSupply);
    event RoyaltySet(uint256 indexed tokenId, address recipient, uint96 bps);
    
    constructor(string memory baseURI) ERC1155("") {
        _baseURI = baseURI;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(URI_SETTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    /**
     * @dev Returns the Arweave transaction ID for a token
     */
    function arweaveTxId(uint256 tokenId) public view returns (string memory) {
        return _arweaveTxIds[tokenId];
    }
    
    /**
     * @dev Sets the Arweave transaction ID for a token
     * Only callable by URI setter role
     */
    function setArweaveTxId(uint256 tokenId, string memory txId) public onlyRole(URI_SETTER_ROLE) {
        _arweaveTxIds[tokenId] = txId;
        emit ArweaveTxIdSet(tokenId, txId);
    }
    
    /**
     * @dev Returns the supply cap for a token
     */
    function supplyCap(uint256 tokenId) public view returns (uint256) {
        return _supplyCaps[tokenId];
    }
    
    /**
     * @dev Sets the supply cap for a token
     * Only callable by admin role
     */
    function setSupplyCap(uint256 tokenId, uint256 maxSupply) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(maxSupply >= totalSupply(tokenId), "SongShare: cap below current supply");
        _supplyCaps[tokenId] = maxSupply;
        emit SupplyCapSet(tokenId, maxSupply);
    }
    
    /**
     * @dev Creates a new token type and mints initial supply
     */
    function create(
        uint256 tokenId,
        uint256 initialSupply,
        uint256 maxSupply,
        string memory arweaveTxId,
        address royaltyRecipient,
        uint96 royaltyBps
    ) public onlyRole(MINTER_ROLE) {
        require(totalSupply(tokenId) == 0, "SongShare: token already exists");
        require(initialSupply <= maxSupply, "SongShare: initial supply exceeds max");
        require(royaltyBps <= 10000, "SongShare: royalty too high");
        
        _creators[tokenId] = msg.sender;
        _supplyCaps[tokenId] = maxSupply;
        _arweaveTxIds[tokenId] = arweaveTxId;
        
        if (royaltyRecipient != address(0)) {
            _royalties[tokenId] = RoyaltyInfo(royaltyRecipient, royaltyBps);
            emit RoyaltySet(tokenId, royaltyRecipient, royaltyBps);
        }
        
        _mint(msg.sender, tokenId, initialSupply, "");
        emit SupplyCapSet(tokenId, maxSupply);
        emit ArweaveTxIdSet(tokenId, arweaveTxId);
    }
    
    /**
     * @dev Mints additional tokens
     */
    function mint(
        address to,
        uint256 tokenId,
        uint256 amount,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        require(totalSupply(tokenId) + amount <= _supplyCaps[tokenId], "SongShare: exceeds supply cap");
        _mint(to, tokenId, amount, data);
    }
    
    /**
     * @dev Mints batch of tokens
     */
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyRole(MINTER_ROLE) {
        for (uint i = 0; i < ids.length; i++) {
            require(totalSupply(ids[i]) + amounts[i] <= _supplyCaps[ids[i]], "SongShare: exceeds supply cap");
        }
        _mintBatch(to, ids, amounts, data);
    }
    
    /**
     * @dev Pauses all token transfers
     */
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpauses all token transfers
     */
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Sets a new base URI
     */
    function setURI(string memory newBaseURI) public onlyRole(URI_SETTER_ROLE) {
        _baseURI = newBaseURI;
    }
    
    /**
     * @dev Returns the URI for a token ID
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(exists(tokenId), "SongShare: URI query for nonexistent token");
        return string(abi.encodePacked(_baseURI, tokenId.toString()));
    }
    
    /**
     * @dev Returns royalty information for a token
     */
    function royaltyInfo(uint256 tokenId) public view returns (address recipient, uint96 bps) {
        RoyaltyInfo memory info = _royalties[tokenId];
        return (info.recipient, info.bps);
    }
    
    /**
     * @dev See {IERC165-supportsInterface}
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    /**
     * @dev Hook that is called before any token transfer
     */
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
} 