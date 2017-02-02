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
		
		if(msg.value%2==1){
			splitAmount = (msg.value-1)/2;
			if(!msg.sender.send(1)){
				throw;
			}
		}else{
			splitAmount = msg.value/2;
		}

	    if(!accountA.send(splitAmount)){
	    	throw;	
	    }
	    if(!accountB.send(splitAmount)){
	    	throw;	
	    }

	    LogOnSplitted(recieveAmount, msg.value);
	    recieveAmount = msg.value;
	}
}