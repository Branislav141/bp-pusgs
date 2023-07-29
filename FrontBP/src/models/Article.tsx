export interface Article {
  id: number;
  name: string;
  price: string;
  quantity: string;
  description: string;
  UserCreated: string;
  aPhoto: ArticlePhoto | null;
}

export interface ArticlePhoto {
  id: number;
  url: string;
  isDeleted: boolean;
}
