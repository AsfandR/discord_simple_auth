const { Client, RichEmbed } = require('discord.js');

module.exports.run = (bot, message, args, con, config) => {

	if (message.channel.type.toLowerCase() === "dm" || message.channel.type.toLowerCase() === "group") return;

	let all = message.content.split(" ");
	let license = all[1];
	let phone = all[2];

	if (message.content === "!activate") {
		const embed = new RichEmbed()
	  .setColor('#FFFFFF')
	  .setAuthor("Rank Activation", config.bot.logo_url)
	  .setTitle("Format")
	  .setDescription("**!activate** `License`")
	  message.channel.send(embed);
	} else {
		if (license && !phone) {
			con.query(`SELECT * FROM licenses WHERE license = '${license}'`, function (err, rows) {
		    if (err) throw err;
				if (rows.length) {
					if (rows[0].used === 0) {
						var role = message.guild.roles.find(role => role.name === rows[0].type);
						message.member.addRole(role).catch(console.error);
						con.query(`UPDATE licenses SET used = 1, used_by = '${message.author.id}' WHERE license = '${license}'`, (err, row) => {
					    if (err) throw err;
					  });
						const embed = new RichEmbed()
					  .setColor('#FFFFFF')
					  .setAuthor(`Successfully Gave ${rows[0].type} Rank To ${message.member.user.tag}`, config.bot.logo_url)
					  message.channel.send(embed);
					  message.delete();
					} else {
						const embed = new RichEmbed()
					  .setColor('#FFFFFF')
					  .setAuthor("License Already Used!", config.bot.logo_url)
					  message.channel.send(embed);
					  message.delete();
					}
				} else {
					const embed = new RichEmbed()
				  .setColor('#FFFFFF')
				  .setAuthor("License Not Found!", config.bot.logo_url)
				  message.channel.send(embed);
				  message.delete();
				}
		  });
		} else if (license && phone) {
			con.query(`SELECT * FROM licenses WHERE license = '${license}'`, function (err, rows) {
		    if (err) throw err;
				if (rows.length) {
					if (rows[0].used === 0) {
						var role = message.guild.roles.find(role => role.name === rows[0].type);
						message.member.addRole(role).catch(console.error);
						con.query(`UPDATE licenses SET used = 1, used_by = '${message.author.id}', phone = '${phone}' WHERE license = '${license}'`, (err, row) => {
					    if (err) throw err;
					  });
						const embed = new RichEmbed()
					  .setColor('#FFFFFF')
					  .setAuthor(`Successfully Gave ${rows[0].type} Rank To ${message.member.user.tag}`, config.bot.logo_url)
					  message.channel.send(embed);
					  message.delete();
					} else {
						const embed = new RichEmbed()
					  .setColor('#FFFFFF')
					  .setAuthor("License Already Used!", config.bot.logo_url)
					  message.channel.send(embed);
					  message.delete();
					}
				} else {
					const embed = new RichEmbed()
				  .setColor('#FFFFFF')
				  .setAuthor("License Not Found!", config.bot.logo_url)
				  message.channel.send(embed);
				  message.delete();
				}
		  });
		} else {
			const embed = new RichEmbed()
			.setColor('#FFFFFF')
			.setAuthor("Wrong Format!", config.bot.logo_url)
			message.channel.send(embed);
			message.delete();
		}
	}
}

module.exports.help = {
	name: "activate"
}
