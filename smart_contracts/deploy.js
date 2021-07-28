// How to deploy the contracts?
const VendorFactoryContract = require("./build/VendorFactory.json");
const Web3 = require("web3");
const path = require('path');
const fs   = require('fs-extra');

const provider = new Web3.providers.HttpProvider("http://0.0.0.0:8545");
const web3 = new Web3(provider);

let deployedAddress;

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    console.log('Attempting to deploy from account', accounts[0]);

    let contract = new web3.eth.Contract(
        VendorFactoryContract.abi, // The json interface?
        undefined, {                                    // (Optional) Address of smart contract to call
        data: '0x' + VendorFactoryContract.evm.bytecode.object // The byte code of contract
    });
    
    let gasPrice;
    await web3.eth.getGasPrice().then((averageGasPrice) => {
        gasPrice = averageGasPrice;
    }).catch(console.error);

    let gas = await contract
    .deploy({ data: contract.options.data, arguments: []})
    .estimateGas({from: account});
    
    console.log(`estimated gas:${gas}`);

    // Q. Why do we need to pass arguments?
    let res = await contract
    .deploy({ data: contract.options.data, arguments: []})
    .send({ from: account, gasPrice: gasPrice, gas: Math.ceil(1.2 * gas)});    
    fs.outputJsonSync(path.resolve(__dirname, 'addresses.json'), {"VendorFactory": res._address}); 
    return res._address;
};

deploy();
