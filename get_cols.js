const fs = require('fs');
const sql = require('mssql');

const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v) env[k.trim()] = v.join('=').trim().replace(/['"]/g, '');
});

const config = {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    server: env.DB_SERVER,
    database: env.DB_DATABASE || env.DB_NAME,
    port: parseInt(env.DB_PORT || '1433', 10),
    options: {
        encrypt: env.DB_ENCRYPT === 'true',
        trustServerCertificate: env.DB_TRUST_SERVER_CERTIFICATE === 'true'
    }
};

sql.connect(config).then(pool => {
    return pool.request().query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'SzJstar'");
}).then(res => {
    console.log("COLUMNS:");
    console.log(res.recordset.map(r => r.COLUMN_NAME).join(', '));
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
