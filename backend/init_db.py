import sqlite3


if __name__ == '__main__':
    conn = sqlite3.connect('vms.db')
    c = conn.cursor()

    query = 'drop table if exists users'
    c.execute(query)
    query = 'drop table if exists contracts'
    c.execute(query)
    
    # create table users
    query = """
            CREATE TABLE IF NOT EXISTS users (
                id              integer     primary key,
                email           text        unique not null,
                password        text        not null,
                first_name      text        not null,
                last_name       text        not null,
            );
            """
    c.execute(query)

    # create table data
    query = """
            CREATE TABLE IF NOT EXISTS data (
                id              integer     primary key,
                title           text        not null,
                description     text        ,
                date            text        not null,
                last_updated    text        not null,
                path            text        not null,
            );
            """
    c.execute(query)

    # create table contracts
    query = """
            CREATE TABLE IF NOT EXISTS contracts (
                id              integer     primary key,
                title           text        not null,
                description     text        ,
                creation_date   text        not null,
                last_updated    text        not null,
                conditions      text        not null,
                contract_path   text        not null,
                state           text        not null,
                data            integer     ,
                sc_address      text        ,
                foreign key     (data)      references data (id)
            );
            """
    c.execute(query)
    
    conn.commit()

    # insert test data
    # query = f"""
    #         INSERT INTO users (email, password, first_name, last_name)
    #         VALUES ('email', 'password', 'first_name', 'last_name');
    #         """
    # c.execute(query)
    
    conn.commit()
    c.close()
    conn.close()