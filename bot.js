/*---------------------------------------------------------------------------
	Modules
---------------------------------------------------------------------------*/
const Discord = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const mysql = require("mysql");
const Stream = require('stream').Transform;
const RichEmbed = require('discord.js');
var con = mysql.createConnection({
	host: config.database.host,
	user: config.database.user,
	password: config.database.password,
	database: config.database.database,
	insecureAuth: true
});
require('events').EventEmitter.prototype._maxListeners = 100;

/*---------------------------------------------------------------------------
	Command loader
---------------------------------------------------------------------------*/
let files = fs.readdirSync("./commands/"),
	cmds = new Map();

files.forEach(f => {
	let props = require(`./commands/${f}`);
	cmds.set(props.help.name, props);

	if (props.help.aliases) {
		props.help.aliases.forEach(a => cmds.set(a, props));
	}
});


/*---------------------------------------------------------------------------
	Client
---------------------------------------------------------------------------*/
const bot = new Discord.Client();


/*---------------------------------------------------------------------------
	Ready event
---------------------------------------------------------------------------*/
bot.on("ready", () => {
	bot.user.setActivity('Admin#0001')
	bot.generateInvite(["ADMINISTRATOR"]).then(console.log);
	console.log(`Logged in as ${bot.user.tag}`);
});

/*---------------------------------------------------------------------------
	Database Connection
---------------------------------------------------------------------------*/

con.connect(err => {
	if (err) throw err;
	console.log("Connected to the database!");
});

/*---------------------------------------------------------------------------
	Expired rank check
---------------------------------------------------------------------------*/

function checkrankexpiry() {
	con.query(`SELECT * FROM licenses WHERE used = 1`, function (err, rows) {
		if (err) throw err;
		if (rows.length) {
			for (var i = 0; i < rows.length; i++) {
				if (new Date(rows[i].expire_at) < new Date()) {
					var guild = bot.guilds.get(config.bot.guild);
					var role_to_remove = guild.roles.find(r => r.name === rows[i].type);
					if (guild.members.has(rows[i].used_by)) {
						var user = guild.members.get(rows[i].used_by);
						user.removeRole(role_to_remove);
						con.query(`DELETE FROM licenses WHERE license = '${rows[i].license}'`, function (err, rows) {
							if (err) throw err;
						});
						const embed = new Discord.RichEmbed()
							.setColor('#FFFFFF')
							.setAuthor(`Subscription Expired!`, config.bot.logo_url)
							.setTitle(`Your ${rows[i].type} Subscription Expired And The Rank Was Removed`)
							.setDescription(`Contact The Server Owner To Renew Your Subscription Before It's Too Late`)
						user.send(embed);
						bot.channels.get(config.bot.staff_channel).send(`**${rows[i].type}** Role Expired For User <@!${rows[i].used_by}> At **${rows[i].expire_at}**`);
					}
				}
			}
		}
	});
}
setInterval(checkrankexpiry, 5000);

/*---------------------------------------------------------------------------
	Message handler
---------------------------------------------------------------------------*/
bot.on("message", (message) => {

	if (!message.content.startsWith(config.bot.prefix)) return;
	if (message.author.bot || message.system) return;

	if (config.bot.owners.includes(message.author.id) && message.content === "!subrole") {
		var toSend = generateMessages();
		let mappedArray = [
			[toSend[0], false], ...toSend.slice(1).map((message, idx) => [message, reactions[idx]])
		];
		for (let mapObj of mappedArray) {
			message.channel.send(mapObj[0]).then(sent => {
				if (mapObj[1]) {
					sent.react(mapObj[1]);
				}
			});
		}
	}

	/*---------------------------------------------------------------------------
		Command handler
	---------------------------------------------------------------------------*/
	let split = message.content.split(/ +/g);
	let name = split[0].slice(config.bot.prefix.length).toLowerCase();
	let args = split.slice(1);

	let cmd = cmds.get(name);
	if (cmd) cmd.run(bot, message, args, con, config);
});


/*---------------------------------------------------------------------------
	Logging in
---------------------------------------------------------------------------*/
bot.login(config.bot.token);
bot.on('error', (error) => {
	console.log(String(error));
});
