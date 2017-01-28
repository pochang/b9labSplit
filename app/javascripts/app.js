var accounts;
var addressA;
var addressB;
var contractAddress;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function getBalanceSplit() {
  web3.eth.getBalance(contractAddress, function(err,split_balance){
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }
      var split_balance_element = document.getElementById("split_balance");
      split_balance_element.innerHTML = split_balance;
  });
};

function getBalanceA(){
  web3.eth.getBalance(addressA, function(err,accountA_balance){
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }
      var accountA_balance_element = document.getElementById("accountA_balance");
      accountA_balance_element.innerHTML = accountA_balance;
  });
}

function getBalanceB(){
  web3.eth.getBalance(addressB, function(err,accountB_balance){
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }
      var accountB_balance_element = document.getElementById("accountB_balance");
      accountB_balance_element.innerHTML = accountB_balance;
  });
}

function sendToSplit() {

  var amount = parseInt(document.getElementById("amount").value);
  
  setStatus("Initiating transaction... (please wait)");

  web3.eth.sendTransaction({from:accountOwner, to:contractAddress, value:amount}, function(err, tx_hash){
      if (err != null) {
          setStatus("There was an error sending ether to Split contract.");
          return;
      }else{
        setStatus("Waiting for mining...");
        return web3.eth.getTransactionReceiptMined(tx_hash)
          .then(function(receipt){
              setStatus("Transaction complete!");
              getBalanceA();
              getBalanceB();
              getBalanceSplit();
          });
      }
  });
  
};

window.onload = function() {

  var split = Split.deployed();
  contractAddress = split.address;

  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      setStatus("There was an error fetching your accounts.");
      document.getElementById("send").disabled = true;
      return;
    }

    if (accs.length == 0) {
      setStatus("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      document.getElementById("send").disabled = true;
      return;
    }

    accounts = accs;
    accountOwner = accounts[0];

    split.accountA()
    .then(function(accountA) {
        addressA = accountA;
        console.log("addressA:"+addressA);
        getBalanceA();
    });

    split.accountB()
    .then(function(accountB) {
        addressB = accountB;
        console.log("addressB:"+addressB);
        getBalanceB();
    });

    getBalanceSplit();

  });

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
}