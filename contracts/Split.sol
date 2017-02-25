pragma solidity ^0.4.2;

contract Split {
	address owner;
	address public accountA;
	address public accountB;
	uint256 recieveAmount;
	uint256 splitAmount;

	event LogOnSplitted(uint256 indexed preRecieveAmount, uint256 newRecieveAmount);
	
	function Split(address _accountA, address _accountB) {
		owner = msg.sender;
		accountA = _accountA;
		accountB = _accountB;
		recieveAmount = 0;
	}

	function kill() returns (bool) {
        if (msg.sender == owner) {
            selfdestruct(owner);
            return true;
        }
    }
	
	function () payable {

		splitAmount = msg.value/2;
		
	    if(!accountA.send(splitAmount + msg.value%2)) throw;
	    if(!accountB.send(splitAmount)) throw;

	    LogOnSplitted(recieveAmount, msg.value);
	    recieveAmount = msg.value;
	}
}