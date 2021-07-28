const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider("http://0.0.0.0:8545");
const web3 = new Web3(provider);
const VendorContractJson = require("./build/Vendor.json");

export default (address) => new web3.eth.Contract(
    VendorContratJson.abi,
    address
);