// How to deploy the contracts?
const VendorFactoryContract = require("./build/VendorFactory.json");
const VendorContract = require("./build/Vendor.json");

const Web3 = require("web3");
const path = require('path');
const fs   = require('fs-extra');

const provider = new Web3.providers.HttpProvider("http://0.0.0.0:8545");
const web3 = new Web3(provider);

let deployedAddress;

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];
    let contract;
    let gasPrice;
    let estimatedGas;
    let res;

    // Find the average price for gas
    await web3.eth.getGasPrice().then((averageGasPrice) => {
            gasPrice = averageGasPrice;
        }).catch(console.error);
    
    // =========== Deploy Empty Vendor  ===========

    contract = new web3.eth.Contract(
        VendorContract.abi, // The json interface?
        undefined, {                                    // (Optional) Address of smart contract to call
        data: '0x' + VendorContract.evm.bytecode.object // The byte code of contract
    });

    const _client = 0;
    const _payee = 0;
    const _creationDate = 0;
    const _expiryDate = 0;
    const _prevBillingDate = 0;
    const _nextBillingDate = 0;
    const _contractHash = 0;
    const _amount = 0;
    const index = 0;

    // Find estimate gas to deploy Vendor Contract
    estimatedGas = await contract
                  .deploy({ data: contract.options.data, arguments:[] })
                  .estimateGas({from: account});
    
    res = await contract
         .deploy({ data: contract.options.data
                 , arguments: 
                   [ _client
                   , _payee
                   , _creationDate
                   , _expiryDate
                   , _prevBillingDate
                   , _nextBillingDate
                   , _contractHash
                   , _amount
                   , index
                   ]  
                 }
                )  
          .send({ from: account, gasPrice: gasPrice, gas: Math.ceil(1.2 * estimatedGas)});    
    
    console.log("Empty vendor contract deployed");

    const emptyVendorContractAddress = res._address;
    
    // =========== Deploy Vendor Factory ===========

    contract = new web3.eth.Contract(
        VendorFactoryContract.abi, // The json interface?
        undefined, {                                    // (Optional) Address of smart contract to call
        data: '0x' + VendorFactoryContract.evm.bytecode.object // The byte code of contract
    });
    
    // Find estimate gas to deploy Vendor Contract
    estimatedGas = await contract
                  .deploy({ data: contract.options.data, arguments: [emptyVendorContractAddress]})
                  .estimateGas({from: account});

    res = await contract
          .deploy({ data: contract.options.data, arguments: [emptyVendorContractAddress]})
          .send({ from: account, gasPrice: gasPrice, gas: Math.ceil(1.2 * estimatedGas)}); 
    
    const vendorFactoryAddress = res._address
    console.log("Vendor factory deployed");

    fs.outputJsonSync(path.resolve(__dirname, 'addresses.json'), {"VendorFactory": vendorFactoryAddress}); 

    return vendorFactoryAddress;
};

deploy();
