const { Client, RichEmbed } = require('discord.js');

module.exports.run = (bot, message, args, con, config) => {

	if (message.channel.type.toLowerCase() === "text") return;
	if (!config.bot.owners.includes(message.author.id)) return;

	function random() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000)
	      .toString(16)
	      .substring(1);
	  }
	  return `${s4()}-${s4()}-${s4()}-${s4()}-${s4()}`;
	}

	let all = message.content.split(" ");
	let type = all[1];
	let amount = all[2];
	let length = all[3];

	Date.prototype.addDays = function(days) {
  	this.setDate(this.getDate() + parseInt(days));
	  return this;
	};

	var current_date = new Date();
	current_date.addDays(length);

	let msg = `\`\`\`\n${amount} ${length}d ${type} Licenses Added To Database\n\n`;
	for (var i = 0; i < amount; i++) {
		let license = random().toUpperCase();
	  con.query(`INSERT INTO licenses (license, type, used, expire_at) VALUES ('${license}', '${type}', 0, '${current_date}')`, (err, rows) => {
	    if (err) throw err;
	  });
		msg += `${license}\n`;
	}
	message.channel.send(msg + '```');
}

module.exports.help = {
	name: "gen"
}
