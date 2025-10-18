import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Xáo trộn hàng đợi'),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || queue.isEmpty()) {
      return interaction.reply({
        content: '❌ Hàng đợi trống!',
        ephemeral: true
      });
    }

    queue.tracks.shuffle();
    return interaction.reply('🔀 Đã xáo trộn hàng đợi!');
  }
};
