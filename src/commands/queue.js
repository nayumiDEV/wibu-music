import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Hiển thị hàng đợi phát nhạc'),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || queue.isEmpty()) {
      return interaction.reply({
        content: '❌ Hàng đợi trống!',
        ephemeral: true
      });
    }

    const currentTrack = queue.currentTrack;
    const tracks = queue.tracks.toArray();

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('📝 Hàng đợi phát nhạc')
      .setDescription(
        `**Đang phát:**\n${currentTrack.title} - \`${currentTrack.duration}\`\n\n` +
        (tracks.length > 0 
          ? `**Tiếp theo:**\n${tracks.slice(0, 10).map((track, i) => 
              `${i + 1}. ${track.title} - \`${track.duration}\``
            ).join('\n')}${tracks.length > 10 ? `\n\n*...và ${tracks.length - 10} bài hát khác*` : ''}`
          : '*Không có bài hát tiếp theo*')
      )
      .setFooter({ text: `Tổng cộng: ${tracks.length + 1} bài hát` });

    return interaction.reply({ embeds: [embed] });
  }
};
