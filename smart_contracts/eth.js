const Web3 = require("web3");
const provider = new Web3.providers.HttpProvider("http://0.0.0.0:8545");
const web3 = new Web3(provider);
const VendorContractJson = require("./build/Vendor.json");
const VendorFactoryJson = require("./build/VendorFactory.json");
const addresses = require("./addresses.json");

const Vendor = async (address) => await new web3.eth.Contract(
    VendorContractJson.abi, 
    address
    );

const VendorFactory = async () => await web3.eth.Contract(
    VendorFactoryJson.abi,
    addresses["VendorFactory"]
    );

const accounts = async () =>  web3.eth.getAccounts();

module.exports = {
    Vendor,
    VendorFactory,
    accounts
}