const Voting = artifacts.require("Voting");
const ethers = require("ethers");
const truffleAssert = require("truffle-assertions");

contract("Voting", (accounts) => {
  let instance;

  before(() => {
    return Voting.deployed().then((contractInstance) => {
      instance = contractInstance;
    });
  });

  it("should have name as VoteToken", () => {
    return instance.name().then((name) => {
      assert.equal(name, "VoteToken", "name is not VoteToken");
    });
  });
  it("checking Mint", () => {
    const candidates = {
      name: "George",
      voteCount: 1,
    };

    const electionName = "Vote for Team Leader";
    return instance
      .mintVoting(candidates, electionName)
      .then(() => instance.totalSupply())
      .then((supply) => {
        assert.equal(supply.valueOf(), 1, "total supply is not 1");
      });
  });

  it("check Election Name", () => {
    return instance.electionName().then((election) => {
      assert.equal(
        election.valueOf(),
        "Vote for Team Leader",
        "Wrong election name"
      );
    });
  });

  it("BalanceOf", async () => {
    const balanceOf = await instance.balanceOf.call(accounts[0]);
    assert.equal(balanceOf, 1, "BalanceOf unsuccessfull");
  });

  it("OwnerOf", async () => {
    const ownerOf = await instance.ownerOf.call(1);
    assert.equal(ownerOf, accounts[0], "OwnerOf unsuccessfull");
  });

  it("checks setApprovalForAll", async () => {
    const setApprovalForAll = await instance.setApprovalForAll(
      accounts[1],
      true,
      { from: accounts[0] }
    );

    truffleAssert.eventEmitted(
      setApprovalForAll,
      "ApprovalforAll",
      (obj) => {
        return (
          obj.owner === accounts[0] &&
          obj.operator === accounts[1] &&
          obj.approved === true
        );
      },
      "ApprovalforAll Event failed"
    );
  });

  it("Checks approval function", async () => {
    const approve = await instance.approve(accounts[1], 1, {
      from: accounts[0],
    });
    const approvedAddress = await instance.getApproved.call(1);
    assert.equal(approvedAddress, accounts[1], "Approval failed");
  });

  it("checks getApproved", async () => {
    const getApproved = await instance.getApproved(1);

    assert.equal(getApproved, accounts[1], "getApproved failed");
  });

  it("Checks isApprovedForAll", async () => {
    const isApprovedForAll = await instance.isApprovedForAll.call(
      accounts[0],
      accounts[1]
    );
    assert.equal(isApprovedForAll, true, "isApprovedForAll failed");
  });

  it("Checks transferFrom", async () => {
    await instance.transferFrom(accounts[0], accounts[1], 1);
    const ownerOf = await instance.ownerOf.call(1);
    assert.equal(ownerOf, accounts[1], "Owner not valid");
  });

  it("Checks safeTransferFrom", async () => {
    const candidates = {
      name: "John",
      voteCount: 1,
    };

    const electionName = "Vote for Team Leader";
    return instance.mintVoting(candidates, electionName).then(async () => {
      const prevOwner = await instance.ownerOf.call(2);
      assert.equal(prevOwner, accounts[0], "Token owner not valid");
      const safeTX = await instance.safeTransferFrom(
        accounts[0],
        accounts[1],
        2
      );
      const newOwner = await instance.ownerOf.call(2);
      assert.equal(newOwner, account[1], "Token transfer failed");
    });
  });

  it("Checks safeTransferFrom(data)", async () => {
    const candidates = {
      name: "Milton",
      voteCount: 1,
    };

    const electionName = "Vote for Team Leader";
    return instance.mintVoting(candidates, electionName).then(async () => {
      const prevOwner = await instance.ownerOf.call(3);
      assert.equal(prevOwner, accounts[0], "Token owner not valid");
      await instance.safeTransferFrom(accounts[0], accounts[1], 3, "0x456234");
      const newOwner = await instance.ownerOf.call(3);
      assert.equal(newOwner, accounts[1], "Token transfer failed");
    });
  });

  it("Checks for ERC165 compliance", async () => {
    const ERC165 = await instance.supportsInterface.call("0x01ffc9a7"); //0x01ffc9a7 is ERC165 interface ID.
    assert.equal(ERC165, true, "Contract is ERC165 compliant");
  });
});
