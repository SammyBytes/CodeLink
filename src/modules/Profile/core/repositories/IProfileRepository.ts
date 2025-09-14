import { IProfileEntity } from "../models/IProfileEntity";

export interface IProfileRepository {
  create(profile: IProfileEntity): Promise<IProfileEntity>;
  findByUserId(userId: string): Promise<IProfileEntity | null>;
  update(profile: IProfileEntity): Promise<IProfileEntity>;
}
