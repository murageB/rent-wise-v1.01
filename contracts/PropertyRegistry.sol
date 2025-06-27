// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PropertyRegistry {
    struct Property {
        string propertyId;
        string ownerAddress;
        string propertyAddress;
        uint256 price;
        uint256 timestamp;
        bool isActive;
        string metadataHash;
    }
    
    mapping(string => Property) public properties;
    mapping(address => string[]) public ownerProperties;
    
    event PropertyRegistered(string propertyId, string ownerAddress, uint256 timestamp);
    event PropertyUpdated(string propertyId, uint256 timestamp);
    event PropertyDeactivated(string propertyId, uint256 timestamp);
    
    modifier onlyOwner(string memory propertyId) {
        require(keccak256(abi.encodePacked(properties[propertyId].ownerAddress)) == 
                keccak256(abi.encodePacked(msg.sender)), "Not the property owner");
        _;
    }
    
    function registerProperty(
        string memory propertyId,
        string memory propertyAddress,
        uint256 price,
        string memory metadataHash
    ) public {
        require(bytes(properties[propertyId].propertyId).length == 0, "Property already exists");
        
        properties[propertyId] = Property({
            propertyId: propertyId,
            ownerAddress: addressToString(msg.sender),
            propertyAddress: propertyAddress,
            price: price,
            timestamp: block.timestamp,
            isActive: true,
            metadataHash: metadataHash
        });
        
        ownerProperties[msg.sender].push(propertyId);
        
        emit PropertyRegistered(propertyId, addressToString(msg.sender), block.timestamp);
    }
    
    function updateProperty(
        string memory propertyId,
        string memory propertyAddress,
        uint256 price,
        string memory metadataHash
    ) public onlyOwner(propertyId) {
        Property storage property = properties[propertyId];
        property.propertyAddress = propertyAddress;
        property.price = price;
        property.metadataHash = metadataHash;
        property.timestamp = block.timestamp;
        
        emit PropertyUpdated(propertyId, block.timestamp);
    }
    
    function deactivateProperty(string memory propertyId) public onlyOwner(propertyId) {
        properties[propertyId].isActive = false;
        properties[propertyId].timestamp = block.timestamp;
        
        emit PropertyDeactivated(propertyId, block.timestamp);
    }
    
    function getProperty(string memory propertyId) public view returns (
        string memory ownerAddress,
        string memory propertyAddress,
        uint256 price,
        uint256 timestamp,
        bool isActive,
        string memory metadataHash
    ) {
        Property memory property = properties[propertyId];
        return (
            property.ownerAddress,
            property.propertyAddress,
            property.price,
            property.timestamp,
            property.isActive,
            property.metadataHash
        );
    }
    
    function getOwnerProperties(address owner) public view returns (string[] memory) {
        return ownerProperties[owner];
    }
    
    function addressToString(address addr) internal pure returns (string memory) {
        bytes memory b = new bytes(20);
        for (uint i = 0; i < 20; i++) {
            b[i] = bytes1(uint8(uint(uint160(addr)) / (2**(8*(19 - i)))));
        }
        return string(b);
    }
} 