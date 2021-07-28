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
        response.status(404).send("ERROR getting eth accoutns");
      })
  }
}

/* ================================ Contracts ================================*/

// get contract by a specific contract id - call functions - justin
const getContractByAddress = (request, response) => {
  // get parameters from url
  const contractAddress = request.params.address;

  const Vendor = await eth.Vendor(contractAddress);
  const result = await Vendor.methods.getDetails().send();

  response.status(200).json(result);
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
  const {contractId, partiesId} = request.body;

  let query = 'SELECT address FROM userinfo WHERE id = $1';
  // partyAddress = query here;

  query = 'SELECT address FROM contract WHERE contractID = $1';
  // contractAddress = query here;

  const Vendor = await eth.Vendor(contractAddress);
  const result = await Vendor.methods.setPayee(partyAddress).send();

  query = 'INSERT INTO party ("partyID", "contractID") VALUES';

  partiesId.map((p) => {
    query += ` ('${p}','${contractId}'),`;
  });

  query = query.slice(0, -1);
  query += ';';
  pool.query(query, (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json({ parties: partiesId });
    }
  })
}

// approve a contract
const approveContract = async (request, response) => {
  const contractAddress = request.params.address;
  const {payeeAddress, index} = request.body;

  const VendorFactory = await eth.VendorFactory();
  const result = await VendorFactory.methods.approveContract(contractAddress, index).send({'from': payeeAddress});
}

// create a contract  - call functions - daigo
const createContract = (request, response) => {
  const { title
        , description 
        , client
        , expiryDate
        , startDate
        , amount 
        , conditions
        } = request.body
  
  
  pool.query("INSERT INTO contract (title, description, owner) VALUES ($1, $2, $3) returning *",
              [title, description, client], 
              (error, results) => {

    if (error) {
      response.status(400).json(error);
    }
     
    const index = results.rows[0].index;
    const hash = "";

    const VendorFactory = await eth.VendorFactory();
    const address = await VendorFactory.methods.createContract(client, expiryDate, startDate, hash, amount, index).send();

    pool.query("UPDATE contract SET address = $1 WHERE index = $2",
    [address, index], 
    (error, results) => {
    if (error) {
      response.status(400).json(error);
    }
    // names // string[8]
    // , values // int[8]
    // , operators // string[8]

    const names = [];
    const values = [];
    const operators = [];

    for (var i = 0; i < 8; i++) {
      names[i] = '';
      values[i] = 0;
      operators[i] = '';
    }

    for (var i = 0; i < conditions.length; i++) {
      names[i] = conditions[i]['category'];
      values[i] = conditions[i]['value'];
      operators[i] = conditions[i]['operator'];
    }

    const Vendor = await eth.Vendor(address);
    const res = await Vendor.methods.setConds(names, values, operators).send();

    response.status(200).json({ contractID: results.rows[0] });
    })
    .catch(err => {
      console.log("ERROR creating contract", err);
      response.status(400).json(err);
    })

  })

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
const storePayment = (request, response) => {
  const contractAddress = request.params.address;
  const {client} = request.body;

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
  storePayment
}