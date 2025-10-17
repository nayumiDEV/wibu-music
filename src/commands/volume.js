import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Điều chỉnh âm lượng')
    .addIntegerOption(option =>
      option
        .setName('level')
        .setDescription('Mức âm lượng (0-100)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(100)
    ),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue) {
      return interaction.reply({
        content: '❌ Không có nhạc trong hàng đợi!',
        ephemeral: true
      });
    }

    const volume = interaction.options.getInteger('level');
    queue.node.setVolume(volume);

    return interaction.reply(`🔊 Đã đặt âm lượng thành **${volume}%**`);
  }
};
