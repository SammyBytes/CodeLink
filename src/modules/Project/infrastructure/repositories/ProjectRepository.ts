import { ProjectEntity } from "@modules/Project/core/entities/ProjectEntity";
import { IProjectRepository } from "@modules/Project/core/repositories/IProjectRepository";
import { PrismaClient } from "generated/prisma";
import { inject, injectable } from "tsyringe";
import { projectMapper, projectMapperEnum } from "../mappers/ProjectMapper";

@injectable()
export class ProjectRepository implements IProjectRepository {
  constructor(@inject(PrismaClient) private prisma: PrismaClient) {}

  async upsert(project: ProjectEntity): Promise<ProjectEntity> {
    await this.prisma.project.upsert({
      where: { projectId: project.projectId },
      update: {
        title: project.title,
        description: project.description,
        link: project.link,
        repo: project.repo,
        tags: project.tags,
        status: projectMapperEnum.toPersistenceEnum(project.status),
        updatedAt: new Date(),
      },
      create: {
        projectId: project.projectId,
        profileId: project.profileId,
        title: project.title,
        description: project.description,
        link: project.link,
        repo: project.repo,
        tags: project.tags,
      },
    });

    return project;
  }

  async delete(projectId: string): Promise<void> {
    await this.prisma.project.delete({
      where: { projectId },
    });
  }
}
