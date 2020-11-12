const express = require("express");
const router = express.Router();

const haus = require("../../src/haus");
const sql = require("../../src/sql");
const cnc = require("../../src/cnc");

router.get("/getIPs", (req, res) => {
    let query = req.query;
    console.log(`(api): ${req._parsedUrl._raw}`)

    if(query.tag) {
        haus.getIPs(query.tag).then(ips => {
            ips = JSON.parse(ips);
            console.log(`(web): gotten ${ips.ips.length} ips from urlhaus`);
            return res.send(ips);
        }).catch(e => {
            return res.send(e);
        });
    } else {
        return res.status(400).json({error: true, message: "Invalid parameters provided."});
    }
});

router.get("/getLogins", (req, res) => {
    let query = req.query;
    console.log(`(api): ${req._parsedUrl._raw}`)

        if(query.host && query.username && query.password) {
        sql.getLogins(query.host, query.username, query.password).then(logins => {
            logins = JSON.parse(logins);
            console.log(`(web): gotten ${logins.creds.length} logins from ${query.host}`);
            return res.send(logins);
        }).catch(e => {
            return res.send(e);
        });
    } else {
        return res.status(400).json({error: true, message: "Invalid parameters provided."});
    }
});


router.get("/getAdmins", (req, res) => {
    let query = req.query;
    console.log(`(api): ${req._parsedUrl._raw}`)

    if(query.host && query.username && query.password) {
        sql.getAdmins(query.host, query.username, query.password).then(admins => {
            admins = JSON.parse(admins);
            console.log(`(web): gotten ${admins.creds.length} logins from ${query.host}`);
            return res.send(admins);
        }).catch(e => {
            return res.send(e);
        });
    } else {
        return res.status(400).json({error: true, message: "Invalid parameters provided."});
    }
});

router.get("/crashC2", (req, res) => {
    let query = req.query;
    console.log(`(api): ${req._parsedUrl._raw}`)

    if(query.host && query.port) {
        cnc.crash(query.host, query.port).then(crash => {
            return res.send(crash);
        });
    } else {
        return res.status(400).json({error: true, message: "Invalid parameters provided."});
    }
});

module.exports = router;