export interface IUserEntity {
  userId: string; // ULID public id
  email: string;
  username: string;
  password?: string; // hashed
  isDisabled: boolean;
  hadExternalAuth: boolean;
  createdAt: Date;
  updatedAt: Date;
}
