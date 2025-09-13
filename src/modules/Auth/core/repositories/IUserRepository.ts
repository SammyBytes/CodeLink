import { IUserEntity } from "../models/IUserEntity";

export interface IUserRepository {
  create(user: IUserEntity): Promise<IUserEntity>;
  findByEmail(email: string): Promise<IUserEntity | null>;
}
