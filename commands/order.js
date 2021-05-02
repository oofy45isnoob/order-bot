const { MessageEmbed } = require(`discord.js`);
const fs = require(`fs`);
exports.run = async(client, message, args, base, config) => {
    message.delete().catch(e => {});
    const list = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789abcdefghijklmnopqrstuvwxyz-_=+!@#$%^&*()?/,.<>[]{};':";
    var res = "";
    for (var i = 0; i < 5; i++) {
        var rnd = Math.floor(Math.random() * list.length);
        res = res + list.charAt(rnd);
    };
    var category = await message.guild.channels.cache.get(config.openOrdersCategoryID);
    var logs = await message.guild.channels.cache.get(config.orderLoggingChannel);
    if (!category || !logs) return message.reply(`The guild administartion hasn't setup this feature yet!`).then(a => a.delete({ timeout: 5000 }));
    var orders = JSON.parse(fs.readFileSync(`./src/orderLogs.json`, `utf-8`));
    while (orders[res]) {
        for (var i = 0; i < 5; i++) {
            var rnd = Math.floor(Math.random() * list.length);
            res = res + list.charAt(rnd);
        };
    }
    message.guild.channels.create(`order-${message.author.username}`, {
        type: `text`,
        parent: config.openOrdersCategoryID,
        permissionOverwrites: [{
            id: message.guild.id,
            deny: [`VIEW_CHANNEL`]
        }, {
            id: message.author.id,
            allow: [`VIEW_CHANNEL`, `SEND_MESSAGES`, `READ_MESSAGE_HISTORY`]
        }]
    }).then(async function(channel) {
        message.reply(`Your order has been opened in ${channel}.`).then(a => a.delete({ timeout: 5000 }));
        const filter = response => { return response.author.id === message.author.id };
        channel.send(`${message.member}, in a few brief words please describe what you would like to order today.`).then(async(w) => {
            channel.awaitMessages(filter, { max: 1, time: 600000, errors: [`time`] }).then(async(c) => {
                channel.bulkDelete(2);
                config.orderManagerRoleIDs.forEach(id => {
                    channel.updateOverwrite(id, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true }).catch(e => {});
                });
                var date = new Date();
                date = date.getMonth() + `/` + date.getDate() + `/` + date.getFullYear() + ` ` + date.getHours() + `:` + date.getMinutes() + `:` + date.getSeconds();
                var desc = `Order Date: ${date}\nOrder Client: ${message.member}\nOrder Description: ${c.first().content}`;
                var embed = new MessageEmbed()
                    .setFooter(client.user.username, client.user.displayAvatarURL({ format: `png`, dynamic: true, size: 1024 }))
                    .setColor(base.color)
                    .setTitle(`Order ${res}`)
                    .setDescription(desc)
                channel.send(embed);
                logs.send(embed.setDescription(desc + `\nStatus: Opened`).setColor(`GREEN`)).then(async(l) => {
                    orders = JSON.parse(fs.readFileSync(`./src/orderLogs.json`, `utf-8`));
                    orders[res] = { client: message.author.username, description: desc, id: l.id };
                    fs.writeFile(`./src/orderLogs.json`, JSON.stringify(orders), function(err) { if (err) throw err; });
                });
            }).catch(async(err) => {
                channel.delete().catch(e => {});
                return message.reply(`You failed to respond to time in your order ticket.`).then(a => a.delete({ timeout: 5000 }));
            });
        });

    }).catch(async(err) => {
        return message.reply(`There was an error.\n${e.stack}`)
    });
}, exports.info = { name: "order" }