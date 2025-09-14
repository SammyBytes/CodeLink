export interface IProfileEntity {
  profileId: number;
  userId: string;
  name: string;
  lastName: string;
  country?: string;
  city?: string;
  bio?: string;
  avatar?: string;
  languages: string[];
  frameworks: string[];
  tools: string[];
  createdAt: Date;
  updatedAt: Date;
}
