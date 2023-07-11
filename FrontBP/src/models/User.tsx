export interface User {
  username: string;
  email: string;
  name: string;
  surname: string;
  birthday: string;
  address: string;
  accountType: string;
  photoUser: Photo | null;
}

export interface Photo {
  id: number;
  url: string;
  isDeleted: boolean;
}
