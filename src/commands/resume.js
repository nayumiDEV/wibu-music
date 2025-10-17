import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Tiếp tục phát nhạc'),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
      return interaction.reply({
        content: '❌ Không có nhạc trong hàng đợi!',
        ephemeral: true
      });
    }

    queue.node.setPaused(false);
    return interaction.reply('▶️ Đã tiếp tục phát nhạc!');
  }
};
