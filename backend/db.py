import sqlite3


def db_insert(table, columns, params):
    conn = sqlite3.connect('vms.db')
    c = conn.cursor()

    query = f"""
            INSERT INTO {table} ({columns})
            VALUES ({params});
            """
    print(f'insert query is: {query}')
    c.execute(query)
    conn.commit()