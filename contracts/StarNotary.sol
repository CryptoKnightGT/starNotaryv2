pragma solidity >=0.4.24;

//Importing openzeppelin-solidity ERC-721 implemented Standard
import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

// StarNotary Contract declaration inheritance the ERC721 openzeppelin implementation
contract StarNotary is ERC721 {

    // Star data
    struct Star {
        string name;
        string tokenSymbol;
    }

    // Implement Task 1 Add a name and symbol properties
    // name: Is a short name to your token
    // symbol: Is a short string like 'USD' -> 'American Dollar'
    

    // mapping the Star with the Owner Address, via tokenId
    mapping(uint256 => Star) public tokenIdToStarInfo;
    // mapping the TokenId and price
    mapping(uint256 => uint256) public starsForSale;

    event Transfer(address indexed from, address indexed to, Star starToXfr);

    // Create Star using the Struct
    function createStar(string memory _name, uint256 _tokenId, string memory _tokenSymbol) public { // Passing the name and tokenId as a parameters
        Star memory newStar = Star(_name,_tokenSymbol); // Star is a struct so we are creating a new Star
        tokenIdToStarInfo[_tokenId] = newStar; // Creating in memory the Star -> tokenId mapping
        _mint(msg.sender, _tokenId); // _mint assign the the star with _tokenId to the sender address (ownership)
    }

    // Putting an Star for sale (Adding the star tokenid into the mapping starsForSale, first verify that the sender is the owner)
    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(ownerOf(_tokenId) == msg.sender, "You can't sell a Star that you don't owned");
        starsForSale[_tokenId] = _price;
    }


    // Function that allows you to convert an address into a payable address
    function _make_payable(address x) internal pure returns (address payable) {
        return address(uint160(x));
    }

    function buyStar(uint256 _tokenId) public  payable {
        //console.log("buyStar: tokenId to buy ", _tokenId, " starsForSale[_tokenId] ", starsForSale[_tokenId]);
        require(starsForSale[_tokenId] > 0, "The Star should be up for sale");
        uint256 starCost = starsForSale[_tokenId];
        address ownerAddress = ownerOf(_tokenId);
        //console.log("buyStar: owner ", ownerAddress, " owner ETH ", msg.value, " starCost ", starCost);
        require(msg.value > starCost, "You do not have enough Ether");
        _transferFrom(ownerAddress, msg.sender, _tokenId); // We can't use _addTokenTo or_removeTokenFrom functions, now we have to use _transferFrom
        address payable ownerAddressPayable = _make_payable(ownerAddress); // We need to make this conversion to be able to use transfer() function to transfer ethers
        ownerAddressPayable.transfer(starCost);
        if(msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    // Implement Task 1 lookUptokenIdToStarInfo
    function lookUptokenIdToStarInfo (uint _tokenId) public view returns (string memory) {
        //1. You should return the Star saved in tokenIdToStarInfo mapping
        Star memory newStar = tokenIdToStarInfo[_tokenId];
        return newStar;
    }

    // Implement Task 1 Exchange Stars function
    function exchangeStars(uint256 _tokenId1, uint256 _tokenId2) public {
        //1. Passing to star tokenId you will need to check if the owner of _tokenId1 or _tokenId2 is the sender
        address from;
        address to;
        uint tokenIdOfStarToXfr;

        if (msg.sender == (ownerOf(_tokenId1))) {
            from = ownerOf(_tokenId1);
            to = ownerOf(_tokenId2);
            tokenIdOfStarToXfr = _tokenId2;
        }
        else {
           if (msg.sender == (ownerOf(_tokenId2))) {
                from = ownerOf(_tokenId2);
                to = ownerOf(_tokenId1);
                tokenIdOfStarToXfr = _tokenId1;
            }
            else {
                revert ("exchangeStars: The person making the request does not own the Star and so cannot transfer it");
            }
        }

        //2. You don't have to check for the price of the token (star)
        //3. Get the owner of the two tokens (ownerOf(_tokenId1), ownerOf(_tokenId2)
        //4. Use _transferFrom function to exchange the tokens.

        _transferFrom(to, tokenIdOfStarToXfr);

        return true;
    }

    // Implement Task 1 Transfer Stars
    function _transferFrom(address _to1, uint256 _tokenId) private {
        //1. Check if the sender is the ownerOf(_tokenId)
        require (msg.sender == (ownerOf(_tokenId)), "_transferfrom: The person making the request does not own the Star and so cannot transfer it");
        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        Star memory starToXfr = tokenIdToStarInfo[_tokenId];

        // Remove the Star from the person sending the Star
        tokenIdToStarInfo[msg.sender] = "";

        // Add the Star to the person receiving the Star
        tokenIdToStarInfo[_to1] = starToXfr;

        // Send the Star to the new address from the sender
        transferFrom(msg.sender, _to1, starToXfr);
    }

    // Implement Task 1 Transfer Stars
    function transferStar(address _to1, uint256 _tokenId) public {
        //1. Check if the sender is the ownerOf(_tokenId)
        if (msg.sender != (ownerOf(_tokenId))) {
            revert ("transferStar: The person making the request does not own the Star and so cannot transfer it");
        }
        //2. Use the transferFrom(from, to, tokenId); function to transfer the Star
        Star memory starToXfr = tokenIdToStarInfo[_tokenId];

        // Remove the Star from the person sending the Star
        tokenIdToStarInfo[msg.sender] = "";

        // Add the Star to the person receiving the Star
        tokenIdToStarInfo[_to1] = starToXfr;

        // Send the Star to the new address from the sender
        transferFrom(msg.sender, _to1, starToXfr);
    }

}