//dall

module.exports = {
  verify(cmd) {
    return cmd.replace(/(dall)/i, '').length === 0
  },
  help() {

  },
  async run(client, msg, args) {
    try {
      var undeletable = [],
        deletable = []
      var reply = await msg.reply('initiating delete all...')
      for (let i of msg.guild.channels) {
        if (i[1].deletable) {
          if (i[1] == msg.channel)
            continue
          deletable.push(i[1].delete())
        } else
          undeletable.push(msg.reply(`can't delete <#${i[0]}>!`))
      }
      for (let i of msg.guild.roles) {
        if (i[1] === msg.guild.defaultRole)
          continue
        else if (i[1].editable)
          deletable.push(i[1].delete())
        else
          undeletable.push(msg.reply(`can't delete <@&${i[0]}>!`))
      }
      var done = await Promise.all(undeletable)
      undelatable = []
      await Promise.all(deletable)
      for (let message of done) {
        undeletable.push(message.delete())
      }
      await Promise.all(undeletable)
      await reply.edit(`<@${client.user.id}>, delete all completed!`)
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