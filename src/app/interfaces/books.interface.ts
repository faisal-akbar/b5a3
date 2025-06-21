import { Model } from "mongoose";


export interface IBooks {
    title: string;  
    author: string;
    genre: "FICTION" | "NON_FICTION" | "SCIENCE" | "HISTORY" | "BIOGRAPHY" | "FANTASY";
    isbn: string;
    description: string;
    copies: number;
    available: boolean;
}

export interface IReqQuery {
  filter?: string | undefined;
  sortBy?: string | undefined;
  sort?: "asc" | "desc";
  limit?: number;
}

export interface IBookStaticMethod extends Model<IBooks> {
  updateAvailableStatus(book: IBooks): void
}