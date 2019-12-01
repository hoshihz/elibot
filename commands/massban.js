//massban

module.exports = {
  verify(cmd) {
    return cmd.replace(/(massban)/i, '').length === 0
  },
  help() {

  },
  async run(client, msg, args) {
    try {
      if (!msg.guild) {
        let reply = await msg.reply('this is not a server!')
        await reply.delete(5000)
        await msg.delete()
        return
      }
      var reply = await msg.reply('initiating massban...')
      for (let i of msg.guild.members) {
        if (i[1].bannable) {
          let user = await msg.guild.ban(i[1], {
            reason: 'Victim of mass ban.'
          })
          let message = await msg.channel.send(`Banned ${user.tag || user}`)
          await message.delete(1000)
        }
      }
      await reply.edit(`<@${client.user.id}>, massban complete!`)
      await reply.delete(3000)
      await msg.delete()
    } catch (e) {
      console.error(e)
      msg.reply('an error occured!')
        .then(m => m.delete(5000))
        .catch(console.error)
    }
  }
}