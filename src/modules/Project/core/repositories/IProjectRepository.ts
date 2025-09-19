import { ProjectEntity } from "../entities/ProjectEntity";

export interface IProjectRepository {
  upsert(project: ProjectEntity): Promise<ProjectEntity>;
  delete(projectId: string): Promise<void>;
}
