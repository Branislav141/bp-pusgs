import { Article } from "./Article";

export interface Order {
  id: number;
  articles: Article[];
  totalPrice: number;
  comment: string;
  orderDate: string;
  deliveryDate?: string | null;
  deliveryAddress: string;
}
