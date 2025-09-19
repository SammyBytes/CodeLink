export interface IProjectModel {
  id: number;
  profileId: string;
  title: string;
  description: string;
  link?: string;
  repo?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
