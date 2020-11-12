const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const fs = require("fs");

const discord = require("../../discord/discord");
const web = require("../web");
const util = require("../../src/util");

// res.send(`${web.status() ? "ONLINE" : "OFFLINE"} | ${util.getUptime(web.start(), new Date().getTime())}`)

router.get("/", (req, res) => {
    let $ = cheerio.load(fs.readFileSync("./web/html/home.html", "UTF-8"));

    

    return res.send($.html());
});

module.exports = router;