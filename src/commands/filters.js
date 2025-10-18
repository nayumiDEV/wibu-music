import { SlashCommandBuilder } from 'discord.js';
import { useQueue } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('filters')
    .setDescription('Áp dụng hiệu ứng âm thanh')
    .addStringOption(option =>
      option
        .setName('filter')
        .setDescription('Chọn hiệu ứng')
        .setRequired(true)
        .addChoices(
          { name: 'Tắt hết', value: 'off' },
          { name: '8D', value: '8D' },
          { name: 'Bass Boost', value: 'bassboost' },
          { name: 'Nightcore', value: 'nightcore' },
          { name: 'Vaporwave', value: 'vaporwave' },
          { name: 'Karaoke', value: 'karaoke' },
          { name: 'Tremolo', value: 'tremolo' },
          { name: 'Vibrato', value: 'vibrato' },
          { name: 'Reverse', value: 'reverse' },
          { name: 'Treble', value: 'treble' }
        )
    ),
  
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({
        content: '❌ Không có nhạc đang phát!',
        ephemeral: true
      });
    }

    await interaction.deferReply();

    const filter = interaction.options.getString('filter');

    try {
      if (filter === 'off') {
        await queue.filters.ffmpeg.setFilters(false);
        return interaction.followUp('🎚️ Đã tắt tất cả hiệu ứng!');
      }

      await queue.filters.ffmpeg.toggle([filter]);
      
      const filterNames = {
        '8D': '8D Audio',
        'bassboost': 'Bass Boost',
        'nightcore': 'Nightcore',
        'vaporwave': 'Vaporwave',
        'karaoke': 'Karaoke',
        'tremolo': 'Tremolo',
        'vibrato': 'Vibrato',
        'reverse': 'Reverse',
        'treble': 'Treble'
      };

      return interaction.followUp(`🎚️ Đã áp dụng hiệu ứng: **${filterNames[filter]}**`);
    } catch (error) {
      console.error('Lỗi khi áp dụng filter:', error);
      return interaction.followUp('❌ Có lỗi xảy ra khi áp dụng hiệu ứng!');
    }
  }
};
