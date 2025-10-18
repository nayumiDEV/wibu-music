export default {
  player: {
    volume: 50,
    quality: 'highestaudio',
    leaveOnEnd: true,
    leaveOnStop: true,
    leaveOnEmpty: true,
    leaveOnEmptyCooldown: 300000,
    selfDeaf: true
  },
  
  messages: {
    errorNoVoiceChannel: '❌ Bạn cần vào một voice channel trước!',
    errorNotPlaying: '❌ Không có nhạc đang phát!',
    errorQueueEmpty: '❌ Hàng đợi trống!',
    errorGeneric: '❌ Có lỗi xảy ra!',
    
    successPause: '⏸️ Đã tạm dừng nhạc!',
    successResume: '▶️ Đã tiếp tục phát nhạc!',
    successSkip: '⏭️ Đã bỏ qua',
    successStop: '⏹️ Đã dừng phát nhạc và xóa hàng đợi!',
    successShuffle: '🔀 Đã xáo trộn hàng đợi!',
    successClear: '🗑️ Đã xóa toàn bộ hàng đợi!',
    
    queueEnd: '✅ Hàng đợi đã kết thúc!',
    leftChannel: '👋 Đã rời voice channel vì không có ai!'
  },
  
  colors: {
    primary: '#0099ff',
    success: '#00ff00',
    error: '#ff0000',
    warning: '#ffaa00'
  },
  
  limits: {
    queueDisplay: 10,
    searchResults: 5,
    selectMenuTimeout: 60000,
    lyricsLength: 4096
  }
};
