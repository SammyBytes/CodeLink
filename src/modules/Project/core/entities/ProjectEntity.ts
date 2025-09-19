import { StatusProject } from "../common/StatusProject";
import { IProjectModel } from "../models/IProjectModel";

export class ProjectEntity implements IProjectModel {
  id!: number;
  projectId!: string;
  profileId!: string;
  title!: string;
  description!: string;
  link?: string;
  repo?: string;
  tags!: string[];
  status!: StatusProject;
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(props: IProjectModel) {
    Object.assign(this, props);
  }

  static createNew(
    props: Omit<IProjectModel, "id" | "createdAt" | "updatedAt">
  ) {
    if (!props.profileId) throw new Error("profileId is required");
    if (!props.title) throw new Error("title is required");
    if (!props.description) throw new Error("description is required");
    if (!props.tags || props.tags.length === 0)
      throw new Error("At least one tag is required");

    return new ProjectEntity({
      ...props,
      id: 0, // DB lo asigna
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
