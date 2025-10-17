import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Xóa một bài hát khỏi hàng đợi')
    .addIntegerOption(option =>
      option
        .setName('position')
        .setDescription('Vị trí bài hát trong hàng đợi')
        .setRequired(true)
        .setMinValue(1)
    ),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || queue.isEmpty()) {
      return interaction.reply({
        content: '❌ Hàng đợi trống!',
        ephemeral: true
      });
    }

    const position = interaction.options.getInteger('position') - 1;
    const tracks = queue.tracks.toArray();

    if (position >= tracks.length) {
      return interaction.reply({
        content: '❌ Vị trí không hợp lệ!',
        ephemeral: true
      });
    }

    const removed = tracks[position];
    queue.removeTrack(position);

    return interaction.reply(`🗑️ Đã xóa **${removed.title}** khỏi hàng đợi!`);
  }
};
