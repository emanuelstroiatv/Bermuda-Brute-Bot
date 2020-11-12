const express = require("express");
const app = express();

let root = require("./routes/root"),
    api = require("./routes/api"),
    online = false,
    start = 0;

app.use("/api", api);
app.use("/", root);

app.use("/assets", express.static(`${__dirname}/html/assets`));

module.exports.init = (port) => {
    app.listen(port, () => {
        console.log(`(web): listening on port: ${port}`);
        online = true;
        start = new Date().getTime();
    });
}

module.exports.status = () => {
    return online;
}

module.exports.start = () => {
    return start;
}