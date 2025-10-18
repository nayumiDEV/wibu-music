import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Dừng phát nhạc và xóa hàng đợi'),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
      return interaction.reply({
        content: '❌ Không có nhạc trong hàng đợi!',
        ephemeral: true
      });
    }

    queue.delete();
    return interaction.reply('⏹️ Đã dừng phát nhạc và xóa hàng đợi!');
  }
};
