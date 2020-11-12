const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
const { prefix } = require("./data/config.json");

let online = false

const activities_list = [
    "Fuck off", 
    "Bermuda is daddy",
    "Don't do drugs", 
    "Bermuda <3",
    "Type +Gethelp for command list"
    ]; // creates an arraylist containing phrases you want your bot to switch through.

bot.on('ready', () => {
    console.log(`(discord): ready as ${bot.user.username}`);
    online = true;
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        bot.user.setActivity(activities_list[index]); // sets bot's activities to one of the phrases in the arraylist.
    }, 5000); // Runs this every 10 seconds.
});

bot.on("message", msg => {
    if(msg.author.bot) return;
    let content = msg.content.split(" "),
        command = content[0].slice(prefix.length),
        args = content.slice(1),
        commands = fs.readdirSync("./discord/commands");

    if(commands.indexOf(`${command}.js`) > -1) {
        let cmd = require(`./commands/${command}.js`);
        console.log(`(discord): found command (${command}.js)`);

        if(typeof cmd.info == "object") {
            cmd.run(bot, msg, args);
        }
    }
})

module.exports.init = (token) => {
    bot.login(token).catch(() => {
        console.log(`(discord): failed to init`);
    });
}

module.exports.status = () => {
    return online;
}