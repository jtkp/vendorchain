const { response } = require('express');

const VendorFactory = require("./smart_contracts/VendorFactory");
const Web3 = require("web3");

const provider = new Web3.providers.HttpProvider("http://0.0.0.0:8545");
const web3 = new Web3(provider);

// set up express app
const express = require('express');
const app = express();
const port = 3000;
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// connect db
const db = require('./queries');
const oracle = require('./oracle');

app.get('/', (req, res) => {
  res.json({info: 'hello world'})
})

/* ================================ Users ================================*/
app.get('/admin', db.getAdmin);
app.get('/vendors', db.getVendors);
app.get('/user/:address', db.getUserByAddress);
app.get('/user/email/:email', db.getUserByEmail);
app.post('/user', db.createUser);
app.get('/payee/:contractAddress', db.getPayeeByContractAddress);

/* ================================ Contracts ================================*/
app.get('/contract/:address', db.getContractByAddress);
app.get('/contracts/:userAddress', db.getContractsByUserAddress);
app.get('/contracts/payee/:address', db.getContractsByPayeeAddress);
app.get('/contract/payable/:address', db.getContractPayable);
app.post('/contract/payee', db.inviteParty); // DONE
app.post('/contract', db.createContract); // DONE
app.put('/contract/:index/update', db.updateContract); // TODO
app.put('/contracts/:address/approve', db.approveContract); // DONE
app.post('/contracts/:address/pay', db.storePayment); // DONE
app.put('/contracts/:address/checkSatisfy', db.checkSatisfy);
app.put('/contracts/:index', db.sendConditions); 
app.post('/contracts/:address/sendData',db.sendData);
app.post('/contracts/:address/sendDataBypass', db.sendDataBypass);
/* ================================ Oracle ================================*/
app.post('/oracle', oracle.verify);

app.listen(port,'0.0.0.0', async () => {
  console.log(`Vendorchain db listening at http://localhost:${port}`);
  

  // // const accounts = await web3.eth.getAccounts();
  // // const account = accounts[0];
  // const VendorFactory = await eth.VendorFactory();
  // const methods =  VendorFactory.methods// .state().call({from: userAddress});
  // // const manager = await methods.manager().call({"from": account})
  // console.log(methods);

  // for(const key in VendorFactory){)
  //   console.log(key)
  // }
})