export interface ILink {
  source?: string | null;
  type?: string | null;
  url?: string | null;
}

export interface IGame {
  sport: string;
  gameID: number;
  date: number;
  points: number;
  leagueCode?: string | null;
  team1ID?: number | null;
  team1City?: string | null;
  team1Name?: string | null;
  team1Ranking?: number | null;
  team1Score?: number | null;
  team1Color?: string | null;
  team2ID?: number | null;
  team2City?: string | null;
  team2Name?: string | null;
  team2Ranking?: number | null;
  team2Score?: number | null;
  team2Color?: string | null;
  location?: string | null;
  headline?: string | null;
  links?: ILink[] | null;
  coverImage?: string | null;
  timeLeft?: string;
  programIDs?: string[] | null;
  pointsLevel?: string | null;
  highPoints?: number | null;
  isFeatured?: boolean | null;
  team1Nickname?: string | null;
  team2Nickname?: string | null;
  team1DisplayName?: string | null;
  team2DisplayName?: string | null;
}
