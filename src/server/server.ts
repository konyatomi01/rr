import 'dotenv/config';
import path from 'node:path';
import { createGameServer } from './app';
import { getPlaylistTracks, getTrack } from './deezer';

const PORT = Number(process.env['PORT']) || 3000;

const { httpServer, io } = createGameServer({
  source: { getPlaylistTracks, getTrack },
  publicDir: path.join(__dirname, '../../dist/rhythm-royale/browser'),
});

process.on('unhandledRejection', reason => console.error('Unhandled rejection:', reason));

process.on('SIGTERM', () => {
  io.emit('notice', 'The server is restarting, reconnecting in a moment…');
  io.close();
  httpServer.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
});

httpServer.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
