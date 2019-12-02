const fs = require('fs')
if (!fs.existsSync(__dirname+'/config.json')) {
  console.log('h')
  fs.writeFileSync(__dirname+'/config.json', '{}')
}
const readline = require('readline')
const dconfig = require('./config_default.json')
const config = require('./config.json')
const Discord = require('discord.js')
const client = new Discord.Client
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
var PREFIX = config.PREFIX || dconfig.PREFIX
var commands = {}
var activeCommands = [
  "react", "purge", "status", "cycle", "massban", "dall", "pfp", "help"
]
for (let command of activeCommands) {
  module.exports = commands
  commands[command] = (require('./commands/' + command))
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

    for (let command in commands) {
      if (commands[command].verify(cmd)) {
        commands[command].run(client, msg, args)
        break
      }
    }
  }
})

if (!config.TOKEN || config.TOKEN === '') {
  rl.question('Enter your token: ', token => {
    client.login(token)
      .catch(console.error)
    let configjson = JSON.parse(fs.readFileSync(__dirname+'/config.json'))
    configjson.TOKEN = token
    fs.writeFileSync(__dirname+'/config.json', JSON.stringify(configjson, null, 2))
    rl.close();
  });
} else {
  client.login(config.TOKEN)
    .catch(console.error)
}
