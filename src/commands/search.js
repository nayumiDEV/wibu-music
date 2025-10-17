import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import { useMainPlayer, QueryType } from 'discord-player';

export default {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Tìm kiếm và chọn bài hát')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Tên bài hát để tìm kiếm')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('source')
        .setDescription('Nguồn tìm kiếm')
        .addChoices(
          { name: 'YouTube', value: 'youtube' },
          { name: 'Spotify', value: 'spotify' },
          { name: 'SoundCloud', value: 'soundcloud' }
        )
    ),
  
  async execute(interaction) {
    const player = useMainPlayer();
    const query = interaction.options.getString('query');
    const source = interaction.options.getString('source') || 'youtube';
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.reply({
        content: '❌ Bạn cần vào một voice channel trước!',
        ephemeral: true
      });
    }

    await interaction.deferReply();

    try {
      const searchResult = await player.search(query, {
        searchEngine: source === 'youtube' ? QueryType.YOUTUBE_SEARCH :
                     source === 'spotify' ? QueryType.SPOTIFY_SEARCH :
                     QueryType.SOUNDCLOUD_SEARCH
      });

      if (!searchResult || !searchResult.tracks.length) {
        return interaction.followUp('❌ Không tìm thấy kết quả nào!');
      }

      const tracks = searchResult.tracks.slice(0, 5);

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`🔍 Kết quả tìm kiếm: ${query}`)
        .setDescription(
          tracks.map((track, i) => 
            `**${i + 1}.** ${track.title}\n└ ${track.author} - \`${track.duration}\``
          ).join('\n\n')
        );

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('search-select')
        .setPlaceholder('Chọn một bài hát')
        .addOptions(
          tracks.map((track, i) => ({
            label: track.title.substring(0, 100),
            description: `${track.author} - ${track.duration}`.substring(0, 100),
            value: i.toString()
          }))
        );

      const row = new ActionRowBuilder().addComponents(selectMenu);

      const response = await interaction.followUp({
        embeds: [embed],
        components: [row]
      });

      const collector = response.createMessageComponentCollector({
        time: 60000
      });

      collector.on('collect', async (i) => {
        if (i.user.id !== interaction.user.id) {
          return i.reply({ content: '❌ Chỉ người tìm kiếm mới có thể chọn!', ephemeral: true });
        }

        const selectedTrack = tracks[parseInt(i.values[0])];
        
        await i.deferUpdate();

        try {
          await player.play(channel, selectedTrack.url, {
            nodeOptions: {
              metadata: {
                channel: interaction.channel,
                client: interaction.guild.members.me,
                requestedBy: interaction.user
              },
              volume: 50,
              leaveOnEnd: true,
              leaveOnStop: true,
              leaveOnEmpty: true,
              leaveOnEmptyCooldown: 300000,
              selfDeaf: true
            }
          });

          await interaction.editReply({
            content: `✅ Đã thêm **${selectedTrack.title}** vào hàng đợi!`,
            embeds: [],
            components: []
          });
        } catch (error) {
          console.error('Lỗi khi phát nhạc:', error);
          await interaction.editReply({
            content: '❌ Có lỗi xảy ra khi phát nhạc!',
            embeds: [],
            components: []
          });
        }

        collector.stop();
      });

      collector.on('end', (collected) => {
        if (collected.size === 0) {
          interaction.editReply({
            content: '⏱️ Hết thời gian chọn!',
            embeds: [],
            components: []
          });
        }
      });
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error);
      return interaction.followUp('❌ Có lỗi xảy ra khi tìm kiếm!');
    }
  }
};
