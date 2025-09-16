import { IProfileEntity } from "@modules/Profile/core/models/IProfileEntity";
import { IProfileQueryRepository } from "@modules/Profile/core/repositories/IProfileQueryRepository";
import { PrismaClient } from "generated/prisma";
import { inject, injectable } from "tsyringe";
import { profileMapper } from "../mappers/ProfileMapper";
import { SHARED_TOKENS } from "@shared/di/SharedTokens";
import type { Client } from "@libsql/client";

@injectable()
export class ProfileQueryRepository implements IProfileQueryRepository {
  constructor(
    @inject(SHARED_TOKENS.TursoClient) private readonly turso: Client
  ) {}

  async findAllTech(
    filters?: {
      languages?: string[];
      tools?: string[];
      frameworks?: string[];
    },
    pagination?: { page: number; limit: number }
  ): Promise<IProfileEntity[]> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const offset = (page - 1) * limit;

    const clauses: string[] = ["1=1"];
    const args: any[] = [];

    if (filters?.languages?.length) {
      filters.languages.forEach((lang) => {
        clauses.push(`
      EXISTS (
        SELECT 1
        FROM json_each(profile.languages)
        WHERE json_each.value = ?
      )
    `);
        args.push(lang);
      });
    }

    if (filters?.tools?.length) {
      filters.tools.forEach((tool) => {
        clauses.push(`
      EXISTS (
        SELECT 1
        FROM json_each(profile.tools)
        WHERE json_each.value = ?
      )
    `);
        args.push(tool);
      });
    }

    if (filters?.frameworks?.length) {
      filters.frameworks.forEach((fw) => {
        clauses.push(`
      EXISTS (
        SELECT 1
        FROM json_each(profile.frameworks)
        WHERE json_each.value = ?
      )
    `);
        args.push(fw);
      });
    }

    const whereClause = clauses.join(" AND ");
    args.push(limit, offset);

    const profiles = await this.turso.execute({
      sql: `
            SELECT *
            FROM profile
            WHERE ${whereClause}
            LIMIT ? OFFSET ?;
  `,
      args,
    });

    const result = profiles.rows as unknown as IProfileEntity[];
    return result;
  }
}
