export interface Comment {
  id?: string;
  appId: string;
  movieId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}