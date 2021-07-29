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

/* ================================ Contracts ================================*/

// get contract by a specific contract id - call functions - justin
const getContractByAddress = async (request, response) => {
  try{
    const contractAddress = request.params.address;

    const accounts = await eth.accounts();
    const managerAccount = accounts[0];
    console.log("Fetched manager account");
    const Vendor = await eth.Vendor(contractAddress)
    const res = await Vendor.methods.getDetails().call({"from": managerAccount});
    //const newVendorContractAddress = res.events.ClonedContract.returnValues._cloned;
    
    // TODO: Retrieve conditions from DB

    console.log(res);
    const client = res['0']
    const payee = res['1']
    const startDate = res['2']
    const expiryDate = res['3']
    const amount = res['4'];
    const prevBillingDate = res['5']
    const nextBillingDate = res['6']
    const contractHash = res['7']
    // (client, payee, startDate, expiryDate, amount, prevBillingDate, nextBillingDate, contractHash);
    response.status(200).send(
      { client
      , payee
      , startDate
      , expiryDate
      , amount
      , prevBillingDate
      , nextBillingDate
      , contractHash
    });
  }catch(err){
    console.log("error");
    console.log(err);
    response.status(400).send({"error": err});
  }

}

// get all contracts created by a specific user - katrina
const getContractsByUserAddress = (request, response) => {
  // get parameters from url
  const address = request.params.userAddress;

  pool.query('SELECT * FROM contract WHERE owner = $1', [address], (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows)
    }
  })
}

// get contracts that - katrina
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

// invite parties to a contract  - call functions - justin
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

// approve a contract
const approveContract = async (request, response) => {
  try {
    const contractAddress = request.params.address;
    const { payeeAddress, index } = request.body;
    const accounts = await eth.accounts();
    const managerAccount = accounts[0];

    const Vendor = await eth.Vendor(contractAddress);
    let payee = await Vendor.methods.stage().call({from: payeeAddress});
    console.log(payee);
    // await Vendor.methods.endInitStage().send({"from": managerAccount, gasPrice: 1000, gas: 1000000});
    payee = await Vendor.methods.payee().call({from: payeeAddress});
    console.log(payee);
    payee = await Vendor.methods.payeeApproved().call({from: payeeAddress});
    console.log(payee);
    const VendorFactory = await eth.VendorFactory();
    const result = await VendorFactory.methods.approve(contractAddress, index).send({'from': payeeAddress, gasPrice: 1000, gas: 1000000});
    payee = await Vendor.methods.payeeApproved().call({from: payeeAddress});
    console.log(payee);
    response.status(200).json({"status": "success"});
  } catch(err){
    console.log("error")
    response.status(400).json(err);
  }

}

// create a contract  - call functions - daigo
const createContract = async (request, response) => {
  const { title
        , description 
        , client
        , expiryDate
        , startDate
        , amount 
        , conditions
        } = request.body
  
  try{

    let results = await pool.query
      ( "INSERT INTO contract (title, description, owner) VALUES ($1, $2, $3) returning *"
      , [title, description, client]
      );
      
      const index = results.rows[0].index;
      console.log("Retrieved contract index");
      const hash = 100;
      
      const VendorFactory = await eth.VendorFactory();
      
      console.log("Retrieved Vendor Factory")
      const accounts = await eth.accounts();
      const managerAccount = accounts[0];

      console.log("Retrieved accounts");

      console.log("Before create contract")

      let res = await VendorFactory.methods.createVendor(client, expiryDate, startDate, hash, amount, index)
      .send({"from": managerAccount, gasPrice: 1000, gas: 1000000});

      const newVendorContractAddress = res.events.ClonedContract.returnValues._cloned;
      results = await pool.query("UPDATE contract SET address = $1 WHERE index = $2",[newVendorContractAddress, index])
      
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

      const Vendor = await eth.Vendor(newVendorContractAddress);
      res = await Vendor.methods.setConds(names, values, operators).send({"from": managerAccount, gasPrice: 1000, gas: 1000000});
      response.status(200).json({ status: "success" });

  } catch(err){
    console.log("error");
    console.log(err);
    response.status(400).json(err);
  }
}
// update contracts with contract id  - call functions - justin
const updateContract = (request, response) => {
  const contractId = request.params.id;
  const { newTitle, newDescription, newAddress } = request.body;

  // Use UPDATE keyword
  pool.query('UPDATE contract SET title = $1, description = $2, address = $3 WHERE "contractID" = $4 returning * ', 
              [newTitle, newDescription, newAddress, contractId],
              (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })

}

// store payment in the contract
// Send payment
const storePayment = async (request, response) => {
  try{
    const contractAddress = request.params.address;
    const {client} = request.body;
  
    const Vendor = await eth.Vendor(contractAddress);
    const amount = await Vendor.methods.amount().call({from: client});
    console.log(amount);

    res = await Vendor.methods.storePayment().send({"from": client, value: amount,gasPrice: 1000, gas: 1000000});
    
    response.status(200).json({msg: `Sent ${amount} to ${client}`});
  }catch(err){
    response.status(400).json(err);
  }
}

const checkSatisfy = async (request,response) => {
  try{
    const contractAddress = request.params.address;
    const { client }= request.body;
    const Vendor = await eth.Vendor(contractAddress);
    let satisfied = await Vendor.methods.satisfied().call({from:client});
    console.log(`Is satisfied before ${satisfied}`);
    const res = await Vendor.methods.isSatisfied().send({"from": client, gasPrice: 1000, gas: 1000000});
    satisfied = await Vendor.methods.satisfied().call({from:client});
    console.log(`Is satisfied after ${satisfied}`);
    console.log(res);
    response.status(200).json({msg: `satisfy is ${res}`});
  
  }catch(err){
    response.status(400).json(err);
  }
}

const sendData = async (request, response) => {
  try{
    const contractAddress = request.params.address;
    const { values }= request.body; // values: int[8]
    // TODO: Padding
    // TODO: Verify source
    const accounts = await eth.accounts();
    const managerAccount = accounts[0];
    const Vendor = await eth.Vendor(contractAddress);
    const res = await Vendor.methods.receiveServiceData(values).send({from:managerAccount, gasPrice: 1000, gas: 1000000});
    console.log("Sent data");
    console.log(res);
    response.status(200).json({msg: `Sent data to ${contractAddress}`});
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
  // contracts
  getContractByAddress,
  getContractsByUserAddress,
  getContractsByPayeeAddress,
  inviteParty,
  createContract,
  updateContract,
  approveContract,
  storePayment,
  checkSatisfy,
  sendData
}