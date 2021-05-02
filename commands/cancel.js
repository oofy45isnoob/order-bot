const { MessageEmbed } = require(`discord.js`);
const fs = require(`fs`);
exports.run = async(client, message, args, base, config) => {
        var logs = await message.guild.channels.cache.get(config.orderLoggingChannel);
        var orders = JSON.parse(fs.readFileSync(`./src/orderLogs.json`, `utf-8`));
        if (!args[0]) {
            return message.reply(`Please provide an order number!`).then(a => a.delete({ timeout: 5000 }));
        } else if (!orders[args[0]]) {
            return message.reply(`That order number doesn't exist!`).then(a => a.delete({ timeout: 5000 }));
        } else if (!args[1]) {
            return message.reply(`Please supply a reason for cancelling!`).then(a => a.delete({ timeout: 5000 }));
        } else {
            var order;
            await Object.keys(orders).forEach(o => {
                if (o == args[0]) {
                    order = orders[o];
                }
            });
            var perm = false;
            if (message.author.username !== order.client) {
                config.orderManagerRoleIDs.forEach(role => {
                    if (message.member.roles.cache.has(role)) {
                        perm = true;
                    }
                })
            } else {
                perm = true;
            }
            if (perm == false) return message.reply(`You do not have permission to cancel this order!`).then(a => a.delete({ timeout: 5000 }));
            logs.messages.fetch(order.id).then(async(msg) => {
                        var embed = new MessageEmbed()
                            .setFooter(client.user.username, client.user.displayAvatarURL({ format: `png`, dynamic: true, size: 1024 }))
                            .setColor(`YELLOW`)
                            .setTitle(`Order ${args[0]}`)
                            .setDescription(order.description + `\nStatus: Cancelled\nCancelled by: ${message.member}\nReason: ${args.slice(1).join(` `)}`)
            msg.edit(embed)
            message.react(`✅`);
            message.delete({ timeout: 5000 });
            client.channels.cache.forEach(channel => {
                if (channel.name.includes(order.client.toLowerCase())) return channel.delete().catch(e => { return; })
            });
        });
    }
}, exports.info = { name: "cancel" }