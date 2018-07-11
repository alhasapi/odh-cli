pragma solidity 0.4.24;

contract SyncContract {
  uint ipfsHash1;
  uint ipfsHash2;
  function set(uint h, uint h2) public payable returns (uint, uint) {
      ipfsHash1 = h;
      ipfsHash2 = h2;
      return (ipfsHash1, ipfsHash2);
  }

  function get() public view returns (uint, uint) {
    return (ipfsHash1, ipfsHash2);
  }
}

/**
 * The VotingContract contract does this and that...
 */
contract Voting {
  uint number;
  uint accepted;
  address owner;
  mapping (address => bool) voters;

  constructor () public {
    number = 0;
    accepted = 0;
    owner = msg.sender;
  }
  

  function vote (bool choice) public payable {
    voters[msg.sender] = choice;
    if (voters[msg.sender]) {
      accepted += 1;
    }
    number += 1;
  }

  function reachedConsensus () public view returns(bool)  {
    return (accepted > number/2);
  }
}

contract Ownership {
  
  uint hashBlock1;
  uint hashBlock2;
  string c;
  event Insertion(string s);
  event Reading(uint h1, uint h2);
  function setOwnership (string s) payable public {
    c =s;
    emit Insertion(c);
  }
  function getOwnersList() public  payable returns (uint h, uint h_) {
    h = hashBlock1;
    h_ = hashBlock2;
    emit Reading(hashBlock1, hashBlock2);
  }
}

/**
 * The DeletionRequest contract does this and that...
 */
contract DeletionRequest {
  uint h1;
  uint h2;
  address owner;
  bool requestEnded;

  constructor () public {
    owner = msg.sender;
    requestEnded = false;
  }  

  function setHash(uint h, uint h_) public payable {
    if (!requestEnded)
      h1 = h;
      h2 = h_; 
  }

  function isPending () public view returns(bool res) {
    res = !requestEnded;
  }
  
  function stopReq () public payable {
    if (msg.sender == owner) 
      requestEnded = true;
  }
}