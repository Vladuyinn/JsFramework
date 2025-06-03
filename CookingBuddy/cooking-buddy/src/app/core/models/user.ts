export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
}

export interface ReadOnlyUser extends Omit<User, 'password'> {}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
