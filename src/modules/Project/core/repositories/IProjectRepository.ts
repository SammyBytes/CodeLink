import { ProjectEntity } from "../entities/ProjectEntity";

export interface IProjectRepository {
  upsert(project: ProjectEntity): Promise<ProjectEntity>;
  findByProfileId(profileId: string): Promise<ProjectEntity | null>;
  deleteByProfileId(profileId: string): Promise<void>;
}
