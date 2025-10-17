# Architecture - Discord Music Bot với Web Dashboard

## Tổng quan

Ứng dụng bao gồm 2 phần chính:
1. **Discord Bot** - Xử lý commands và phát nhạc
2. **Web Dashboard** - Giao diện web để điều khiển bot

## Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Discord Client    │    Web Browser                          │
│  (Slash Commands)  │    (HTTP + WebSocket)                   │
└────────┬───────────┴──────────────┬─────────────────────────┘
         │                          │
         │                          │
┌────────▼──────────────────────────▼─────────────────────────┐
│                    Application Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Discord.js Bot          │    Express Web Server             │
│  ├─ Command Handler      │    ├─ Routes                      │
│  ├─ Event Handlers       │    ├─ API Endpoints               │
│  └─ Player Integration   │    ├─ Authentication              │
│                          │    └─ Socket.io Server            │
└────────┬─────────────────┴──────────────┬───────────────────┘
         │                                │
         │         ┌─────────────────────┐│
         └────────►│  discord-player     ││
                   │  Music Engine       ││
                   └─────────────────────┘│
                   ┌─────────────────────┐│
                   │  Extractors         ││
                   │  - YouTube          ││
                   │  - Spotify          ││
                   │  - SoundCloud       │◄┘
                   │  - Others           │
                   └─────────────────────┘
                             │
                             ▼
                   ┌─────────────────────┐
                   │  External APIs      │
                   │  - YouTube API      │
                   │  - Spotify API      │
                   │  - Discord Voice    │
                   └─────────────────────┘
```

## Components

### 1. Discord Bot (`src/index.js`)

**Chức năng:**
- Kết nối đến Discord Gateway
- Đăng ký và xử lý slash commands
- Quản lý player events
- Khởi động web server

**Dependencies:**
- `discord.js` - Discord API wrapper
- `discord-player` - Music player framework
- `@discordjs/voice` - Voice connection handling

**Flow:**
```
Bot Start → Load Commands → Connect to Discord → Initialize Player → Start Web Server
```

### 2. Command System (`src/commands/`)

**Structure:**
```javascript
export default {
  data: SlashCommandBuilder,  // Command definition
  execute: async (interaction) => {}  // Command handler
}
```

**Commands:**
- Music control: play, pause, resume, skip, stop
- Queue management: queue, clear, shuffle, remove
- Settings: volume, loop, filters
- Info: nowplaying, lyrics, search

### 3. Web Server (`src/web/server.js`)

**Components:**

#### A. Express Application
- Middleware setup
- Route handling
- Static file serving
- Template rendering (EJS)

#### B. Authentication (Passport.js)
```
User → Discord OAuth2 → Callback → Create Session → Dashboard
```

**Session Storage:**
- In-memory (development)
- Can be extended to Redis/DB (production)

#### C. API Routes
```
/api/queue/:guildId      → Get current queue state
/api/play/:guildId       → Add song to queue
/api/pause/:guildId      → Pause playback
/api/resume/:guildId     → Resume playback
/api/skip/:guildId       → Skip current track
/api/stop/:guildId       → Stop and clear queue
/api/volume/:guildId     → Set volume
```

**Authentication Flow:**
```
Request → checkAuth() → isAuthenticated? → Route Handler
                            │
                            └─ No → Redirect to /login
```

#### D. WebSocket Server (Socket.io)
```
Connection → Subscribe to Guild → Receive Real-time Updates
```

**Events:**
- `trackStart` - New track playing
- `trackAdd` - Track added to queue
- `queueEnd` - Queue finished

### 4. Frontend (`src/web/views/` & `src/web/public/`)

#### Views (EJS Templates)
- `index.ejs` - Landing page
- `login.ejs` - OAuth2 login
- `dashboard.ejs` - Server selection
- `server.ejs` - Music player interface

#### Client-side JavaScript (in server.ejs)
```javascript
// Socket.io connection
const socket = io();
socket.emit('subscribe', guildId);

// API calls
fetch('/api/play/:guildId', {
  method: 'POST',
  body: JSON.stringify({ query })
});

