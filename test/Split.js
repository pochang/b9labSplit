const PromisifyWeb3 = require("./utils/promisifyWeb3.js");
PromisifyWeb3.promisify(web3);

require("./utils/getTransactionReceiptMined.js");

contract('Split', function(accounts) {

  describe("Deployed", function(){

    var split;
    var accountA = accounts[1];
    var accountB = accounts[2];
    var receiveAmount;
    var accountABalance;
    var accountBBalance;

    beforeEach("New split instance", function(){
      return Split.new(accounts[1], accounts[2])
      .then(function(created){
        split = created;
        splitAddress = split.address;
        web3.eth.getBalance(accounts[1], function(error,_balanceA){
          if(!error) accountABalance = _balanceA;
        });
        web3.eth.getBalance(accounts[2], function(error,_balanceB){
          if(!error) accountBBalance = _balanceB;
        });
      })
    });
  

    it("should return addresses from constructor", function() {

      return web3.eth.getTransactionReceiptMined(split.transactionHash)
      .then(function(receipt){
          return split.accountA();
      })
      .then(function(_accountA) {
          assert.strictEqual(accountA, _accountA);
          return split.accountB();
      })
      .then(function(_accountB) {
          assert.strictEqual(accountB, _accountB);
      });

    });

    it("should send 1 wei to A when received is 1", function() {

      receiveAmount = 1;
      
      return web3.eth.sendTransactionPromise({from: accounts[0], to:split.address, value:receiveAmount})
      .then(function(txhash) {
          return web3.eth.getTransactionReceiptMined(txhash);
      }).then(function(receipt) {
          assert.strictEqual(accountABalance.plus(1).toString(), web3.eth.getBalance(accountA).toString());
          assert.strictEqual(accountBBalance.plus(0).toString(), web3.eth.getBalance(accountB).toString());
          assert.strictEqual('0', web3.eth.getBalance(split.address).toString());
      });

    });

    it("should spit equally, and plus 1 more wei to A, when received is odd", function() {

      receiveAmount = 101;
      splitAmount = 50;
      
      return web3.eth.sendTransactionPromise({from: accounts[0], to:split.address, value:receiveAmount})
      .then(function(txhash) {
          return web3.eth.getTransactionReceiptMined(txhash);
      }).then(function(receipt) {
          assert.strictEqual(accountABalance.plus(splitAmount+1).toString(), web3.eth.getBalance(accountA).toString());
          assert.strictEqual(accountBBalance.plus(splitAmount).toString(), web3.eth.getBalance(accountB).toString());
          assert.strictEqual('0', web3.eth.getBalance(split.address).toString());
      });

    });

    it("should spit equally when received is even", function() {

      receiveAmount = 1000;
      splitAmount = 500;
      
      return web3.eth.sendTransactionPromise({from: accounts[0], to:split.address, value:receiveAmount})
      .then(function(txhash) {
          return web3.eth.getTransactionReceiptMined(txhash);
      }).then(function(receipt) {
          assert.strictEqual(accountABalance.plus(splitAmount).toString(), web3.eth.getBalance(accountA).toString());
          assert.strictEqual(accountBBalance.plus(splitAmount).toString(), web3.eth.getBalance(accountB).toString());
          assert.strictEqual('0', web3.eth.getBalance(split.address).toString());
      });

    });    


  });

});