# Description
This directory contains the frontend server of Venderchain.

# Project Structure

```
src
├── Api.js
├── App.js
├── components
│   ├── AppHeader.js            # display logo and login, register, logout button. Also display 'Admin' if the user is admin
│   ├── ConditionsItem.js       # a condition item displayed on the contract editing page
│   ├── Modals
│   │   ├── CreateContractModal.js   # a modal for user to fill in information and create a contract       
│   │   └── InvitePartyModal.js      # a modal for contract owner to select a vendor to send invitation
│   └── Titles
│       ├── Subtitle.js              # display text in subtitle format
│       └── Title.js                 # display text in title format
├── index.js
├── pages
│   ├── ContractEdit.js              # page for contract owner to edit the contract
│   ├── ContractView.js              # page for payee to view the contract
│   ├── Dashboard.js                 # page for users to view all the contracts. Admin is able to create contract but others are not.
│   ├── Home.js                      # home page
│   ├── Login.js                     # login page
│   ├── NotFound.js                  # display to an unrecognized route
│   └── Register.js                  # register page
└── reportWebVitals.js
```

# Details
The frontend does not work with full functionalities. Only login, register, create new contract, contract view/edit pages are working. 

# Instruction
Before starting the server, please check if:

1. The smart contracts has been compiled and deployed (in `/smart_contracts`)
2. The postgres database has been started (in the root directory)
3. The backend has been started (in`/backend`)

To start the server locally:

```sh
cd vendorchain
yarn install # install dependencies
yarn start  # start the server
```

