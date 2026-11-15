import { PlayerData } from '../shared/models';

export interface RankedPlayer {
  player: PlayerData;
  /** 1-based; players tied on survival and points share a rank (1, 1, 3). */
  rank: number;
}

const compare = (a: PlayerData, b: PlayerData) =>
  Number(b.lives > 0) - Number(a.lives > 0) || b.points - a.points;

/** Battle royale order: survivors first, then by points. */
export function rankPlayers(players: readonly PlayerData[]): RankedPlayer[] {
  const sorted = [...players].sort(compare);
  return sorted.map((player, index) => {
    let first = index;
    while (first > 0 && compare(sorted[first - 1], player) === 0) first--;
    return { player, rank: first + 1 };
  });
}
