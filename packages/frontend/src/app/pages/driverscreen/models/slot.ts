export interface Slot {
  position: number;
  driver: {
    name: string;
  };
  lap: number;
  remainingLaps: number;
  lapTime: {
    Best: number;
    Diff: number;
    Last: number;
  };
  penalties: {
    status: string;
    type: string;
  }[];
  boxStops: number;
  fuel: number;
  isRefueling: boolean;
  distanceToLeader: DistanceToPlayer
  distanceToNext: DistanceToPlayer;
  sectorStats: {
    time: SectorStat;
    speed: SectorStat;
  }[];
}

interface DistanceToPlayer {
  lap: number;
  time: number;
}

interface SectorStat {
  current: number;
  record: number;
}
