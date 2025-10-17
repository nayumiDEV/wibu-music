import { SlashCommandBuilder } from 'discord.js';
import { useMainPlayer, QueryType } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Phát nhạc từ link hoặc tìm kiếm')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Link hoặc tên bài hát')
        .setRequired(true)
    ),
  
  async execute(interaction) {
    const player = useMainPlayer();
    const query = interaction.options.getString('query');
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.reply({
        content: '❌ Bạn cần vào một voice channel trước!',
        ephemeral: true
      });
    }

    await interaction.deferReply();

    try {
      const { track, searchResult } = await player.play(channel, query, {
        nodeOptions: {
          metadata: {
            channel: interaction.channel,
            client: interaction.guild.members.me,
            requestedBy: interaction.user
          },
          volume: 50,
          leaveOnEnd: true,
          leaveOnStop: true,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 300000,
          selfDeaf: true
        }
      });

      const sourceName = {
        youtube: 'YouTube',
        spotify: 'Spotify',
        soundcloud: 'SoundCloud',
        apple_music: 'Apple Music',
        arbitrary: 'Direct URL'
      }[searchResult.queryType] || searchResult.queryType;

      return interaction.followUp({
        content: `🎵 **${searchResult.playlist ? 'Đã thêm playlist' : 'Đang phát'}**: ${track.title} (từ ${sourceName})`
      });
    } catch (error) {
      console.error('Lỗi khi phát nhạc:', error);
      return interaction.followUp({
        content: `❌ Không thể phát nhạc: ${error.message}`
      });
    }
  }
};
