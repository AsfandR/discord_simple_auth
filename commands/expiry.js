const {
	Client,
	RichEmbed
} = require('discord.js');

module.exports.run = (bot, message, args, con, config) => {

	if (message.channel.type.toLowerCase() === "dm") return;
	if (!config.bot.owners.includes(message.author.id)) return;


	function send_message(j, g, x, t, y) {
		setTimeout(function () {
			message.channel.send(`**${g} | <@!${x}> | ${t}** expires on **${y}**`)
		}, 500 * j);
	}

	con.query(`SELECT * FROM licenses`, function (err, rows) {
		if (err) throw err;
		if (rows.length) {
			for (var i = 0; i < rows.length; i++) {
				send_message(i, rows[i].license, rows[i].used_by, rows[i].type, rows[i].expire_at)
			}
		}
	});

}

module.exports.help = {
	name: "expiry"
}
