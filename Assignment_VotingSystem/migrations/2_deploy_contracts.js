const Voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
  // OpenSea proxy registry addresses for rinkeby and mainnet.

    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  deployer.deploy(Voting, proxyRegistryAddress, {gas: 5000000});
};
