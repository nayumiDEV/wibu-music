import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Xóa toàn bộ hàng đợi'),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || queue.isEmpty()) {
      return interaction.reply({
        content: '❌ Hàng đợi trống!',
        ephemeral: true
      });
    }

    queue.tracks.clear();
    return interaction.reply('🗑️ Đã xóa toàn bộ hàng đợi!');
  }
};
