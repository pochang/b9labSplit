const PromisifyWeb3 = require("./utils/promisifyWeb3.js");
PromisifyWeb3.promisify(web3);

contract('Split', function(accounts) {

  it("should return addresses from constructor", function() {
    var split = Split.deployed();

    return split.accountA()
    .then(function(accountA) {
        assert.equal(accounts[1], accountA);
        return split.accountB();
    }).then(function(accountB) {
      assert.equal(accounts[2], accountB);
    });

  });

  it("it should equally split ether", function() {
    const accountABalance = parseFloat(web3.eth.getBalance(web3.eth.accounts[1]).toString());
    const accountBBalance = parseFloat(web3.eth.getBalance(web3.eth.accounts[2]).toString());
    const recieveAmount = web3.toWei(1);

    var split = Split.deployed();
    
    return web3.eth.sendTransactionPromise({from: web3.eth.accounts[0], to: split.address, value:recieveAmount})
    .then(function(error, txhash) {
        
        var splitAmount = recieveAmount/2;
        assert.equal(accountABalance + splitAmount, parseFloat(web3.eth.getBalance(web3.eth.accounts[1]).toString()));
        assert.equal(accountBBalance + splitAmount, parseFloat(web3.eth.getBalance(web3.eth.accounts[2]).toString()));
        
    });
  });
});