import {Pool} from "pg";
import type {QueryResult, QueryResultRow, PoolClient} from "pg"

export const pool = new Pool({
 connectionString: process.env.DATABASE_URL!,
 ssl: {rejectUnauthorized: false},
 max: 10,
 idleTimeoutMillis: 30000,
 connectionTimeoutMillis: 10000
})

pool.on("error", (err: Error) => {
    console.error("Unexpected PostgreSQL pool server: ", err)
})

export const query = <T extends QueryResultRow = any>(
    text: string,
    params?: unknown[]
  ): Promise<QueryResult<T>> => {
    return pool.query<T>(text, params);
  };


export const withTransactions = async <T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> => {
    const client = await pool.connect()
    try {
        await client.query("BEGIN");
        const result = await callback(client);
        await client.query("COMMIT");
        return result
    } catch (error) {
        await client.query("ROLLBACK")
        throw error;
    } finally{
        client.release()
    }
}

