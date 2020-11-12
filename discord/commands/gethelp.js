const Discord = require("discord.js");
const config = require("../data/config.json");

const fs = require("fs");
const commands = fs.readdirSync("./discord/commands");

module.exports.info = {
    name: "gethelp",
    description: "Shows all the commands."
}

module.exports.run = (bot, msg, args) => {
    if(msg.channel.type == "dm") {
        msg.delete();

        let embed = new Discord.MessageEmbed()
            .setTitle(`Seems there was an error.`)
            .setColor(config.colours.red)
            .setDescription("You can't run this command outside of the Server")
            .setFooter(`Command executed by: ${msg.author.tag}`)
            .setTimestamp();
        
        msg.channel.send({embed: embed});
    } else {
        let gethelp = [];
        for(let i = 0; i < commands.length; i++) {
            let cmd = require(`./${commands[i]}`);
            if(typeof cmd.info == "object") {
                gethelp.push({title: cmd.info.name, description: cmd.info.description})
            }

            if(i == commands.length - 1) {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Help Command`)
                    .setColor(config.colours.green)
                    .setFooter(`Command executed by: ${msg.author.tag}`)
                    .setTimestamp();
                
                for(let i = 0; i < gethelp.length; i++) embed.addField(gethelp[i].title, gethelp[i].description);

                msg.channel.send({embed: embed});
            }
        }
    }
}