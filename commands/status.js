//status
const dconfig = require('../config_default.json')
const config = require('../config.json')
var PREFIX = config.PREFIX || dconfig.PREFIX
var TWITCH_URL = config.TWITCH_URL || dconfig.TWITCH_URL

module.exports = {
  verify(cmd) {
    return cmd.replace(/(streaming)|(stream)|(listening)|(listen)|(watching)|(watch)|(playing)|(play)/i, '')
      .length === 0
  },
  help(prefix, full) {
    var usage = `${prefix}streaming <status>\n${prefix}listening <status>\n` +
    `${prefix}watching <status>\n${prefix}playing <status>`
    var desc = 'Sets a status to your profile.'
    var other = `*\\*To remove your status, leave the <status> argument empty*\n` +
    `*\\*Status changes may not be immediate*`
    if (full) {

    } else {
      return [usage, desc]
    }
  },
  async run(client, msg, args) {
    try {
      var cmd = msg.content.slice(PREFIX.length).split(' ')[0]
      var options = [
        ['playing', 'play'],
        ['streaming', 'stream'],
        ['listening', 'listen'],
        ['watching', 'watch']
      ]
      for (let i = 0; i < options.length; i++) {
        if (options[i].includes(cmd.toLowerCase())) {
          cmd = i
          break
        }
      }
      var reply = await msg.reply('setting...')
      await client.user.setPresence({
        game: {
          type: cmd,
          name: args.join(' '),
          url: TWITCH_URL
        }
      })
      if (args.join(' ') === '') {
        await reply.edit(`<@${client.user.id}>, status removed!`)
      } else {
        await reply.edit(`<@${client.user.id}>, completed!`)
      }
      await reply.delete(2000)
      await msg.delete()
    } catch (e) {
      console.error(e)
      msg.reply('an error occured!')
        .then(m => m.delete(5000))
        .then(() => msg.delete())
        .catch(console.error)
    }
  }
}