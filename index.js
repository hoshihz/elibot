const { token } = require('./token.js')
const Discord = require('discord.js')
const bot = new Discord.Client

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}`)
})

bot.on('message', msg => {
	if (msg.author.tag != bot.user.tag)
		return
	if (msg.content.startsWith('$')) {
		let args = msg.content.slice(1).split(' ')
		let cmd = args.shift()

		switch(cmd.toLowerCase()) {
			case 'streaming':
				msg.delete(2000).catch(console.error)
				bot.user.setPresence({
					game: {
						type: 'STREAMING',
						name: args.join(' '),
						url: 'https://www.twitch.tv/margielasweater'
					}
				}).catch(console.error)
				break

			case 'listening':
				msg.delete(2000).catch(console.error)
				bot.user.setPresence({
					game: {
						type: 'LISTENING',
						name: args.join(' ')
					}
				}).catch(console.error)
				break

			case 'watching':
				msg.delete(2000).catch(console.error)
				bot.user.setPresence({
					game: {
						type: 'WATCHING',
						name: args.join(' ')
					}
				}).catch(console.error)
				break

			case 'playing':
				msg.delete(2000).catch(console.error)
				bot.user.setPresence({
					game: {
						type: 'PLAYING',
						name: args.join(' ')
					}
				}).catch(console.error)
				break

			case 'cycle':
				msg.delete(2000).catch(console.error)
				if (!bot.user.presence.game) {
					msg.reply('set status first!')
						.then(msg => msg.delete(3000))
					return
				}
				bot.user.setPresence({
					game: {
						type: (bot.user.presence.game.type+1)%4,
						name: bot.user.presence.game.name,
						url: bot.user.presence.game.url
					}
				}).catch(console.error)
				break

			case 'react':
				if (Number(args[0]) >= 100) {
					msg.reply("can't react to more than 99 at once!")
						.then(msg => msg.delete(5000))
					return
				}
				msg.channel.fetchMessages({ limit: Number(args[0]) })
					.then(fetched => {
						for (let i of fetched) {
							i[1].react('😀')
								.catch(console.error)
							i[1].react('😏')
								.catch(console.error)
						}
					})
					.catch(console.error)
				break

			case 'purge':
				let args = msg.content.slice(7).split(' ')
        if (args.includes("-self")) {
          function _filter(m) {
            return m.author.tag === bot.user.tag
          }
          let i = args.indexOf("-self")
          args.splice(i, 1)
        } else {
          function _filter(m) {
            return m.deletable === true
          }
        }
        args = Number(args[0])
        if (isNaN(args)) {
          msg.reply(`\`${args}\` is not a number!`)
            .then(msg => msg.delete(5000))
            .catch(console.error)
          return
        } else if (args > 1000) {
          msg.reply(`can't purge more than 1000 at once`)
            .then(msg => msg.delete(5000))
            .catch(console.error)
          return
        }
        msg.channel.fetchMessages({
            limit: (args > 100) ? 100 : args,
            before: msg.id
          })
          .then(async fetched => {
            let n, mDeleted = []
            while ((n = args - fetched.size) !== 0) {
              let before = fetched.last().id
              let limit = (n > 100) ? 100 : n
              const options = {
                limit,
                before
              }
              const messages = await msg.channel.fetchMessages(options)
              fetched = fetched.concat(messages)
            }
            let size = fetched
              .filter(_filter)
              .tap(m => mDeleted.push(m.delete()))
              .size
            try {
              await Promise.all(mDeleted)
              let m = await msg.reply(`${size} messages deleted!`)
              await m.delete(3000)
              if (msg.deletable)
                await msg.delete()
            } catch (e) {
              console.error(e)
            }
          })
				break

			case 'massban':
				msg.delete()
					.catch(console.error)
				if (!msg.guild) {
					msg.reply('this is not a server!')
						.then(msg => msg.delete(5000))
					return
				}
				for (let i of msg.guild.members) {
					if (i[1].bannable)
						msg.guild.ban(i[1], { reason: 'Victim of mass ban.' })
							.then(user => msg.channel.send(`Banned ${user.tag || user}`)
								.then(msg => msg.delete(1000)))
							.catch(console.error)
				}
				break

			case 'dall':
				msg.delete()
				for (let i of msg.guild.channels) {
					if (i[1].deletable && i[0] != '640803331672899596')
						i[1].delete()
							.catch(console.error)
					else
						msg.reply(`can't delete <#${i[0]}>!`)
							.then(msg => msg.delete(3000))
				}
				
				for (let i of msg.guild.roles) {
					if (i[1] === msg.guild.defaultRole)
						continue
					if (i[1].editable)
						i[1].delete()
							.catch(console.error)
					else
						msg.reply(`can't delete <@&${i[0]}>!`)
							.then(msg => msg.delete(3000))
				}
				for (let i of msg.guild.emojis) {
					if (i[1].deletable)
						msg.guild.deleteEmoji(i[1])
							.catch(console.error)
					else
						msg.reply(`can't delete ${i[1].name}!`)
							.then(msg => msg.delete(3000))
				}
				break

			default:
				msg.delete(5000)
				msg.channel.send('unknown command')
					.then(msg => msg.delete(3000))
					.catch(console.error)
		}
	}
})

bot.login(token)
