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

// TODO: get all users - Katrina
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY "userID" ASC', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// TODO: get a specif user by userId- Katrina
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

// TODO: add a user - Katrina
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

// TODO: get all contracts - Katrina
const getContracts = (request, response) => {
  pool.query('SELECT * FROM contract ORDER BY "contractID" ASC', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// TODO: get user by a specific id - Katrina
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

// TODO: get all contracts created by a specific user - Katrina
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

// TODO: create a contract - Katrina
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

// TODO: update all contracts - Sang
const updateContract = (request, response) => {
  const contractId = parseInt(request.params.contractId);
  const { newTitle, newDescription, newAddress } = request.body;

  // Use UPDATE keyword
  pool.query('UPDATE contract SET title = newTitle, description = newDescription, address = newAddress WHERE "contractID" = ${contractId}', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(`Contract updated with ID: ${contractId}`);
    }
  })

}


// TODO: update state of a contract - Sang
const updateContractState = (request, response) => {
  const contractId = parseInt(request.params.contractId);
  const { newState } = request.body;

  // Use UPDATE keyword
  pool.query('UPDATE contract SET state = newState WHERE "contractID" = ${contractId}', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(`Contract ${contractId} has updated to state ${newState}`);
    }
  })
}

/* ================================ Conditions ================================*/

// TODO: get all conditions with a contract id - Sang
const getConditions = (request, response) => {
  const contractId = parseInt(request.params.contractId);

  pool.query('SELECT * FROM condition WHERE "contractID" = ${contractId} ORDER BY "contractID" ASC', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// TODO: get a specific condition by an condition id - Sang
const getConditionById = (request, response) => {
  const conditionId = parseInt(request.params.id);

  pool.query('SELECT * FROM condition WHERE "conditionID" = ${conditionId} ORDER BY "conditionID" ASC', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows[0]);
    }
  })

}

// TODO: add a condition into database - Sang
const addCondition = (request, response) => {
    const { newDescription, newCategory, newOperator, newValue } = request.body
  // get data from request.body

  pool.query('INSERT INTO condition (description, category, operator, value) VALUES (newDescription, newCategory, newOperator, newValue)',
              (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send('New condition has been added');
    }
  })

}

// TODO: udpate a specific condition - Sang
const updateConditionById = (request, response) => {
  const conditionId = parseInt(request.params.conditionId);
  const { newDescription, newCategory, newOperator, newValue } = request.body;

  pool.query('UPDATE contract SET description = newDescription, category = newCategory, operator = newOperator, value = newValue WHERE "conditionID" = ${conditionId}', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(`Condition has been updated with ID: ${conditionId}`);
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