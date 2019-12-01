//pfp
const Discord = require('discord.js')

module.exports = {
  verify(cmd) {
    return cmd.replace(/(pfp)/i, '').length === 0
  },
  help() {

  },
  async run(client, msg, args) {
    try {
      var users = msg.mentions.users
      if (users) {
        users.tap(user => {
          let embed = new Discord.RichEmbed()
            .setAuthor(user.tag, user.avatarURL, user.avatarURL)
            .setImage(user.avatarURL)
            .setColor(0xbd84)
          msg.channel.send(embed).catch(console.error)
        })
      } else {
        let reply = await msg.reply('please mention a user!')
        await reply.delete(3000)
        await msg.delete()
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