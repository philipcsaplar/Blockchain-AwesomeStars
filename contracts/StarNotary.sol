// SPDX-License-Identifier: MIT
pragma solidity >=0.4.24;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {

    // Star data
    struct Star {
        string name;
    }

    // Implement Task 1 Add a name and symbol properties
    // name: Is a short name to your token
    // symbol: Is a short string like 'USD' -> 'American Dollar'
    constructor() ERC721("AwesomeStars", "AWS")  { }

    // mapping the Star with the Owner Address
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;

    
    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId) public { // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name); // Star is an struct so we are creating a new Star and symbol
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sale the Star you don't owned");
        starsForSale[_tokenId] = _price;
    }


    // Function that allows you to convert an address into a payable address
    function _make_payable(address x) internal pure returns (address payable) {
        return payable(address(uint160(x)));
    }

    function giveTransferApproval(address _to, uint256 tokenId) public {
        require( ownerOf(tokenId) == msg.sender);
        approve(_to, tokenId);
        return;
    }

    function getOwnerOfToken(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        require(msg.value > starCost, "You need to have enough Ether");
        transferFrom(ownerAddress, msg.sender, _tokenId);
        address payable ownerAddressPayable = _make_payable(ownerAddress);
        address payable senderAddressPayable = _make_payable(msg.sender);
        (bool sentToOwner, bytes memory data) = ownerAddressPayable.call{value: starCost}("");
        require(sentToOwner, "Failed to send Ether to owner");
        if (msg.value > starCost) {
            (bool sentToBuyer, bytes memory data) = senderAddressPayable.call{value: msg.value - starCost}("");
            require(sentToBuyer, "Failed to send Ether to buyer");
        }
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo (uint _tokenId) public view returns (Star memory) {
        //1. You should return the Star saved in tokenIdToStarInfo mapping
        require(_exists(_tokenId), "Token doesn't exists.");
        return tokenIdToStarInfo[_tokenId];
    }

    // Implement Task 1 Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        //1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        require( ownerOf(_tokenId1) == msg.sender);
        //2. You don't have to check for the price of the token (star)
        //3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId2)
        address ownerAddress1 = ownerOf(_tokenId1);
        address ownerAddress2 = ownerOf(_tokenId2);
        //4. Use _transferFrom function to exchange the tokens.
        transferFrom(ownerAddress1, ownerAddress2, _tokenId1);
        transferFrom(ownerAddress2, ownerAddress1, _tokenId2);
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to1, uint256 _tokenId) public {
        //1. Check if the sender is the ownerOf(_tokenId)
        require( ownerOf(_tokenId) == msg.sender);
        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        transferFrom(msg.sender, _to1, _tokenId);
    }

}
