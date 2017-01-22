pragma solidity ^0.4.2;

contract Split {
	address accountA;
	address accountB;
	uint256 newDepositAmount;
	
	function Split() payable {
	    accountA = 0x9e3eaa4ec2bad4f98262c910c0d41268c22798e3;
	    accountB = 0xc90a98661521e17a8df153b3a39c66b341e3a597;
	}
	
	function doSplit() payable returns (bool) {
	    newDepositAmount = msg.value;
	    if(accountA.send(newDepositAmount/2)){
	        if(accountB.send(newDepositAmount/2)){
	            
	        }
	    }
	}
	
	function () payable {}
}
