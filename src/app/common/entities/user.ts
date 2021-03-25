export interface User {
  id: number;
  username: string;
  email: string;
  role: number;
  avatar: string;
}

export enum Role {
  RoleUser,
  RoleAdmin
}
