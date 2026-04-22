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
    return pool.request().query("SELECT DISTINCT ZbType FROM SzJstar");
}).then(res => {
    console.log("TYPES:");
    console.log(res.recordset.map(r => r.ZbType).join(', '));
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
