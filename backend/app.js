const { response } = require('express');
const eth = require("./smart_contracts/eth");
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
app.get('/users', db.getUsers);
app.get('/user/:id', db.getUserById);
app.get('/user/email/:email', db.getUserByEmail);
app.post('/user', db.createUser);

/* ================================ Contracts ================================*/
app.get('/contracts', db.getContracts);
app.get('/contract/:id', db.getContractById);
app.get('/contracts/:userId', db.getContractsByUserId);
app.get('/contract/parties/:id', db.getParties);
app.delete('/contract/:id', db.deleteContractById);
app.post('/contract/party', db.inviteParties);
app.post('/contract', db.createContract);
app.put('/contract/:id', db.updateContract);
app.put('/contract/state/:id', db.updateContractState);

/* ================================ Conditions ================================*/
app.get('/conditions/:contractId', db.getConditions);
app.get('/condition/:id', db.getConditionById); 
app.post('/condition', db.addCondition);
app.put('/condition/:id', db.updateConditionById);
app.delete('/condition/:id', db.deleteConditionById);


/* ================================ Oracle ================================*/
app.post('/oracle', oracle.verify);

app.listen(port,'0.0.0.0',async () => {
  console.log(`Vendorchain db listening at http://localhost:${port}`);
    
  const accounts = await eth.accounts();
  console.log(accounts)

  // const accounts = await web3.eth.getAccounts();
  // const account = accounts[0];
  const VendorFactory = await eth.VendorFactory();
  const methods =  VendorFactory.methods// .state().call({from: userAddress});
  // const manager = await methods.manager().call({"from": account})
  console.log(methods);

  // for(const key in VendorFactory){)
  //   console.log(key)
  // }
})