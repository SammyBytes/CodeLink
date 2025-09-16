import { IProfileEntity } from "../models/IProfileEntity";

export interface IProfileQueryRepository {
  findAllTech(
    filters?: {
      languages?: string[];
      tools?: string[];
      frameworks?: string[];
    },
    pagination?: { page: number; limit: number }
  ): Promise<IProfileEntity[]>;
}
