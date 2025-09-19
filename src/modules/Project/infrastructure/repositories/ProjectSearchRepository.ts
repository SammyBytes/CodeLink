import { turso } from "@configs/databases/sources/TursoConfig";
import { Client } from "@libsql/client/.";
import { IProjectSearchRepository } from "@modules/Project/core/repositories/IProjectSearchRepository";
import { SHARED_TOKENS } from "@shared/di/SharedTokens";
import { PrismaClient } from "generated/prisma";
import { inject } from "tsyringe";

export class ProjectSearchRepository implements IProjectSearchRepository {
  private constructor(
    @inject(PrismaClient) private prisma: PrismaClient,
    @inject(SHARED_TOKENS.TursoClient) private tursoClient: Client
  ) {}

  async findByProjectId(projectId: string): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: { projectId },
    });
    return !!project;
  }
  async findByProfileId(profileId: string): Promise<boolean> {
    const project = await this.prisma.project.findFirst({
      where: { profileId },
    });
    return !!project;
  }
  async findAllTags(
    filter: { tags: string[] },
    pagination: { page: number; limit: number }
  ): Promise<string[]> {
    const page = pagination?.page ?? 1;
    const limit = pagination?.limit ?? 10;
    const offset = (page - 1) * limit;

    const args: any[] = [];

    let whereClause = "1=1";
    if (filter.tags && filter.tags.length > 0) {
      const tagPlaceholders = filter.tags.map(() => "?").join(", ");
      whereClause = `WHERE json_each.value IN (${tagPlaceholders})`;
    }

    const query = `
    SELECT DISTINCT json_each.value as tag
    FROM project, json_each(project.tags)
    ${whereClause}
    LIMIT ? OFFSET ?
  `;

    args.push(limit, offset);

    const result = await this.tursoClient.execute(query, args);
    return result.rows.map((row) => (row.tag as string).toString());
  }
}
