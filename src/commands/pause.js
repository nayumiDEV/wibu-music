import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Tạm dừng nhạc đang phát'),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({
        content: '❌ Không có nhạc đang phát!',
        ephemeral: true
      });
    }

    queue.node.setPaused(true);
    return interaction.reply('⏸️ Đã tạm dừng nhạc!');
  }
};
