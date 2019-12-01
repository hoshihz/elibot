//

module.exports = {
  verify(cmd) {
    return cmd.replace(/()/i, '').length === 0
  },
  help() {
  
  },
  async run(client, msg, args) {
    try {

    } catch(e) {
      console.error(e)
      msg.reply('an error occured!')
        .then(m => m.delete(5000))
        .then(() => msg.delete())
        .catch(console.error)
    }
  }
}
