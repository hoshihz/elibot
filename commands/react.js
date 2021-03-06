//react
const dconfig = require('../config_default.json')
const config = require('../config.json')
var LIMIT = config.LIMIT || dconfig.LIMIT
var REACTIONS = config.REACTIONS || dconfig.REACTIONS

module.exports = {
  verify(cmd) {
    return cmd.replace(/(react)/i, '').length === 0
  },
  help(prefix, full) {
    var usage = `${prefix}react <amount>`
    var desc = 'Adds a set of reaction(s) up to a set limit of messages in a channel.'
    var other = `*\\*Default limit is 1000, limit are configurable*\n` +
    `*\\*Default reactions are 😀 😏, reactions are configurable*`
    if (full) {

    } else {
      return [usage, desc]
    }
  },
  async run(client, msg, args) {
    try {
      if (isNaN(Number(args[0]))) {
        let reply = await msg.reply(`\`${args[0]}\` is not a number!`)
        await reply.delete(3000)
        await msg.delete()
        return
      } else if (Number(args[0]) > LIMIT) {
        let reply = await msg.reply(`can't react to more than ${LIMIT} at once!`)
        await reply.delete(5000)
        await msg.delete()
        return
      }
      var fetched = await msg.channel.fetchMessages({
        limit: (args > 100) ? 100 : args,
        before: msg.id
      })
      let n
      while ((n = args - fetched.size) !== 0) {
        const options = {
          limit: (n > 100) ? 100 : n,
          before: fetched.last().id
        }
        const messages = await msg.channel.fetchMessages(options)
        fetched = fetched.concat(messages)
      }
      var reply = await msg.reply('reacting...')
      for (let i of fetched) {
        for (let emoji of REACTIONS) {
          await i[1].react(emoji)
        }
      }
      await reply.edit(`<@${client.user.id}>, reaction successful!`)
      await reply.delete(3000)
      await msg.delete()
    } catch(e) {
      console.error(e)
      msg.reply('an error occured!')
        .then(m => m.delete(5000))
        .then(() => msg.delete())
        .catch(console.error)
    }
  }
}