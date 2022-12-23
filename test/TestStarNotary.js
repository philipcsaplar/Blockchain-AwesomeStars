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
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    await instance.giveTransferApproval(user2, starId,{from: user1});
    //get final balance after all transactions
    balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    //buy Star
    await instance.buyStar(starId, {from: user2, value: balance});
    //get balance of user of transaction
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    //do the maths
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    //check assertion
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    await instance.giveTransferApproval(user2, starId,{from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    await instance.giveTransferApproval(user2, starId,{from: user1});
    let balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    let buyStar = await instance.buyStar(starId, {from: user2, value: balance});
    let balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    let gasUsed = buyStar.receipt.gasUsed;
    // Obtain gasPrice from the transaction
    const tx = await web3.eth.getTransaction(buyStar.tx);
    let gasPrice = tx.gasPrice;
    let transactionCost = (Number(gasUsed) * Number(gasPrice)) + Number(starPrice);
    let value = Number(balanceOfUser2BeforeTransaction) - (Number(balanceAfterUser2BuysStar) + Number(transactionCost));
    expect(Number(balanceOfUser2BeforeTransaction)).greaterThan(Number(balanceAfterUser2BuysStar));
    // assert.equal(value, 0);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();
    let starId = 6;
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    let name = await instance.name();
    let symbol = await instance.symbol();
    assert.equal(name+" "+symbol, "AwesomeStars AWS");
});

it('lets 2 users exchange stars', async() => {
    // 1. create 2 Stars with different tokenId
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    //create star for user1
    let starId1 = 7;
    await instance.createStar('awesome star1', starId1, {from: user1});
    //set approval for transfer
    await instance.giveTransferApproval(user2, starId1,{from: user1});
    //create star for user2
    let starId2 = 8;
    await instance.createStar('awesome star2', starId2, {from: user2});
    //set approval for transfer
    await instance.giveTransferApproval(user1, starId2,{from: user2});
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    // user1 to exchange with user2
    await instance.exchangeStars(starId1,starId2,{from: user1});
    // 3. Verify that the owners changed
    assert.equal(await instance.getOwnerOfToken(starId1), user2);
    assert.equal(await instance.getOwnerOfToken(starId2), user1);
});

it('lets a user transfer a star', async() => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    //create star for user1
    let starId = 9;
    await instance.createStar('awesome star1', starId, {from: user1});
    // 2. use the transferStar function implemented in the Smart Contract
    //set approval for transfer
    await instance.giveTransferApproval(user2, starId,{from: user1});
    await instance.transferStar(user2, starId, {from: user1});
    // 3. Verify the star owner changed.
    assert.equal(await instance.getOwnerOfToken(starId), user2);
});

it('lookUptokenIdToStarInfo test', async() => {
    // 1. create a Star with different tokenId
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    //create star for user1
    let starId = 10;
    await instance.createStar('awesome star1', starId, {from: user1});
    // 2. Call your method lookUptokenIdToStarInfo
    let lookUp = await instance.lookUptokenIdToStarInfo(starId);
    // 3. Verify if you Star name is the same
    assert.equal(lookUp.name, "awesome star1");
});