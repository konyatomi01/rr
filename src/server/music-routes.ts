import { Request, Response, Router } from 'express';
import {
  DeezerError,
  getChartPlaylists,
  getPlaylistTracks,
  isDeezerId,
  NO_DATA_CODE,
  searchPlaylists,
  searchTracks,
} from './deezer';

/** REST endpoints the client uses to browse and search music. Mounted at `/api/music`. */
export const musicRouter = Router();

const MAX_QUERY_LENGTH = 100;
const MAX_CHART_PAGE = 5; // Deezer's chart has 100 playlists = 5 pages of 20

class BadRequest extends Error {}

function handle(load: (req: Request) => Promise<unknown>) {
  return async (req: Request, res: Response) => {
    try {
      res.json(await load(req));
    } catch (e) {
      if (e instanceof BadRequest) {
        res.status(400).json({ error: e.message });
        return;
      }
      if (e instanceof DeezerError && e.code === NO_DATA_CODE) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      console.error('Music API request failed:', req.originalUrl, e);
      res.status(502).json({ error: 'Music service unavailable' });
    }
  };
}

function queryParam(req: Request): string {
  const q = req.query['q'];
  if (typeof q !== 'string' || !q.trim()) throw new BadRequest('Missing search term');
  return q.trim().slice(0, MAX_QUERY_LENGTH);
}

function pageParam(req: Request): number {
  const page = Number(req.query['page'] ?? 1);
  if (!Number.isInteger(page) || page < 1 || page > MAX_CHART_PAGE) throw new BadRequest('Invalid page');
  return page;
}

musicRouter.get('/charts', handle(req => getChartPlaylists(pageParam(req))));
musicRouter.get('/playlists/search', handle(req => searchPlaylists(queryParam(req))));
musicRouter.get('/tracks/search', handle(req => searchTracks(queryParam(req))));
musicRouter.get(
  '/playlists/:id/tracks',
  handle(async req => {
    const id = req.params['id'];
    if (!isDeezerId(id)) throw new BadRequest('Invalid playlist id');
    return getPlaylistTracks(id);
  }),
);
