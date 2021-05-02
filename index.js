const { Client, Collection, MessageEmbed, MessageAttachment } = require('discord.js');
const { Developer, base, config } = require('./config/config.json');
const { error, warning, info } = require('log-symbols');
const moment = require('moment');
const fs = require(`fs`);
const { readdirSync } = require('fs');
if (process.version.slice(1).split('.') < 13) throw new Error(`Please use Node 13 or higher.`)

const client = new Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"], queue: new Map() });

client.commands = new Collection()
global.author = require('./package.json').author
global.version = require('./package.json').version;
if (Developer.debug == true) {
    client.on('debug', d => console.log(warning, `[${moment().format('YYYY-MM-DD HH:mm:ss:ms')}]: ${d}`))
}

const init = async function() {
    const cmds = await readdirSync(`./commands/`)
    global.totalCmds = cmds.length;
    console.log(info, `Loading ${cmds.length} commands.`)
    cmds.forEach(f => {
        try {
            const p = require(`./commands/${f}`)
            client.commands.set(p.info.name, p)
        } catch (e) {
            console.warn(error, `Failed to load a command [${e}]`)
        }
    })
    if (global.totalCmds == 0) console.log(info, `No command files loaded.`)

    const events = await readdirSync(`./events/`)
    console.log(info, `Loading ${events.length} events.`)
    events.forEach(f => {
        const name = f.split('.')[0];
        const event = require(`./events/${f}`)
        client.on(name, event.bind(null, client))
        delete require.cache[require.resolve(`./events/${f}`)]
    })
    if (events.length == 0) console.log(info, `No event files loaded.`)

    client.login(base.token).catch(e => console.log(error, `Failed to login [${e}]`))
}
init()