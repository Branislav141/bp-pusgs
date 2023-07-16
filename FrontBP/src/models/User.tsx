export interface User {
  id: string;
  userName: string;
  email: string;
  name: string;
  surname: string;
  birthday: string;
  address: string;
  accountType: string;
  accountStatus: string;
  photoUser: Photo | null;
}

export interface Photo {
  id: number;
  url: string;
  isDeleted: boolean;
}
