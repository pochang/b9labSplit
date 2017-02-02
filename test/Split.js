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

  var split;
  var splitTxHash;
  var splitAddress;
  var accountA;
  var accountB;
  var receiveAmount;
  const accountABalance = web3.eth.getBalance(accounts[1]);
  const accountBBalance = web3.eth.getBalance(accounts[2]);

  describe("Split Deployed", function(){

    beforeEach("New split instance", function(){

      Split.new(accounts[1], accounts[2])
      .then(function(created){
         split = created;
         splitTxHash = split.transactionHash;
         splitAddress = split.address;
      })
    });
  

    it("should return addresses from constructor", function() {

      web3.eth.getTransactionReceiptMined(splitTxHash)
      .then(function(receipt){
          return split.accountA();
      })
      .then(function(_accountA) {
          assert.strictEqual(accounts[1], _accountA);
          accountA = _accountA;
          return split.accountB();
      })
      .then(function(_accountB) {
          assert.strictEqual(accounts[2], _accountB);
          accountB = _accountB;
      });

    });

    it("it should split nothing and return 1 wei to sender when received is 1", function() {

      receiveAmount = 1;
      
      return web3.eth.sendTransactionPromise({from: accounts[0], to:splitAddress, value:receiveAmount})
      .then(function(txhash) {
          
          splitAmount = parseInt(receiveAmount/2);
          assert.strictEqual(accountABalance.plus(splitAmount).toString(), web3.eth.getBalance(accountA).toString());
          assert.strictEqual(accountBBalance.plus(splitAmount).toString(), web3.eth.getBalance(accountB).toString());
          assert.strictEqual(0, web3.eth.getBalance(splitAddress).toString());
      })
      .catch(function(error){
          return false;
      });

    });

    it("it should split equally and return 1 wei to sender when received is odd", function() {

      receiveAmount = 1001;
      
      return web3.eth.sendTransactionPromise({from: accounts[0], to:splitAddress, value:receiveAmount})
      .then(function(txhash) {
          
          splitAmount = parseInt(receiveAmount/2);
          assert.strictEqual(accountABalance.plus(splitAmount).toString(), web3.eth.getBalance(accountA).toString());
          assert.strictEqual(accountBBalance.plus(splitAmount).toString(), web3.eth.getBalance(accountB).toString());
          assert.strictEqual(0, web3.eth.getBalance(splitAddress).toString());
      })
      .catch(function(error){
          return false;
      });

    });

    it("it should split equally when received is even", function() {

      receiveAmount = 1000;
      
      return web3.eth.sendTransactionPromise({from: accounts[0], to:splitAddress, value:receiveAmount})
      .then(function(txhash) {
          
          splitAmount = parseInt(receiveAmount/2);
          assert.strictEqual(accountABalance.plus(splitAmount).toString(), web3.eth.getBalance(accountA).toString());
          assert.strictEqual(accountBBalance.plus(splitAmount).toString(), web3.eth.getBalance(accountB).toString());
          assert.strictEqual(0, web3.eth.getBalance(splitAddress).toString());
      })
      .catch(function(error){
          return false;
      });

    });


  });

});