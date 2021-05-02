const { base, config } = require('../config/config.json');
const { error } = require('log-symbols');
module.exports = async function(client, message) {
    if (message.author.bot) return;
    if (!message.guild) return;
    let prefix = base.prefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    var command = args.shift().toLowerCase()
    const cmd = client.commands.get(command);
    if (message.content.startsWith(prefix)) {
        if (cmd) {
            try {
                cmd.run(client, message, args, base, config)
            } catch (e) {
                return console.log(error, `[NON-FATAL]: ${e}`)
            }
        } else {
            return;
        }
    }
}