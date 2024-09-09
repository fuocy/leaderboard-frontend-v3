export interface Metric {
  name: string;
  type: "number" | "text";
}

export interface Sorting {
  metric: string;
  order: "asc" | "desc";
}

export interface Leaderboard {
  _id: string;
  game: string;
  name: string;
  metrics: Metric[];
  sorting: Sorting | null;
}
export type PlayerState = {
  [metricName: string]: number | string;
};

export type LeaderboardData = {
  game: string;
  username: string;
  metrics: PlayerState;
};
