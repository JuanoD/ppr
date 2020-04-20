import { Pool, Client, PoolClient, Query, QueryResult } from "pg";
import keys from "./keys";
import logger from "@shared/Logger";

const pool: Pool = new Pool(keys.database);

pool.connect((err: Error, client: PoolClient, release: any) => {
    if (err) {
        return logger.error(
            "Error returning client\n\n" +
            "¿De casualidad olvidaste iniciar el servicio de base de datos?\n\n" +
            err.stack
        );
    }
    client.query("SELECT NOW()", (err, result) => {
        if (err) {
            return logger.error("Error executing query", err.stack);
        }
        logger.info(result.rows[0].now);
        release();
    });
});

export async function runQuery(
    query: string,
    params: any[] | undefined = undefined
): Promise<QueryResult> {
    const client = await pool.connect();
    const result = await client.query(query, params);
    client.release();
    return result;
}

export default pool;
