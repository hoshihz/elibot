const {
  TOKEN,
  PREFIX
} = require('./config.json')
const Discord = require('discord.js')
const client = new Discord.Client
var commands = []
var activeCommands = [
  "react", "purge", "status", "cycle", "massban", "dall"
]

for (let command of activeCommands) {
  commands.push(require('./commands/' + command))
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.on('message', msg => {
  if (msg.author.tag != client.user.tag)
    return
  if (msg.content.startsWith(PREFIX)) {
    let args = msg.content.slice(PREFIX.length).split(' ')
    let cmd = args.shift()

    for (let command of commands) {
      if (command.verify(cmd)) {
        command.run(client, msg, args)
        break
      }
    }
  }
})

client.login(TOKEN)