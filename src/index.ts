import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { ApplicationCommandData } from 'discord.js/typings';
import { config } from 'dotenv';

// Load environment variables from a .env file.
config();

const clientId = process.env.DISCORD_CLIENT_ID; // Get this from the Discord Developer Portal.
const guildId = '1133553280337850480'; // The server's ID where you want the bot to work. Useful for testing.
const token = process.env.DISCORD_TOKEN;

if (!clientId || !token) {
	throw new Error(
		'Missing environment variable DISCORD_CLIENT_ID or DISCORD_TOKEN from .env file.'
	);
}

const commands: ApplicationCommandData[] = [
	{
		name: 'start',
		description: 'Start the bot!',
	},
];

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
	],
});

client.once('ready', async () => {
	console.log('Bot is ready!');

	// Register commands.
	const rest = new REST({ version: '10' }).setToken(token!);
	await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
		body: commands,
	});
	console.log('Successfully registered application commands.');
});

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'start') {
		await interaction.reply('Bot started!');
	}
});

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;

	const content = message.content;
	const urlPattern = /(https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/\S+)/g;

	const matches = content.match(urlPattern);

	if (matches) {
		for (const url of matches) {
			const replacedUrl = url
				.replace('twitter.com', 'vxtwitter.com')
				.replace('x.com', 'vxtwitter.com');
			message.suppressEmbeds(true);
			await message.channel.send(replacedUrl);
		}
	}
});

client.on('warn', console.warn);
client.on('error', console.error);

client.login(token);
