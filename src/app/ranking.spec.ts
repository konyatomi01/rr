import { PlayerData } from '../shared/models';
import { rankPlayers } from './ranking';

const player = (name: string, lives: number, points: number) => ({ id: name, name, lives, points }) as PlayerData;

describe('rankPlayers', () => {
  it('puts survivors first, then sorts by points', () => {
    const ranked = rankPlayers([player('dead', 0, 900), player('alive', 1, 100), player('best', 2, 500)]);
    expect(ranked.map(r => r.player.name)).toEqual(['best', 'alive', 'dead']);
    expect(ranked.map(r => r.rank)).toEqual([1, 2, 3]);
  });

  it('gives tied players the same rank', () => {
    const ranked = rankPlayers([player('a', 1, 300), player('b', 1, 300), player('c', 1, 100)]);
    expect(ranked.map(r => r.rank)).toEqual([1, 1, 3]);
  });
});
