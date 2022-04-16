const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    console.log("acct0: ", accounts[0]);
    console.log("acct1: ", accounts[1]);
    console.log("acct2: ", accounts[2]);
    await instance.createStar('Awesome Star1', tokenId, "AWS1", {from: accounts[0]});
    //console.log (await instance.tokenIdToStarInfo.call(tokenId));
    let lclVar = (await instance.tokenIdToStarInfo.call(tokenId));
    //console.log("lclvar ", lclVar);
    assert.equal(lclVar.name, 'Awesome Star1');
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".001", "ether");
    await instance.createStar('Awesome Star2', starId, "AWS2", {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".001", "ether");
    let balance = web3.utils.toWei(".005", "ether");
    // create the Star and mint1 with User1 as the owner
    await instance.createStar('awesome star3', starId, "AWS3",  {from: user1});

    // Get the 'before' values of the wallets of the 2 users for assertion testing later 
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    let balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);

    // User1 puts the star up for sale
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    // Have user2 buy the star - this should reduce the balance of user2 and increase the value of user1
    await instance.buyStar(starId, {from: user2, value: balance});

    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let balanceOfUser2AfterTransaction = await web3.eth.getBalance(user2);
    let value1 = Number(balanceOfUser1AfterTransaction) + Number(starPrice);

    console.log("balanceOfUser1BeforeTransaction ", Number(balanceOfUser1BeforeTransaction));
    console.log("balanceOfUser1AfterTransaction ", Number(balanceOfUser1AfterTransaction));
    console.log("balanceOfUser2BeforeTransaction ", Number(balanceOfUser2BeforeTransaction));
    console.log("balanceOfUser2AfterTransaction ", Number(balanceOfUser2AfterTransaction));
    assert.isAbove(Number(balanceOfUser1AfterTransaction), Number(balanceOfUser1BeforeTransaction));
    //assert.isBelow(Number(balanceOfUser2AfterTransaction), Number(balanceOfUser2BeforeTransaction));
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".001", "ether");
    let balance = web3.utils.toWei(".005", "ether");
    await instance.createStar('awesome star10', starId, "AWS10", {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    //let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".001", "ether");
    let balance = web3.utils.toWei(".005", "ether");
    await instance.createStar('awesome star5', starId, "AWS5", {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance, gasPrice:0});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('NEW: can add the star name and star symbol properly', async() => {
    let tokenId = 6;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star6', tokenId, "AWS6", {from: accounts[0]});
    let starData = await instance.tokenIdToStarInfo.call(tokenId);
    console.log("starData ", starData);
    assert.equal(starData.name, 'Awesome Star6');
});

it('lets 2 users exchange stars', async() => {
    // 1. create 2 Stars with different tokenId
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    
    let user1 = accounts[1];
    let user2 = accounts[2];

    // create 2 stars and assign one to each user
    let tokenId8 = 8;
    let tokenId9 = 9;
    let instance = await StarNotary.deployed();
    // create star8 for user1
    await instance.createStar('Awesome Star8', tokenId8, "AWS8", {from: user1});
    assert.equal(await instance.ownerOf.call(tokenId8), user1);
    // create star9 for user2
    await instance.createStar('Awesome Star9', tokenId9, "AWS9", {from: user2});
    // check star8 added to mappings
    let starData8 = (await instance.tokenIdToStarInfo.call(tokenId8));
    assert.equal(starData8.name, 'Awesome Star8');
    // check star9 added to mappings
    let starData9 = (await instance.tokenIdToStarInfo.call(tokenId9));
    assert.equal(starData9.name, 'Awesome Star9');

    // now swap them so user1 has star9 and user2 has star8
    await instance.exchangeStars(tokenId8, tokenId9, {from: user1});
    // check that user2 has Star8

    let owner1 = (await instance.ownerOf.call(tokenId9));    
    let owner2 = (await instance.ownerOf.call(tokenId8));
    console.log("After: owner1 ", owner1, " user1 ", user1);
    console.log("After: owner2 ", owner2, " user2 ", user2);
    assert.equal(await instance.ownerOf.call(tokenId8), user2);
    // check that user1 has Star9
    assert.equal(await instance.ownerOf.call(tokenId9), user1);
});

it('lets a user transfer a star', async() => {
    // 1. create a Star with different tokenId
    // 2. use the transferStar function implemented in the Smart Contract
    // 3. Verify the star owner changed.
});

it('lookUptokenIdToStarInfo test', async() => {
    // 1. create a Star with different tokenId
    // 2. Call your method lookUptokenIdToStarInfo
    // 3. Verify if you Star name is the same
});