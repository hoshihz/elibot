//help
const Discord = require('discord.js')
const cmds = require('../index.js')
const config = require('../config.json')
const dconfig = require('../config_default.json')
const PREFIX = config.PREFIX || dconfig.PREFIX

module.exports = {
  verify(cmd) {
    return cmd.replace(/(help)/i, '').length === 0
  },
  help(msg) {
    var embed = new Discord.RichEmbed()
      .setColor(0xbd84)
      .setTitle('Help')
      .setDescription('List of commands')
    for (let cmd in cmds) {
      if (cmd === 'help') continue
      embed.addField(...cmds[cmd].help(PREFIX))
    }
    msg.channel.send(embed)
      .catch(console.error)
  },
  async run(client, msg, args) {
    try {
      if (args.length === 0) {
        this.help(msg)
        return
      }
      var cmd
      for (cmd in cmds) {
        if (cmd !== 'help' && cmds[cmd].verify(args[0])) {
          args.shift()
          cmds[cmd].help(PREFIX, true, args)
          break
        }
      }
    } catch (e) {
      console.error(e)
      msg.reply('an error occured!')
        .then(m => m.delete(5000))
        .then(() => msg.delete())
        .catch(console.error)
    }
  }
}