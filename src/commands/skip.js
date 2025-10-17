import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Bỏ qua bài hát hiện tại'),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({
        content: '❌ Không có nhạc đang phát!',
        ephemeral: true
      });
    }

    const currentTrack = queue.currentTrack;
    queue.node.skip();
    
    return interaction.reply(`⏭️ Đã bỏ qua **${currentTrack.title}**`);
  }
};
