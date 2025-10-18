import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createWebServer(client, player) {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer);

  app.set('view engine', 'ejs');
  app.set('views', join(__dirname, 'views'));
  app.use(express.static(join(__dirname, 'public')));
  app.use(express.json());

  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
  }));

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    scope: ['identify', 'guilds']
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  function checkAuth(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
  }

  app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect('/dashboard');
    }
    res.render('index');
  });

  app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect('/dashboard');
    }
    res.render('login');
  });

  app.get('/auth/discord', passport.authenticate('discord'));

  app.get('/auth/discord/callback',
    passport.authenticate('discord', { failureRedirect: '/login' }),
    (req, res) => res.redirect('/dashboard')
  );

  app.get('/dashboard', checkAuth, (req, res) => {
    const userGuilds = req.user.guilds || [];
    const botGuilds = client.guilds.cache.map(g => ({
      id: g.id,
      name: g.name,
      icon: g.iconURL()
    }));

    const mutualGuilds = userGuilds.filter(ug => 
      botGuilds.some(bg => bg.id === ug.id)
    ).map(ug => {
      const botGuild = botGuilds.find(bg => bg.id === ug.id);
      return {
        ...ug,
        icon: botGuild.icon
      };
    });

    res.render('dashboard', {
      user: req.user,
      guilds: mutualGuilds
    });
  });

  app.get('/server/:guildId', checkAuth, (req, res) => {
    const { guildId } = req.params;
    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
      return res.status(404).send('Server not found');
    }

    const userGuilds = req.user.guilds || [];
    if (!userGuilds.some(g => g.id === guildId)) {
      return res.status(403).send('Access denied');
    }

    res.render('server', {
      user: req.user,
      guild: {
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL()
      }
    });
  });

  app.get('/api/queue/:guildId', checkAuth, async (req, res) => {
    const { useQueue } = await import('discord-player');
    const queue = useQueue(req.params.guildId);

    if (!queue) {
      return res.json({ playing: false });
    }

    res.json({
      playing: queue.isPlaying(),
      paused: queue.node.isPaused(),
      current: queue.currentTrack ? {
        title: queue.currentTrack.title,
        author: queue.currentTrack.author,
        duration: queue.currentTrack.duration,
        thumbnail: queue.currentTrack.thumbnail,
        url: queue.currentTrack.url
      } : null,
      queue: queue.tracks.toArray().map(t => ({
        title: t.title,
        author: t.author,
        duration: t.duration,
        thumbnail: t.thumbnail
      })),
      volume: queue.node.volume,
      repeatMode: queue.repeatMode
    });
  });

  app.post('/api/play/:guildId', checkAuth, async (req, res) => {
    const { guildId } = req.params;
    const { query } = req.body;
    const guild = client.guilds.cache.get(guildId);

    if (!guild) {
      return res.status(404).json({ error: 'Server not found' });
    }

    const member = await guild.members.fetch(req.user.id).catch(() => null);
    if (!member || !member.voice.channel) {
      return res.status(400).json({ error: 'You need to be in a voice channel' });
    }

    try {
      const { useMainPlayer } = await import('discord-player');
      const mainPlayer = useMainPlayer();
      
      await mainPlayer.play(member.voice.channel, query, {
        nodeOptions: {
          metadata: {
            channel: guild.channels.cache.find(c => c.type === 0),
            requestedBy: member.user,
            voiceChannel: member.voice.channel
          }
        }
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/pause/:guildId', checkAuth, async (req, res) => {
    const { useQueue } = await import('discord-player');
    const queue = useQueue(req.params.guildId);

    if (!queue) {
      return res.status(404).json({ error: 'No queue found' });
    }

    queue.node.setPaused(true);
    res.json({ success: true });
  });

  app.post('/api/resume/:guildId', checkAuth, async (req, res) => {
    const { useQueue } = await import('discord-player');
    const queue = useQueue(req.params.guildId);

    if (!queue) {
      return res.status(404).json({ error: 'No queue found' });
    }

    queue.node.setPaused(false);
    res.json({ success: true });
  });

  app.post('/api/skip/:guildId', checkAuth, async (req, res) => {
    const { useQueue } = await import('discord-player');
    const queue = useQueue(req.params.guildId);

    if (!queue) {
      return res.status(404).json({ error: 'No queue found' });
    }

    queue.node.skip();
    res.json({ success: true });
  });

  app.post('/api/stop/:guildId', checkAuth, async (req, res) => {
    const { useQueue } = await import('discord-player');
    const queue = useQueue(req.params.guildId);

    if (!queue) {
      return res.status(404).json({ error: 'No queue found' });
    }

    queue.delete();
    res.json({ success: true });
  });

  app.post('/api/volume/:guildId', checkAuth, async (req, res) => {
    const { useQueue } = await import('discord-player');
    const queue = useQueue(req.params.guildId);
    const { volume } = req.body;

    if (!queue) {
      return res.status(404).json({ error: 'No queue found' });
    }

    queue.node.setVolume(volume);
    res.json({ success: true });
  });

  app.get('/logout', (req, res) => {
    req.logout(() => {
      res.redirect('/');
    });
  });

  io.on('connection', (socket) => {
    console.log('Client connected to WebSocket');

    socket.on('subscribe', (guildId) => {
      socket.join(`guild:${guildId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from WebSocket');
    });
  });

  player.events.on('playerStart', (queue, track) => {
    io.to(`guild:${queue.guild.id}`).emit('trackStart', {
      title: track.title,
      author: track.author,
      duration: track.duration,
      thumbnail: track.thumbnail
    });
  });

  player.events.on('audioTrackAdd', (queue, track) => {
    io.to(`guild:${queue.guild.id}`).emit('trackAdd', {
      title: track.title,
      author: track.author
    });
  });

  player.events.on('emptyQueue', (queue) => {
    io.to(`guild:${queue.guild.id}`).emit('queueEnd');
  });

  const PORT = process.env.WEB_PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`🌐 Web dashboard running on http://localhost:${PORT}`);
  });

  return { app, io, httpServer };
}
