# COMP6452 Project 2

##Requirements
* Node js
* npm
* docker-compose

## Deployment instructions
1. Start docker containers
```bash
docker-compose up
```
2. Compile and deploy contrats
```bash
cd smart_contracts
npm install
node compile.js
node deploy.js
```
3. Run server
```
cd backend
npm install
npm run start
```
