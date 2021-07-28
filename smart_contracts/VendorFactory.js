const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider("http://0.0.0.0:8545");
const web3 = new Web3(provider);
const VendorFactoryJson = require("./build/VendorFactory.json");
const addresses = require("./addresses.json");

const vendorFactoryAddress = addresses["VendorFactory"];

const VendorFactory = new web3.eth.Contract(
    VendorFactoryJson.abi,
    vendorFactoryAddress
);

module.exports = VendorFactory;