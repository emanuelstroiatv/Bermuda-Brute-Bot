const request = require("request-promise");

module.exports.getIPs = (tag) => {
    let unique = [];
    return new Promise((resolve, reject) => {
        request({
            method: "POST",
            uri: "https://urlhaus-api.abuse.ch/v1/tag/",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `tag=${tag}`
        }).then(data => {
            data = JSON.parse(data);

            if(data.query_status == "no_results") {
                return reject(JSON.stringify({
                    error: true,
                    message: "There was no results found"
                }));
            } else {
                for(let i = 0; i < data.urls.length; i++) {
                    let url = data.urls[i].url.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g);

                    if(url) {
                        if(!unique.includes(url[0])) {
                            unique.push(url[0]);
                        }
                    }

                    if(i == data.urls.length - 1) {
                        return resolve(JSON.stringify({
                            error: false,
                            message: `Succesfully gotten ${unique.length} unique IPs`,
                            ips: unique
                        }));
                    }
                }
            }
        }).catch(() => {
            return resolve(JSON.stringify({
                error: true,
                message: "There was an error when making the request"
            }));
        })
    });
}