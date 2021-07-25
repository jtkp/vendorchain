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

// get all users - Katrina
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY "userID" ASC', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// get user by email - Katrina
const getUserByEmail = (request, response) => {
  const { email } = request.body;

  pool.query(`SELECT * FROM users WHERE "email" = ${email}`, (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// get a specif user by userId- Katrina
const getUserById = (request, response) => {
  // get parameters from url
  const id = parseInt(request.params.id);

  pool.query(`SELECT * FROM users WHERE "userID" = ${id}`, (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// add a user - Katrina
const createUser = (request, response) => {
  const { name, email, password } = request.body

  pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
              ['test', 'test@test.com', '12345678'],
              (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(`User added with ID: ${result.insertId}`)
    }
  })
}

/* ================================ Contracts ================================*/

// get all contracts - Katrina
const getContracts = (request, response) => {
  pool.query('SELECT * FROM contract ORDER BY "contractID" ASC', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// get contract by a specific contract id - Katrina
const getContractById = (request, response) => {
  // get parameters from url
  const id = parseInt(request.params.id)

  pool.query(`SELECT * FROM contract WHERE "contractID" = ${id}`,
              (error, results) => {

    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(results.rows)
    }
  })
}

// TODO: get all contracts created by a specific user - Katrina
const getContractsByUserId = (request, response) => {
// get parameters from url
  const id = parseInt(request.params.userId)

  pool.query(`SELECT * FROM contract WHERE "owner" = ${id}`,
              (error, results) => {

    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(results.rows)
    }
  })
}

const deleteContractById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(`DELETE FROM contract where "contractID = ${id}`,
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

  pool.query('INSERT INTO contract (title, description, state, owner) VALUES ($1, $2, "Not Saved", $3)',
              [title, description, userId], 
              (error, results) => {

    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(`Contract ${title} added with ID: ${result.insertId}`)
    }
  })
}

// TODO: get all contracts - Sang
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

// TODO: update state of a contract - Sang
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

// TODO: get all conditions with a contract id - Sang
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

// TODO: get a specific condition by an condition id - Sang
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

// TODO: add a condition into database - Sang
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

// TODO: udpate a specif condition - Sang
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
  getUserByEmail,
  createUser,
  // contracts
  getContracts,
  getContractById,
  getContractsByUserId,
  deleteContractById,
  createContract,
  updateContract,
  updateContractState,
  // conditions
  getConditions,
  getConditionById,
  addCondition,
  updateConditionById,
}