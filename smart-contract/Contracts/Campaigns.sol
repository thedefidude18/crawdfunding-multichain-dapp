// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CampaignFactory is Ownable{
    address[] public deployedCampaigns;

    function createCampaign(uint minimum, string memory name, string memory description, string memory image, uint target) public {
        address newCampaign = address(new Campaign(minimum, msg.sender,name,description,image,target));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
    }

    Request[] public requests;
    address public manager;
    uint public minimunContribution;
    string public CampaignName;
    string public CampaignDescription;
    string public imageUrl;
    uint public targetToAchieve;
    address[] public contributers;
    mapping(address => bool) public approvers;
    uint public approversCount;
    uint public numRequests;
    mapping(uint => mapping(address => bool)) approvals;
    event Received(address addr, uint amount);
    event Fallback(address addr, uint amount);

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

  constructor(uint minimun, address creator,string memory name, string memory description,string memory image,uint target) {
      manager = creator;
      minimunContribution = minimun;
      CampaignName=name;
      CampaignDescription=description;
      imageUrl=image;
      targetToAchieve=target;
  }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    fallback() external payable { 
        emit Fallback(msg.sender, msg.value);
    }

  function contibute() public payable {
      require(msg.value > minimunContribution );

      contributers.push(msg.sender);
      approvers[msg.sender] = true;
      approversCount++;
  }

  function createRequest(string memory description, uint value, address recipient) public  { 
      requests.push(
        Request({
            description: description,
            value:  value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        })
      );
  }

  function approveRequest(uint index) public restricted {
      require(approvers[msg.sender]);
      require(!approvals[index][msg.sender]);

      approvals[index][msg.sender] = true;
      requests[index].approvalCount++;
  }

  function finalizeRequest(uint index) public restricted{
      require(requests[index].approvalCount > (approversCount / 2));
      require(!requests[index].complete);

      payable(requests[index].recipient).transfer(requests[index].value);
      requests[index].complete = true;

  }

    function getSummary() public view returns (uint,uint,uint,uint,address,string memory ,string memory ,string memory, uint) {
        return(
            minimunContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager,
            CampaignName,
            CampaignDescription,
            imageUrl,
            targetToAchieve
          );
    }

    function getRequestsCount() public view returns (uint){
        return requests.length;
    }
}
