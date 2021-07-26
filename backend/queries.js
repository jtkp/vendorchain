// set up postgres connection using node-postgres
const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'vc2',
  password: 'password',
  port: 5432,
})

/* ================================ Users ================================*/

// get all users - Katrina - checked
const getUsers = (request, response) => {
  pool.query('SELECT * FROM userinfo ORDER BY "userID" ASC', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// get user by email - Katrina - checked
const getUserByEmail = (request, response) => {
  const { email } = request.body;
  pool.query('SELECT * FROM userinfo WHERE email = $1', [email], (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// get a specif user by userId- Katrina - checked
const getUserById = (request, response) => {
  // get parameters from url
  const id = request.params.id;

  pool.query('SELECT * FROM userinfo WHERE "userID" = $1', [id], (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// add a user - Katrina - checked
const createUser = (request, response) => {
  const { name, email, password } = request.body

  pool.query(`INSERT INTO userinfo (name, email, password) VALUES ('${name}', '${email}', '${password}') returning *`,
              (error, results) => {
    if (error) {
      if (error.constraint === 'userinfo_email_key') {
        response.status(400).json({ "error": "Email existed, please use another email." });
      } else {
        response.status(400).json(error);
      }
    
    // if success, get and return user's id
    } else {
      response.status(200).json({ userID: results.rows[0].userID});
    }
  })
}

/* ================================ Contracts ================================*/

// get all contracts - Katrina - checked
const getContracts = (request, response) => {
  pool.query('SELECT * FROM contract ORDER BY "contractID" ASC', (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// get contract by a specific contract id - Katrina - checked
const getContractById = (request, response) => {
  // get parameters from url
  const id = request.params.id;

  pool.query('SELECT * FROM contract WHERE "contractID" = $1', [id], (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(results.rows)
    }
  })
}

// get all contracts created by a specific user - Katrina - checked
const getContractsByUserId = (request, response) => {
  // get parameters from url
  const id = request.params.userId;

  pool.query('SELECT * FROM contract WHERE "owner" = $1', [id], (error, results) => {

    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(results.rows)
    }
  })
}

//  get the parties from contract with a specific id - Katrina - to update parites' status
const getParties  = (request, response) => {
  const contractId = request.params.id;

  pool.query('SELECT u.name as parties, u.email as partyEmail, uu.name as invitor FROM party p INNER JOIN contract c on c."contractID" = p."contractID" INNER JOIN userinfo u on "partyID" = "userID" INNER JOIN userinfo uu on "owner" = uu."userID" WHERE c."contractID" = $1',
              [contractId],
              (error, results) => {
    
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(results.rows);
    }
  });
}

// delete contract by id - Katrina
const deleteContractById = (request, response) => {
  const id = request.params.id;

  pool.query(`DELETE FROM contract where "contractID" = '${id}'`,
            (error, results) => {

    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(`Contract ${id} has been deleted`);
    }
  })
}

// invite parties to a contract - Katrina - checked
const inviteParties = (request, response) => {
  const { contractId, partiesId } = request.body;
  let query = 'INSERT INTO party ("partyID", "contractID") VALUES';

  partiesId.map((p) => {
    query += ` ('${p}','${contractId}'),`;
  });

  query = query.slice(0, -1);
  query += ';';
  pool.query(query, (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send({ parties: partiesId });
    }
  })
}

// create a contract - Katrina - checked
const createContract = (request, response) => {
  const { title, description, userId  } = request.body

  pool.query("INSERT INTO contract (title, description, state, owner) VALUES ($1, $2, 'Not Saved', $3) returning *",
              [title, description, userId], 
              (error, results) => {

    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send({ contractID: results.rows[0].contractID })

    }
  })
}

// update  contracts with contract id - Sang - checked
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
      response.status(200).send(results.rows);
    }
  })

}


//  update state of a contract - Sang - checked
const updateContractState = (request, response) => {
  const contractId = request.params.id;
  const { newState } = request.body;

  // Use UPDATE keyword
  pool.query('UPDATE contract SET state = $1 WHERE "contractID" = $2 returning *', 
              [newState, contractId],
              (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(results.rows);
    }
  })
}

/* ================================ Conditions ================================*/

//  get all conditions with a contract id - Sang
const getConditions = (request, response) => {
  const contractId = request.params.contractId;

  pool.query('SELECT * FROM condition WHERE "contractID" = $1 ORDER BY "contractID" ASC', 
              [contractId],
              (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })
}

// TODO: get a specific condition by an condition id - Sang
const getConditionById = (request, response) => {
  const conditionId = request.params.id;

  pool.query('SELECT * FROM condition WHERE "conditionID" = $1 ORDER BY "conditionID" ASC', 
              [conditionId],
              (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).json(results.rows);
    }
  })

}

// TODO: add a condition into database - Sang
const addCondition = (request, response) => {
  const { newDescription, newCategory, newOperator, newValue, contractId } = request.body;

  pool.query('INSERT INTO condition (description, category, operator, value, "contractID") VALUES ($1, $2, $3, $4, $5) returning *',
              [newDescription, newCategory, newOperator, newValue, contractId],
              (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(results.rows);
    }
  })

}

// TODO: udpate a specific condition - Sang
const updateConditionById = (request, response) => {
  const conditionId = request.params.id;
  const { newDescription, newCategory, newOperator, newValue } = request.body;

  pool.query('UPDATE contract SET description = $1, category = $2, operator = $3, value = $4 WHERE "conditionID" = $5 returning *', 
            [newDescription, newCategory, newOperator, newValue, conditionId],
            (error, results) => {
    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send(results.rows);
    }
  })

}

// delete a condition 
const deleteConditionById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(`DELETE FROM condition where "conditionID = ${id}`,
            (error, results) => {

    if (error) {
      response.status(400).json(error);
    } else {
      response.status(200).send({ Success: `Condition ${id} has been deleted` });
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
  getParties,
  deleteContractById,
  inviteParties,
  createContract,
  updateContract,
  updateContractState,
  // conditions
  getConditions,
  getConditionById,
  addCondition,
  updateConditionById,
  deleteConditionById,
}