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
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star1', "AWS1");
});
/*
it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('Awesome Star2', starId, "AWS2", {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    console.log("acct1: ", user1);
    let user2 = accounts[2];
    console.log("acct2: ", user2);
    let starId = 3;
    let starPrice = web3.utils.toWei(".001", "ether");
    let balance = web3.utils.toWei(".005", "ether");
    console.log("balance: ", balance);
    await instance.createStar('awesome star3', starId, "AWS3",  {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});

    console.log("before : await instance.buyStar(starId, {from: user2, value: balance});");
    await instance.buyStar(starId, {from: user2, value: balance});
    console.log("after : await instance.buyStar(starId, {from: user2, value: balance});");

    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    console.log("balanceOfUser1BeforeTransaction: ", balanceOfUser1BeforeTransaction, " starId ", starId, " balance ", balance);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    console.log("value1 ", value1);
    let value2 = Number(balanceOfUser1AfterTransaction);
    console.log("value2 ", value2);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".001", "ether");
    let balance = web3.utils.toWei(".005", "ether");
    await instance.createStar('awesome star4', starId, "AWS4", {from: user1});
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
    let tokenId = 2;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star6', tokenId, "AWS6", {from: accounts[0]});
    let starData = await instance.tokenIdToStarInfo.call(tokenId);
    console.log("starData ", starData);
    assert.equal(starData.starName, 'Awesome Star6');
    assert.equal(starData.starSymbol, 'AWS6');
});

it('lets 2 users exchange stars', async() => {
    // 1. create 2 Stars with different tokenId
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    
    let user1 = accounts[1];
    let user2 = accounts[2];
    await instance.createStar('awesome star7', starId, "AWS7", {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
// 3. Verify that the owners changed
    let tokenIdA = 3;
    let tokenIdB = 4;

    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star8', tokenIdA, "AWS8", {from: accounts[0]})
    await instance.createStar('Awesome Star9', tokenIdB, "AWS9", {from: accounts[0]})

    assert.equal(await instance.tokenIdToStarInfo.call(tokenIdA), 'Awesome Star8')
    assert.equal(await instance.tokenIdToStarInfo.call(tokenIdB), 'Awesome Star9')
    assert.equal(await instance.tokenIdToStarInfo.call(tokenSymbol), 'AWS8')
    assert.equal(await instance.tokenIdToStarInfo.call(tokenSymbol), 'AWS9')

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

*/