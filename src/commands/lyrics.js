import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { useQueue } from 'discord-player';
import { lyricsExtractor } from '@discord-player/extractor';

const lyricsClient = lyricsExtractor();

export default {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('Hiển thị lời bài hát đang phát')
    .addStringOption(option =>
      option
        .setName('song')
        .setDescription('Tên bài hát (để trống để lấy bài đang phát)')
    ),
  
  async execute(interaction) {
    await interaction.deferReply();

    try {
      let songName;
      const customSong = interaction.options.getString('song');

      if (customSong) {
        songName = customSong;
      } else {
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.currentTrack) {
          return interaction.followUp({
            content: '❌ Không có nhạc đang phát! Vui lòng chỉ định tên bài hát.',
            ephemeral: true
          });
        }
        songName = `${queue.currentTrack.title} ${queue.currentTrack.author}`;
      }

      const lyrics = await lyricsClient.search(songName);

      if (!lyrics) {
        return interaction.followUp('❌ Không tìm thấy lời bài hát!');
      }

      const trimmedLyrics = lyrics.lyrics.substring(0, 4096);

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(lyrics.title)
        .setURL(lyrics.url)
        .setThumbnail(lyrics.thumbnail)
        .setDescription(trimmedLyrics)
        .setFooter({ text: `Nghệ sĩ: ${lyrics.artist.name}` });

      return interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error('Lỗi khi lấy lời bài hát:', error);
      return interaction.followUp('❌ Có lỗi xảy ra khi lấy lời bài hát!');
    }
  }
};
