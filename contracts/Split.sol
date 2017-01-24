pragma solidity ^0.4.2;

contract Split {
	address owner;
	address public accountA;
	address public accountB;
	uint256 recieveAmount;
	uint256 splitAmount;

	event LogOnSplitted(uint256 indexed previousRecieveAmount, uint256 newRecieveAmount);
	
	function Split(address _accountA, address _accountB) {
		owner = msg.sender;
		accountA = _accountA;
		accountB = _accountB;
	}
	
	function doSplit() payable returns (bool) {

		LogOnSplitted(recieveAmount, msg.value);

		if(msg.value%2==1){
			splitAmount = (msg.value-1)/2;
		}else{
			splitAmount = msg.value/2;
		}

	    if(!accountA.send(splitAmount)){
	    	throw;	
	    }
	    if(!accountB.send(splitAmount)){
	    	throw;	
	    }
	}

	function kill() returns (bool) {
        if (msg.sender == owner) {
            suicide(owner);
            return true;
        }
    }
	
	function () {
		doSplit();
	}
}
