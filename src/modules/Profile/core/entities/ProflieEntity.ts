import { IProfileEntity } from "../models/IProfileEntity";

export class ProfileEntity implements IProfileEntity {
  profileId!: number;
  userId!: string;
  name!: string;
  lastName!: string;
  country?: string | undefined;
  city?: string | undefined;
  bio?: string | undefined;
  avatar?: string | undefined;
  languages!: string[];
  frameworks!: string[];
  tools!: string[];
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(props: IProfileEntity) {
    Object.assign(this, props);
  }
  static createNew(
    props: Omit<IProfileEntity, "profileId" | "createdAt" | "updatedAt">
  ): ProfileEntity {
    if (!props.userId) throw new Error("userId is required");
    if (!props.name) throw new Error("name is required");
    if (!props.lastName) throw new Error("lastName is required");
    if (props.languages.length === 0)
      throw new Error("At least one language is required");
    if (props.frameworks.length === 0)
      throw new Error("At least one framework is required");
    if (props.tools.length === 0)
      throw new Error("At least one tool is required");

    return new ProfileEntity({
      profileId: 0, // Will be set by the database
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
