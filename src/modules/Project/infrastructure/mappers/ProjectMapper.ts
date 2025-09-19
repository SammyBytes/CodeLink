import { StatusProject } from "@modules/Project/core/common/StatusProject";
import { IProjectModel } from "@modules/Project/core/models/IProjectModel";
import { IMapper, IMapperEnum } from "@shared/interfaces/IMapper";
import { Project as PrismaProject } from "generated/prisma";
import { StatusProject as PrismaStatusProject } from "generated/prisma";

export const projectMapper: IMapper<IProjectModel, PrismaProject> = {
  toDomain: (prismaProject: PrismaProject): IProjectModel => ({
    id: prismaProject.id,
    projectId: prismaProject.id.toString(),
    profileId: prismaProject.profileId,
    title: prismaProject.title,
    description: prismaProject.description,
    link: prismaProject.link ?? undefined,
    repo: prismaProject.repo ?? undefined,
    tags: Array.isArray(prismaProject.tags)
      ? prismaProject.tags.map(String)
      : [],
    status: projectMapperEnum.toDomainEnum(prismaProject.status),
    createdAt: prismaProject.createdAt,
    updatedAt: prismaProject.updatedAt,
  }),
  toPersistence: (project: IProjectModel): PrismaProject => ({
    id: project.id,
    projectId: project.projectId,
    profileId: project.profileId,
    title: project.title,
    description: project.description,
    link: project.link ?? null,
    repo: project.repo ?? null,
    tags: project.tags,
    status: projectMapperEnum.toPersistenceEnum(project.status),
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }),
};

export const projectMapperEnum: IMapperEnum<
  StatusProject,
  PrismaStatusProject
> = {
  toDomainEnum: (raw: PrismaStatusProject): StatusProject => {
    switch (raw) {
      case PrismaStatusProject.ACTIVE:
        return StatusProject.ACTIVE;
      case PrismaStatusProject.ARCHIVED:
        return StatusProject.ARCHIVED;
      case PrismaStatusProject.INACTIVE:
        return StatusProject.INACTIVE;
      default:
        throw new Error(`Unknown StatusProject enum value: ${raw}`);
    }
  },
  toPersistenceEnum: (entity: StatusProject): PrismaStatusProject => {
    switch (entity) {
      case StatusProject.ACTIVE:
        return PrismaStatusProject.ACTIVE;
      case StatusProject.ARCHIVED:
        return PrismaStatusProject.ARCHIVED;
      case StatusProject.INACTIVE:
        return PrismaStatusProject.INACTIVE;
      default:
        throw new Error(`Unknown StatusProject enum value: ${entity}`);
    }
  },
};
