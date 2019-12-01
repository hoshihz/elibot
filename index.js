const fs = require('fs')
if (!fs.existsSync('./config.json')) {
  fs.writeFileSync('config.json', JSON.stringify({TOKEN:''}, null, 2))
}
const dconfig = require('./config_default.json')
const config = require('./config.json')
const Discord = require('discord.js')
const client = new Discord.Client
var PREFIX = config.PREFIX || dconfig.PREFIX
var commands = []
var activeCommands = [
  "react", "purge", "status", "cycle", "massban", "dall", "pfp"
]

for (let command of activeCommands) {
  commands.push(require('./commands/' + command))
}

if (config.TOKEN === '') {
  throw new Error('Please enter your token into config.json!')
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

client.login(config.TOKEN)
  .catch(console.error)