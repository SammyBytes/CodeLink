import { StatusProject } from "../common/StatusProject";

export interface IProjectModel {
  id: number;
  projectId: string;
  profileId: string;
  title: string;
  description: string;
  status: StatusProject;
  link?: string;
  repo?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
