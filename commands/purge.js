//purge
const {
  LIMIT
} = require('../config.json')

module.exports = {
  verify(cmd) {
    return cmd.replace(/(purge)/i, '').length === 0
  },
  help() {

  },
  async run(client, msg, args) {
    try {
      if (args.includes("-self")) {
        function _filter(m) {
          return m.author.tag === client.user.tag
        }
        let i = args.indexOf("-self")
        args.splice(i, 1)
      } else {
        function _filter(m) {
          return m.deletable === true
        }
      }
      var amount = Number(args[0])
      if (isNaN(amount)) {
        let reply = await msg.reply(`\`${args[0]}\` is not a number!`)
        await reply.delete(3000)
        await msg.delete()
        return
      } else if (amount > LIMIT) {
        let reply = await msg.reply(`can't purge more than ${LIMIT} at once`)
        await reply.delete(3000)
        await msg.delete()
        return
      }
      var fetched = await msg.channel.fetchMessages({
        limit: (amount > 100) ? 100 : amount,
        before: msg.id
      })
      var n, mDeleted = []
      while ((n = amount - fetched.size) !== 0) {
        const options = {
          limit: (n > 100) ? 100 : n,
          before: fetched.last().id
        }
        const messages = await msg.channel.fetchMessages(options)
        fetched = fetched.concat(messages)
      }
      var reply = await msg.reply('purging...')
      const size = fetched
        .filter(_filter)
        .tap(m => mDeleted.push(m.delete()))
        .size
      await Promise.all(mDeleted)
      await reply.edit(`<@${client.user.id}>, ${size} messages deleted!`)
      await reply.delete(3000)
      await msg.delete()
    } catch(e) {
      console.error(e)
      msg.reply('an error occured!')
        .then(m => m.delete(5000))
        .catch(console.error)
    }
  }
}