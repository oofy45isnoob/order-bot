const { success, info } = require('log-symbols');
const { config } = require('../config/config.json');
const fs = require(`fs`);
module.exports = async client => {
    setTimeout(() => {
        console.log(success, `Logged in as ${client.user.tag}`)
        client.user.setPresence({
            activity: {
                type: config.clientStatus.type.toUpperCase(),
                name: config.clientStatus.name
            },
            status: config.clientStatus.status
        });
    }, 2000);
    console.log(info, `This is the invite for your bot! https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`);
}