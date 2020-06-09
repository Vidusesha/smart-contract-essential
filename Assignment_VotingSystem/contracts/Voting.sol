pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "./ERC721Token.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";


contract Voting is ERC721Token {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool authorized;
        bool voted;
        uint256 vote;
    }

    address public chairperson;
    string public electionName;

    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    uint256 public totalVotes;

    constructor(address _proxyRegistryAddress)
        public
        ERC721Token("VoteToken", "VTK", _proxyRegistryAddress)
    {
        chairperson = msg.sender;
    }

    modifier _onlyChairperson() {
        require(
            msg.sender == chairperson,
            "Unautorised access , only Owner can access"
        );
        _;
    }

    function Election(string memory _name) public {
        chairperson = msg.sender;
        electionName = _name;
    }

    function addCandidate(string memory _name) public _onlyChairperson {
        candidates.push(Candidate(_name, 0));
    }

    function authorize(address _person) public _onlyChairperson {
        voters[_person].authorized = true;
    }

    function vote(uint256 _voteIndex) public {
        require(!voters[msg.sender].voted, "Already voted on this address");
        require(voters[msg.sender].authorized, "Wait for authorization");

        voters[msg.sender].vote = _voteIndex;
        voters[msg.sender].voted = true;

        candidates[_voteIndex].voteCount += 1;
        totalVotes += 1;
        mintVoting(candidates[_voteIndex], electionName);
    }

    function mintVoting(
        Candidate memory candidatesInit,
        string memory electionNameInit
    ) public {
        candidates.push(candidatesInit);
        electionName = electionNameInit;
        mintTo(msg.sender);
    }
}
