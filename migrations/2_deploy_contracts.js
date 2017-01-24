module.exports = function(deployer) {
	var accounts = web3.eth.accounts;
	deployer.deploy(Split, accounts[1], accounts[2]);
};
