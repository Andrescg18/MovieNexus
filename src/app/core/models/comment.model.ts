export interface Comment {
  id?: number;
  appId: string;
  itemId: string;
  author: string;
  text: string;
  rating: number;
  createdAt?: string;
}