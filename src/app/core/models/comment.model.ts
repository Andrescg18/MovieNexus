export interface Comment {
  id?: number | string;
  appId: string;
  itemId: string;
  author: string;
  rating: number;
  text: string;
  createdAt?: string;
}