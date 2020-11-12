const request = require("request-promise");

module.exports.getString = () => {
    return new Promise((resolve, reject) => {
        request({
            uri: "http://defy.vip/dollar/6969.txt"
        }).then(str => {
            resolve(str);
        });
    });
}

// Thanks StackOverflow (was stuck on this for a while)
module.exports.getUptime = (start, now) => {
    var diff = Math.floor((now - start) / 1000), units = [
        { d: 60, l: "seconds" },
        { d: 60, l: "minutes" },
        { d: 24, l: "hours" },
        { d: 7, l: "days" }
    ];
    
    let s = "";

    for(let i = 0; i < units.length; ++i) {
        s = `${(diff % units[i].d)} ${units[i].l} ${s}`;
        diff = Math.floor(diff / units[i].d);
    }

    return s;
}