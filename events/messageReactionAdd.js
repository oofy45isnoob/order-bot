const { MessageEmbed } = require("discord.js");
const { base, config } = require(`../config/config.json`);
module.exports = async function(client, reaction, user) {
    if (reaction.partial) try { await reaction.fetch(); } catch (e) { return; };
    if (user.bot) return;
    if (reaction.message.id == config.verifyMessageID) {
        var member = reaction.message.guild.members.cache.find(m => m.id === user.id);
        if (!member) return;
        var role = reaction.message.guild.roles.cache.find(r => r.id === `648713047829118977`);
        if (!role) return;
        if (reaction.emoji.id !== `739560996388995152`) reaction.users.remove(user.id);
        member.roles.add(role);
    }
}