const { Pool, Client } = require('pg')
const process = require('process');

const main = async() => {
    const client = new Client({
        user: 'postgres',
        host: '0.0.0.0',
        database: 'postgres',
        password: 'password',
        port: 5432,
    })
    await client.connect();
    console.log("Connected to db");

    await client.query(`
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO postgres;
        GRANT ALL ON SCHEMA public TO postgres;
    `)
    console.log("Emptied db");

    await client.query(`
        CREATE TABLE Contracts(
            id SERIAL PRIMARY KEY,
            content VARCHAR
        );

        CREATE TABLE Users (
            id SERIAL PRIMARY KEY,
            username VARCHAR,
            password VARCHAR
        );
    `);

    console.log("Created tables");
    process.exit();
}

main();