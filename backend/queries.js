// set up postgres connection using node-postgres
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
})

// packages
// const uuid = require("uuid");
// console.log(uuid());
/* ================================ Users ================================*/

// get all users
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY "userID" ASC', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

const getUserById = (request, response) => {
  // get parameters from url
  const id = parseInt(request.params.id);

  pool.query(`SELECT * FROM users WHERE "userID" = ${id}`, (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows[0]);
    }
  })
}

// add a user
const createUser = (request, response) => {
  const { name, email, password, isAdmin  } = request.body

  pool.query('INSERT INTO users (userID, name, email, password) VALUES ($1, $2, $3, $4)',
              // [name, email, password, isAdmin], 
              ['c7b35d99-b3f9-4d41-ac7d-c97a86ef4a32', 'test@test.com', '12345678'],
              (error, results) => {

    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(`User added with ID: ${result.insertId}`)
    }
  })
}

/* ================================ Contracts ================================*/

// get all contracts
const getContracts = (request, response) => {
  pool.query('SELECT * FROM contract ORDER BY "contractID" ASC', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// TODO: get user by a specific id
const getContractById = (request, response) => {
  // get parameters from url
  const id = parseInt(request.params.id)

  pool.query('',
              [], 
              (error, results) => {

    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(results.rows[0])
    }
  })
}

// TODO: get all contracts created by a specific user
const getContractsByUserId = (request, response) => {
// get parameters from url
  const id = parseInt(request.params.userId)

  pool.query('',
              [], 
              (error, results) => {

    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(results.rows)
    }
  })
}

// TODO: create a contract
const createContract = (request, response) => {
  const { title, description, userId  } = request.body

  // generate current date, last_updated_date (equals to current date), state (initially Saved), address (null)

  pool.query('INSERT INTO contract () VALUES ()',
              [], 
              (error, results) => {

    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(`Contract added with ID: ${result.insertId}`)
    }
  })
}

// TODO: get all contrac
const updateContract = (request, response) => {
  const id = parseInt(request.params.id)

  // Use UPDATE keyword
  pool.query('', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(`Contract updated with ID: ${id}`);
    }
  })

}

// TODO: update state of a contract
const updateContractState = (request, response) => {
  const id = parseInt(request.params.id);
  const { newState } = request.body;

  // Use UPDATE keyword
  pool.query('', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(`Contract ${id} has updated to state ${newState}`);
    }
  })
}

/* ================================ Conditions ================================*/

// TODO: get all conditions with a contract id
const getConditions = (request, response) => {
  const contractId = parseInt(request.params.contractId);

  pool.query('', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// TODO: get a specific condition by an condition id
const getConditionById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows[0]);
    }
  })

}

// TODO: add a condition into database
const addCondition = (request, response) => {
  // get data from request.body

  pool.query('', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send('New condition has been added');
    }
  })

}

// TODO: udpate a specif condition
const updateConditionById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(`Condition has been updated with ID: ${id}`);
    }
  })

}



module.exports = {
  // users
  getUsers,
  getUserById,
  createUser,
  // contracts
  getContracts,
  getContractById,
  getContractsByUserId,
  createContract,
  updateContract,
  updateContractState,
  // conditions
  getConditions,
  getConditionById,
  addCondition,
  updateConditionById,
}