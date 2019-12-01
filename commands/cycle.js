//cycle

module.exports = {
  verify(cmd) {
    return cmd.replace(/(cycle)/i, '').length === 0
  },
  help() {

  },
  async run(client, msg, args) {
    try {
      if (!client.user.presence.game) {
        let reply = await msg.reply('set status first!')
        await reply.delete(3000)
        await msg.delete()
        return
      }
      var reply = await msg.reply('cycling...')
      await client.user.setPresence({
        game: {
          type: (client.user.presence.game.type + 1) % 4,
          name: client.user.presence.game.name,
          url: client.user.presence.game.url
        }
      })
      await reply.edit(`<@${client.user.id}>, completed!`)
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