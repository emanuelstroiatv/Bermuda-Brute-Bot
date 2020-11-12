const web = require("./web/web");
const discord = require("./discord/discord");

const config = require("./discord/data/config.json");

web.init(80);
discord.init(config.token);