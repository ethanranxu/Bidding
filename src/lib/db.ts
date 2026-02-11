import sql from "mssql";

const config: sql.config = {
    server: process.env.DB_SERVER || "localhost",
    port: parseInt(process.env.DB_PORT || "1433", 10),
    database: process.env.DB_DATABASE || "MultData",
    user: process.env.DB_USER || "sa",
    password: process.env.DB_PASSWORD || "",
    options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate:
            process.env.DB_TRUST_SERVER_CERTIFICATE !== "false",
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
    if (!pool) {
        pool = await sql.connect(config);
    }
    return pool;
}
