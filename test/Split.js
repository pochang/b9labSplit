const PromisifyWeb3 = require("./utils/promisifyWeb3.js");
PromisifyWeb3.promisify(web3);

contract('Split', function(accounts) {

  var split;

  describe("Split Deployed", function(){
    before(function(){
      split = Split.deployed();
    });
  

    it("should return addresses from constructor", function() {

      return split.accountA()
      .then(function(accountA) {
          assert.equal(accounts[1], accountA);
          return split.accountB();
      }).then(function(accountB) {
          assert.equal(accounts[2], accountB);
      });

    });

    describe("Test split wei", function(){
      before(function(){
        const accountABalance = web3.eth.getBalance(web3.eth.accounts[1]);
        const accountBBalance = web3.eth.getBalance(web3.eth.accounts[2]);
        var receiveAmount;
        var leftAmount;
      });

      it("it should keep 1 wei and split nothing when received is 1", function() {
      
        receiveAmount = 1;

      });

      it("it should equally split wei when received is even", function() {
      
        receiveAmount = 10;

      });

      it("it should keep 1 wei and equally split the rest of wei when received is odd", function() {

        receiveAmount = 1001;
        
      });

      after(function(){
        return web3.eth.sendTransactionPromise({from: web3.eth.accounts[0], to: split.address, value:receiveAmount})
        .then(function(txhash) {
            
            if(receiveAmount==1){
              splitAmount = 0;
              leftAmount = 1;
            }

            if(receiveAmount%2==1){
              splitAmount = (receiveAmount-1)/2;
              leftAmount = 1;
            }else{
              splitAmount = receiveAmount/2;
              leftAmount = 0;
            }

            assert.equal(accountABalance.plus(splitAmount).toString(), web3.eth.getBalance(web3.eth.accounts[1]).toString());
            assert.equal(accountBBalance.plus(splitAmount).toString(), web3.eth.getBalance(web3.eth.accounts[2]).toString());
            assert.equal(leftAmount, web3.eth.getBalance(split.address).toString());
            
        })
        .catch(function(error){
            return false;
        });
      });

    });

  });

});