export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface CreditsResponse {
  id: number;
  cast: Cast[];
}
