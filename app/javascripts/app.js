var accounts;
var accountA;
var accountB;
var split = Split.deployed();
var contractAddress = split.address;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function refreshBalance() {
  web3.eth.getBalance(contractAddress, function(err,split_balance){
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }
      var split_balance_element = document.getElementById("split_balance");
      split_balance_element.innerHTML = split_balance;
  });

  web3.eth.getBalance(accountA, function(err,accountA_balance){
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }
      var accountA_balance_element = document.getElementById("accountA_balance");
      accountA_balance_element.innerHTML = accountA_balance;
  });

  web3.eth.getBalance(accountB, function(err,accountB_balance){
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }
      var accountB_balance_element = document.getElementById("accountB_balance");
      accountB_balance_element.innerHTML = accountB_balance;
  });
  
};

function sendToSplit() {

  var amount = parseInt(document.getElementById("amount").value);
  
  setStatus("Initiating transaction... (please wait)");

  web3.eth.sendTransaction({from:accountOwner, to:contractAddress, value:web3.toWei(amount,"ether")}, function(err, tx_hash){
      if (err != null) {
          alert("There was an error sending ether to Split contract.");
          return;
      }else{
          web3.eth.getTransactionReceipt(tx_hash, function(err, receipt){
            if (err != null) {
              alert("There was an error getting transaction receipt.");
              return;
            }else{
              setStatus("Transaction complete!");
              refreshBalance();
            }
          });
      }
  });

};

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    accountOwner = accounts[0];
    accountA = accounts[1];
    accountB = accounts[2];

    refreshBalance();
  });
}
