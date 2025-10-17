import { Client, GatewayIntentBits } from 'discord.js';
import { Player } from 'discord-player';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import dotenv from 'dotenv';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createWebServer } from './web/server.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const player = new Player(client, {
  ytdlOptions: {
    quality: 'highestaudio',
    highWaterMark: 1 << 25
  }
});

await player.extractors.register(YoutubeiExtractor, {});
await player.extractors.loadDefault((ext) => ext !== 'YouTubeExtractor');

client.commands = new Map();

const commandFiles = readdirSync(join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.default.data.name, command.default);
}

client.once('ready', () => {
  console.log(`✅ Bot đã sẵn sàng! Đăng nhập với tên: ${client.user.tag}`);
  console.log(`🎵 Đã kết nối đến ${client.guilds.cache.size} server(s)`);
  
  createWebServer(client, player);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction, player);
  } catch (error) {
    console.error(`Lỗi khi thực thi lệnh ${interaction.commandName}:`, error);
    const errorMessage = '❌ Có lỗi xảy ra khi thực thi lệnh này!';
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: errorMessage, ephemeral: true });
    } else {
      await interaction.reply({ content: errorMessage, ephemeral: true });
    }
  }
});

player.events.on('playerStart', (queue, track) => {
  if (queue.metadata?.channel) {
    queue.metadata.channel.send(`▶️ Đang phát: **${track.title}** - \`${track.duration}\``).catch(console.error);
  }
});

player.events.on('audioTrackAdd', (queue, track) => {
  if (queue.metadata?.channel && queue.tracks.size > 0) {
    queue.metadata.channel.send(`✅ Đã thêm **${track.title}** vào hàng đợi`).catch(console.error);
  }
});

player.events.on('emptyQueue', (queue) => {
  if (queue.metadata?.channel) {
    queue.metadata.channel.send('✅ Hàng đợi đã kết thúc!').catch(console.error);
  }
});

player.events.on('emptyChannel', (queue) => {
  if (queue.metadata?.channel) {
    queue.metadata.channel.send('👋 Đã rời voice channel vì không có ai!').catch(console.error);
  }
});

player.events.on('playerError', (queue, error) => {
  console.error('Lỗi player:', error);
  if (queue.metadata?.channel) {
    queue.metadata.channel.send('❌ Có lỗi xảy ra khi phát nhạc!').catch(console.error);
  }
});

player.events.on('error', (queue, error) => {
  console.error('Lỗi queue:', error);
  if (queue.metadata?.channel) {
    queue.metadata.channel.send('❌ Có lỗi xảy ra với hàng đợi!').catch(console.error);
  }
});

client.login(process.env.DISCORD_TOKEN);
