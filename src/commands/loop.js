import { SlashCommandBuilder } from 'discord.js';
import { useQueue, QueueRepeatMode } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Bật/tắt chế độ lặp lại')
    .addStringOption(option =>
      option
        .setName('mode')
        .setDescription('Chế độ lặp lại')
        .setRequired(true)
        .addChoices(
          { name: 'Tắt', value: 'off' },
          { name: 'Lặp bài hát', value: 'track' },
          { name: 'Lặp hàng đợi', value: 'queue' }
        )
    ),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
      return interaction.reply({
        content: '❌ Không có nhạc trong hàng đợi!',
        ephemeral: true
      });
    }

    const mode = interaction.options.getString('mode');
    
    switch (mode) {
      case 'off':
        queue.setRepeatMode(QueueRepeatMode.OFF);
        return interaction.reply('🔁 Đã tắt chế độ lặp lại!');
      case 'track':
        queue.setRepeatMode(QueueRepeatMode.TRACK);
        return interaction.reply('🔂 Đang lặp lại bài hát hiện tại!');
      case 'queue':
        queue.setRepeatMode(QueueRepeatMode.QUEUE);
        return interaction.reply('🔁 Đang lặp lại hàng đợi!');
    }
  }
};
