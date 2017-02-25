const PromisifyWeb3 = require("./utils/promisifyWeb3.js");
PromisifyWeb3.promisify(web3);

web3.eth.getTransactionReceiptMined = function (txnHash, interval) {
    var transactionReceiptAsync;
    interval = interval ? interval : 500;
    transactionReceiptAsync = function(txnHash, resolve, reject) {
        try {
            var receipt = web3.eth.getTransactionReceipt(txnHash);
            if (receipt == null) {
                setTimeout(function () {
                    transactionReceiptAsync(txnHash, resolve, reject);
                }, interval);
            } else {
                resolve(receipt);
            }
        } catch(e) {
            reject(e);
        }
    };

    if (Array.isArray(txnHash)) {
        var promises = [];
        txnHash.forEach(function (oneTxHash) {
            promises.push(web3.eth.getTransactionReceiptMined(oneTxHash, interval));
        });
        return Promise.all(promises);
    } else {
        return new Promise(function (resolve, reject) {
                transactionReceiptAsync(txnHash, resolve, reject);
            });
    }
};

contract('Split', function(accounts) {

  describe("Deployed", function(){

    var split;
    var splitTxHash;
    var splitAddress;
    var accountA = accounts[1];
    var accountB = accounts[2];
    var receiveAmount;
    var accountABalance;
    var accountBBalance;

    beforeEach("New split instance", function(){
      return Split.new(accounts[1], accounts[2])
      .then(function(created){
        split = created;
        splitTxHash = split.transactionHash;
        splitAddress = split.address;
        accountABalance = web3.eth.getBalance(accounts[1]);
        accountBBalance = web3.eth.getBalance(accounts[2]);
      })
    });
  

    it("should return addresses from constructor", function() {

      return web3.eth.getTransactionReceiptMined(splitTxHash)
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
      
      return web3.eth.sendTransactionPromise({from: accounts[0], to:splitAddress, value:receiveAmount})
      .then(function(txhash) {
          return web3.eth.getTransactionReceiptMined(txhash);
      }).then(function(receipt) {
          assert.strictEqual(accountABalance.plus(1).toString(), web3.eth.getBalance(accountA).toString());
          assert.strictEqual(accountBBalance.plus(0).toString(), web3.eth.getBalance(accountB).toString());
          assert.strictEqual('0', web3.eth.getBalance(splitAddress).toString());
      });

    });

    it("should spit equally, and plus 1 more wei to A, when received is odd", function() {

      receiveAmount = 101;
      splitAmount = 50;
      
      return web3.eth.sendTransactionPromise({from: accounts[0], to:splitAddress, value:receiveAmount})
      .then(function(txhash) {
          return web3.eth.getTransactionReceiptMined(txhash);
      }).then(function(receipt) {
          assert.strictEqual(accountABalance.plus(splitAmount+1).toString(), web3.eth.getBalance(accountA).toString());
          assert.strictEqual(accountBBalance.plus(splitAmount).toString(), web3.eth.getBalance(accountB).toString());
          assert.strictEqual('0', web3.eth.getBalance(splitAddress).toString());
      });

    });

    it("should spit equally when received is even", function() {

      receiveAmount = 1000;
      splitAmount = 500;
      
      return web3.eth.sendTransactionPromise({from: accounts[0], to:splitAddress, value:receiveAmount})
      .then(function(txhash) {
          return web3.eth.getTransactionReceiptMined(txhash);
      }).then(function(receipt) {
          assert.strictEqual(accountABalance.plus(splitAmount).toString(), web3.eth.getBalance(accountA).toString());
          assert.strictEqual(accountBBalance.plus(splitAmount).toString(), web3.eth.getBalance(accountB).toString());
          assert.strictEqual('0', web3.eth.getBalance(splitAddress).toString());
      });

    });    


  });

});