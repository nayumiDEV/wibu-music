import { SlashCommandBuilder } from 'discord.js';
import { isAutoplayEnabled, setAutoplay, toggleAutoplay } from '../state/autoplay.js';

export default {
  data: new SlashCommandBuilder()
    .setName('autoplay')
    .setDescription('Bật/tắt chế độ tự động phát bài hát tương tự')
    .addStringOption(option =>
      option
        .setName('mode')
        .setDescription('Chế độ')
        .addChoices(
          { name: 'Bật', value: 'on' },
          { name: 'Tắt', value: 'off' },
          { name: 'Chuyển đổi', value: 'toggle' },
          { name: 'Trạng thái', value: 'status' }
        )
    ),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const mode = interaction.options.getString('mode') || 'status';

    let enabled = isAutoplayEnabled(guildId);

    switch (mode) {
      case 'on':
        enabled = setAutoplay(guildId, true);
        return interaction.reply('🤖 Autoplay đã được bật. Bot sẽ tự động phát bài hát tương tự khi hàng đợi trống.');
      case 'off':
        enabled = setAutoplay(guildId, false);
        return interaction.reply('🛑 Autoplay đã được tắt.');
      case 'toggle':
        enabled = toggleAutoplay(guildId);
        return interaction.reply(enabled ? '🤖 Autoplay: BẬT' : '🛑 Autoplay: TẮT');
      case 'status':
      default:
        return interaction.reply(enabled ? '🤖 Autoplay đang BẬT.' : '🛑 Autoplay đang TẮT.');
    }
  }
};
