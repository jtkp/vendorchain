const { response } = require('express')

// set up express app
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// connect db
const db = require('./queries')


app.get('/', (req, res) => {
  res.json({info: 'hello world'})
})

/* ================================ Users ================================*/
app.get('/users', db.getUsers);
app.get('/user/:id', db.getUserById);
app.get('/user', db.getUserByEmail);
app.post('/user', db.createUser);

/* ================================ Contracts ================================*/
app.get('/contracts', db.getContracts);
app.get('/contract/:id', db.getContractById);
app.get('/contracts/:userId', db.getContractsByUserId);
app.post('/contract', db.createContract);
app.put('/contract/:id', db.updateContract);
app.put('contract/state/:id', db.updateContractState);

/* ================================ Conditions ================================*/
app.get('/conditions/:contractId', db.getConditions);
app.get('/condition/:id', db.getConditionById); 
app.post('/condition', db.addCondition);
app.put('/condition/:id', db.updateConditionById);


app.listen(port, () => {
  console.log(`Vendorchain db listening at http://localhost:${port}`)
})