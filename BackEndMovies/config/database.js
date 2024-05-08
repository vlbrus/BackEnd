const pgp = require('pg-promise')();

const cn = {
    user: 't212577',
    host: 'dev.vk.edu.ee',
    database: 'DB_VladBrusnitsin',
    password: 't212577',
    searchPath: 'movies',
    port: 5432
};

const db = pgp(cn);

db.connect()
    .then(obj => {
        // Can check the server version here (pg-promise v10.1.0+):
        const serverVersion = obj.client.serverVersion;

        obj.done(); // success, release the connection;
        console.log('Connected:');
    })
    .catch(error => {
        console.log('ERROR:', error.message || error);
});


module.exports = db;

