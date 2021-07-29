// set up postgres connection using node-postgres
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'vc2',
  password: 'password',
  port: 5432,
})

const eth = require("./smart_contracts/eth");
const crypto = require("crypto");

// track the number of registered users
let num_user = 0;

/* ================================ Users ================================*/

// get admin - Katrina
const getAdmin = (request, response) => {
  pool.query('SELECT * FROM userinfo WHERE "isAdmin" = true', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows[0]);
    }
  })
}

// get all Vendors - Katrina
const getVendors = (request, response) => {
  pool.query('SELECT * FROM userinfo WHERE "isAdmin" = false', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// get user by address - Katrina
const getUserByAddress = (request, response) => {
  const address = request.params.address;
  pool.query('SELECT * FROM userinfo WHERE address = $1', [address], (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// get user by email
const getUserByEmail = (request, response) => {
  const email = request.params.email;
  pool.query('SELECT * FROM userinfo WHERE email = $1', [email], (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// add a user 
const createUser = (request, response) => {
  const { name, email, password } = request.body
  const isAdmin = num_user === 0 ? true : false;

  if (num_user > 10) {
    response.status(401).send("ERROR: Number of users exceed maximum");

  } else {
    eth.accounts()
      .then(res => {
        pool.query(`INSERT INTO userinfo (name, email, password, address, "isAdmin") VALUES ('${name}', '${email}', '${password}', '${res[num_user]}', ${isAdmin}) returning *`,
                (error, results) => {
          if (error) {
            if (error.constraint === 'userinfo_email_key') {
              response.status(400).json({ "error": "Email existed, please use another email." });
  
            } else {
              response.status(400).json(error);
            }
          
          // if success, get and return user 
          } else {
            num_user += 1;
            response.status(200).json(results.rows[0]);
            console.log(`Create ${isAdmin ? 'admin' : 'user'} with address ${results.rows[0].address}`);
          }
        })
  
      })
      .catch(err => {
        console.log("ERROR getting eth accounts.");
        response.status(404).send("ERROR getting eth accounts");
      })
  }
}

const getPayeeByContractAddress = (request, response) => {
  // get parameters from url
  const contractAddress = request.params.address;

  pool.query('SELECT u.name as payee, u.email as payeeEmail, u.address as payeeAddress from party p JOIN userinfo u on u.address = p.payee WHERE p.address = $1',
  [contractAddress],
  (error, results) => {
    if (error) {
      response.status(404).send("ERROR getting payee");
    } else {
      response.status(200).json(results.rows);
    }
  })
}

/* ================================ Contracts ================================*/

// get contract by address
const getContractByAddress = async (request, response) => {
  try{
    const contractAddress = request.params.address;

    const accounts = await eth.accounts();
    const managerAccount = accounts[0];
    const Vendor = await eth.Vendor(contractAddress)
    const res = await Vendor.methods.getDetails().call({"from": managerAccount});

    const client = res['0']
    const payee = res['1']
    const startDate = res['2']
    const expiryDate = res['3']
    const amount = res['4'];
    const prevBillingDate = res['5']
    const nextBillingDate = res['6']
    const contractHash = res['7']
    const names = res['8']
    const values = res['9']
    const operators = res['10']
    response.status(200).send(
      { contractAddress
      , client
      , payee
      , startDate
      , expiryDate
      , amount
      , prevBillingDate
      , nextBillingDate
      , contractHash
      , names
      , values
      , operators
    });
  }catch(err){
    console.log("error");
    console.log(err);
    response.status(400).send({"error": err});
  }

}

// get all contracts created by a specific user - katrina
const getContractsByUserAddress = (request, response) => {
  const address = request.params.userAddress;
  pool.query('SELECT * FROM contract WHERE owner = $1', [address], (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows)
    }
  })
}

// API: /contracts/payee/:address
// Get all contracts with the payee :address
const getContractsByPayeeAddress = (request, response) => {
  const payee = request.params.address;
  pool.query('SELECT c.address, c.title, c.description, c.owner FROM party p JOIN contract c on c.address = p.address WHERE p.address = $1', [payee], (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows)
    }
  })
}

// Get if the contract is payable
const getContractPayable = (request, response) => {
  response.status(200).json({ status: true })
  response.status(400).json();
}

// Invite a payee with the address "partyAddress to the contract"
const inviteParty = async (request, response) => {
  const {contractAddress, partyAddress} = request.body;
  const accounts = await eth.accounts();
  const managerAccount = accounts[0];
  const Vendor = await eth.Vendor(contractAddress);
  await Vendor.methods.setPayee(partyAddress).send({"from": managerAccount, gasPrice: 1000, gas: 1000000});
  pool.query('INSERT INTO party (payee, address) VALUES ($1, $2) returning *', [partyAddress, contractAddress], (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// If a payee with address "payeeAddress" has received the invite
// they can approve to terms of the contract
const approveContract = async (request, response) => {
  try {
    const contractAddress = request.params.address;
    const { payeeAddress, index } = request.body;
    const VendorFactory = await eth.VendorFactory();
    await VendorFactory.methods.approve(contractAddress, index).send({'from': payeeAddress, gasPrice: 1000, gas: 1000000});
    response.status(200).json({"msg": `Vendor ${payeeAddress} successfully approved contract ${contractAddress}`});
  } catch(err){
    console.log("error")
    response.status(400).json(err);
  }

}

// Used to create a contract. The conditions of the contract are
// set using the function "sendCondition" and 
// the payee is set using the function "inviteParty"
const createContract = async (request, response) => {
  const { title
        , description 
        , client
        , expiryDate
        , startDate
        , amount 
        } = request.body
  console.log(request.body)
  try{

    let results = await pool.query
      ( "INSERT INTO contract (title, description, owner) VALUES ($1, $2, $3) returning *"
      , [title, description, client]
      );
      
      const index = results.rows[0].index;
      const _hash = crypto.createHash('sha256').update(description).digest('hex');
      const hash = parseInt(_hash);
      console.log(hash)
      const VendorFactory = await eth.VendorFactory();
      const accounts = await eth.accounts();
      const managerAccount = accounts[0];
      let res = await VendorFactory.methods.createVendor(client, expiryDate, startDate, hash, amount, index)
      .send({"from": managerAccount, gasPrice: 1000, gas: 1000000});
      const newVendorContractAddress = res.events.ClonedContract.returnValues._cloned;
      results = await pool.query("UPDATE contract SET address = $1 WHERE index = $2",[newVendorContractAddress, index])
      response.status(200).json({ "contractAddress": newVendorContractAddress, "index":index });

  } catch(err){
    console.log(err);
    response.status(400).json(err);
  }
}

// Send conditions in the form [{category:string, operator:string, value:number}]
// Eg. bandwidth > 100, port = 1
// [ { "category": "bandwidth", "operator": ">", "value": 100 }
//   { "category": "port", "operator": "==", "value": 1 }
// ]
const sendConditions = async (request,response) => {
  try{
    const index = request.params.index;
    const {conditions} = request.body;
    // Find address of contract to set conditions of
    let results = await pool.query
    ( " SELECT address FROM contract WHERE index = $1"
    , [index]
    );
    const contractAddress = results.rows[0].address;
    // Convert condition to a list of names, values and operators
    // so that we can pass it into our contract
    const names = [];
    const values = [];
    const operators = [];

    for (var i = 0;  i < 8; i++) {
      names[i] = '0';
      values[i] = 0;
      operators[i] = '0';
    }

    for (var i = 0; i < conditions.length; i++) {
      names[i] = conditions[i]['category'];
      values[i] = conditions[i]['value'];
      operators[i] = conditions[i]['operator'];
    }
    const Vendor = await eth.Vendor(contractAddress);
    
    // Set the conditions in the contracts
    const accounts = await eth.accounts();
    const managerAccount = accounts[0];
    const res = await Vendor.methods.setConds(names, values, operators).send({"from": managerAccount, gasPrice: 1000, gas: 1000000});
    
    // Also store the condition in the DB for easier retrieval
    for (var i = 0; i < conditions.length; i++) {
      await pool.query
      ( "INSERT INTO condition (address, name, operator, value) VALUES ($1,$2,$3,$4)" 
      , [contractAddress, names[i], operators[i], values[i]]
      )
    }
    response.status(200).json({ msg: `Successfully set conditions to ${contractAddress}` });
  }catch(err){
    console.log("error");
    response.status(400).json({ msg: `Failed to set conditions`});
  }
}

// Update a contract. Creates a new copy of the original and 
// updates the in the new copy fields. 
const updateContract = async (request, response) => {

  const index = request.params.index;

  const { title
        , description 
        , client
        , expiryDate
        , startDate
        , amount 
        , conditions
        } = request.body

  try{
      
    const _hash = crypto.createHash('sha256').update(description).digest('hex');
    const hash = parseInt(_hash);
    const VendorFactory = await eth.VendorFactory();
    const accounts = await eth.accounts();
    const managerAccount = accounts[0];

    let results = await pool.query
    ( " SELECT address FROM contract WHERE index = $1"
    , [index]
    );
    
    const originalAddress = results.rows[0].address

    // Create a copy of the original contract
    let res = await VendorFactory.methods
              .createVendor(client, expiryDate, startDate, hash, amount, index)
              .send({"from": managerAccount, gasPrice: 1000, gas: 1000000});

    const newVendorContractAddress = res.events.ClonedContract.returnValues._cloned;
    
    // Pass the new conditions into the new copy
    const names = [];
    const values = [];
    const operators = [];

    // Following is required to pad the input.
    // The number of conditions is fixed to 8.
    for (var i = 0;  i < 8; i++) {
      names[i] = '0';
      values[i] = 0;
      operators[i] = '0';
    }

    for (var i = 0; i < conditions.length; i++) {
      names[i] = conditions[i]['category'];
      values[i] = conditions[i]['value'];
      operators[i] = conditions[i]['operator'];
    }

    const Vendor = await eth.Vendor(newVendorContractAddress);
    res = await Vendor.methods.setConds(names, values, operators).send({"from": managerAccount, gasPrice: 1000, gas: 1000000});
    
    // Delete conditions associated to the original contract from the DB
    results = await pool.query
    ( "DELETE FROM condition WHERE address = $1"
    , [originalAddress]
    );
    
    // Updates the info of our contract
    results = await pool.query
    ( "UPDATE contract SET title=$1, description=$2,address=$3 WHERE index = $4"
    , [title, description, newVendorContractAddress,index]
    );

    // Store the contract of the 
    for (var i = 0; i < conditions.length; i++) {
      await pool.query
      ( "INSERT INTO condition (address, name, operator, value) VALUES ($1,$2,$3,$4)" 
      , [newVendorContractAddress, names[i], operators[i], values[i]]
      )
    }
 
    response.status(200).json({ status: `success updated contract. New address is ${newVendorContractAddress}` });

} catch(err){
  console.log("error");
  console.log(err);
  response.status(400).json(err);
}

}

// For the client to store payment in contract.
// If the contract is satisfied the vendor will receive the payment
// Otherwise, the client will receive a refund.
const storePayment = async (request, response) => {
  try{
    const contractAddress = request.params.address;
    const { client } = request.body;
    const Vendor = await eth.Vendor(contractAddress);
    const amount = await Vendor.methods.amount().call({from: client});
    res = await Vendor.methods.storePayment().send({"from": client, value: amount,gasPrice: 1000, gas: 1000000});
    response.status(200).json({msg: `Client ${client} successfully sent ${amount} wei into contract ${contractAddress}`});
  }catch(err){
    response.status(400).json(err);
  }
}

// For demonstration purposes. Check if the conditions
// of the contract are satisfies. This check is
// automatically performed by the contract.
const checkSatisfy = async (request,response) => {
  try{
    const contractAddress = request.params.address;
    const { client }= request.body;
    const Vendor = await eth.Vendor(contractAddress);
    console.log("Got vendor contract");
    const res = await Vendor.methods.isSatisfiedBypass().send({"from": client, gasPrice: 1000, gas: 1000000});
    console.log("Called is satisfy");
    const satisfied = await Vendor.methods.satisfied().call({from:client});
    console.log(`satisfied is ${satisfied}`);
    console.log(satisfied)
    const msg = satisfied ? 'Contract conditions are satisfied' : 'Contract conditions are not satisfied'
    response.status(200).json({msg});

  }catch(err){
    console.log("error")
    console.log(err)
    response.status(400).json(err);
  }
}

// Send data from a vendor service.
const sendData = async (request, response) => {
  try{
    const contractAddress = request.params.address;
    const { values }= request.body; // values: int[8]
    const accounts = await eth.accounts();
    const managerAccount = accounts[0];
    const Vendor = await eth.Vendor(contractAddress);
    const res = await Vendor.methods.receiveServiceData(values).send({from:managerAccount, gasPrice: 1000, gas: 1000000});
    response.status(200).json({msg: `Successfully sent ${values} to ${contractAddress}`});
  }catch(err){
    response.status(400).json(err);
  }
}

// For demonstration purposes. Can bypass the billing period check.
const sendDataBypass = async (request, response) => {
  try{
    const contractAddress = request.params.address;
    const { values }= request.body; // values: int[8]
    const accounts = await eth.accounts();
    const managerAccount = accounts[0];
    const Vendor = await eth.Vendor(contractAddress);
    const res = await Vendor.methods.receiveServiceDataBypass(values).send({from:managerAccount, gasPrice: 1000, gas: 1000000});
    console.log("Sent data");
    console.log(res);
    response.status(200).json({msg: `Successfully sent ${values} to ${contractAddress}`});
  }catch(err){
    response.status(400).json(err);
  }
}

module.exports = {
  // users
  getAdmin,
  getVendors,
  getUserByAddress,
  getUserByEmail,
  createUser,
  getPayeeByContractAddress,
  // contracts
  getContractByAddress,
  getContractsByUserAddress,
  getContractsByPayeeAddress,
  getContractPayable,
  inviteParty,
  createContract,
  sendConditions,
  updateContract,
  approveContract,
  storePayment,
  checkSatisfy,
  sendData,
  sendDataBypass
}