// Event listeners
socket.on('trackStart', updateUI);
```

## Data Flow

### Playing a Song via Web

```
1. User enters song name in web interface
2. Browser sends POST /api/play/:guildId
3. Express validates authentication
4. Express gets voice channel from Discord
5. discord-player searches and plays song
6. Player emits 'playerStart' event
7. Event triggers Socket.io broadcast
8. All connected clients receive update
9. UI updates automatically
```

### Playing a Song via Discord Command

```
1. User types /play in Discord
2. Discord sends interaction to bot
3. Bot validates voice channel
4. discord-player searches and plays song
5. Bot replies to interaction
6. Player emits 'playerStart' event
7. Socket.io broadcasts to web clients
8. Web dashboard updates (if open)
```

## State Management

### Discord Bot State
- Managed by `discord-player`
- One queue per guild
- Persistent during bot runtime
- Lost on restart

### Web Session State
- Managed by `express-session`
- Stores user authentication
- Expires after 7 days
- Stored in memory (can use Redis)

### Real-time Sync
- Discord player events → Socket.io → Web clients
- Ensures web dashboard always shows current state

## Security

### Authentication
```
Discord OAuth2 → Session Cookie → Protected Routes
```

**Checks:**
1. User is authenticated
2. User is member of guild
3. Bot is in the guild

### Authorization
```javascript
function checkAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
```

**Guild Access:**
- User must be in guild
- Bot must be in guild
- Both checked before allowing control

### Session Security
- HTTP-only cookies
- Secure flag in production (HTTPS)
- Random session secret
- CSRF protection (can be added)

## Scalability Considerations

### Current Limitations
- Single instance
- In-memory sessions
- No load balancing

### Scaling Options

#### Horizontal Scaling
```
Bot Instance 1 ─┐
Bot Instance 2 ─┼─→ Redis (Queue State)
Bot Instance 3 ─┘

Web Server 1 ─┐
Web Server 2 ─┼─→ Redis (Sessions) + PostgreSQL
Web Server 3 ─┘
```

#### Components to Add
1. **Redis** - Shared session store
2. **Database** - User preferences, playlists
3. **Load Balancer** - Nginx/HAProxy
4. **Message Queue** - RabbitMQ/Redis Pub/Sub

## Error Handling

### Bot Errors
```javascript
try {
  await player.play(...)
} catch (error) {
  console.error(error);
  interaction.reply('Error message');
}
```

### Web API Errors
```javascript
app.post('/api/play', async (req, res) => {
  try {
    // Logic
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Player Errors
```javascript
player.events.on('playerError', (queue, error) => {
  console.error(error);
  queue.metadata.channel.send('Error!');
});
```

## Monitoring

### Logs
- Console logs for development
- Can add winston/pino for production
- Log rotation recommended

### Metrics (to add)
- Request count
- Response times
- Active users
- Queue lengths
- Error rates

## Deployment

### Development
```bash
npm start
# Bot + Web on http://localhost:3000
```

### Production

#### Option 1: Single Server
```bash
pm2 start src/index.js
# Bot + Web on same process
```

#### Option 2: Docker
```bash
docker-compose up -d
# Isolated environment
```

#### Option 3: Separate Instances
```bash
# Server 1: Bot only
node src/index.js --bot-only

# Server 2: Web only
node src/web/server.js --web-only
```

## Configuration

### Environment Variables
```env
# Discord
DISCORD_TOKEN=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...

# Web
WEB_PORT=3000
CALLBACK_URL=http://localhost:3000/auth/discord/callback
SESSION_SECRET=...
```

### Feature Flags (future)
```javascript
const config = {
  enableWeb: process.env.ENABLE_WEB !== 'false',
  enableMetrics: process.env.ENABLE_METRICS === 'true',
  maxQueueSize: parseInt(process.env.MAX_QUEUE_SIZE) || 100
};
```

## Testing Strategy

### Unit Tests (to add)
- Command handlers
- API endpoints
- Authentication middleware

### Integration Tests (to add)
- Discord commands end-to-end
- Web API end-to-end
- WebSocket events

### Manual Testing
- Test in multiple Discord servers
- Test with different user permissions
- Test concurrent users

## Future Enhancements

### Planned Features
- [ ] User playlists
- [ ] Saved favorites
- [ ] Vote skip system
- [ ] DJ role permissions
- [ ] Advanced filters
- [ ] Music recommendations
- [ ] Usage statistics
- [ ] Multi-language support

### Technical Improvements
- [ ] Redis session store
- [ ] Database integration
- [ ] Caching layer
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] Automated tests
- [ ] CI/CD pipeline
- [ ] Docker optimization

---

This architecture provides a solid foundation for a Discord music bot with web control capabilities while remaining extensible for future enhancements.
