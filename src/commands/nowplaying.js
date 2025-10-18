import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Hiển thị bài hát đang phát'),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.currentTrack) {
      return interaction.reply({
        content: '❌ Không có nhạc đang phát!',
        ephemeral: true
      });
    }

    const track = queue.currentTrack;
    const timestamp = queue.node.getTimestamp();
    const progress = Math.floor((timestamp.current.value / timestamp.total.value) * 20);
    const progressBar = '▬'.repeat(progress) + '🔘' + '▬'.repeat(20 - progress);

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('🎵 Đang phát')
      .setDescription(`**${track.title}**`)
      .addFields(
        { name: 'Tác giả', value: track.author, inline: true },
        { name: 'Thời lượng', value: track.duration, inline: true },
        { name: 'Nguồn', value: track.source, inline: true },
        { name: 'Tiến trình', value: `${progressBar}\n\`${timestamp.current.label}\` / \`${timestamp.total.label}\`` }
      )
      .setThumbnail(track.thumbnail)
      .setFooter({ text: `Yêu cầu bởi ${track.requestedBy?.username || 'Unknown'}` });

    return interaction.reply({ embeds: [embed] });
  }
};
