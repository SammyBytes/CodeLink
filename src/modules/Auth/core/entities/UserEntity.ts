import { IUserEntity } from "../models/IUserEntity";

export class UserEntity implements IUserEntity {
  userId!: string;
  email!: string;
  username!: string;
  password?: string | undefined;
  isDisabled!: boolean;
  hadExternalAuth!: boolean;
  createdAt!: Date;
  updatedAt!: Date;

  private constructor(props: IUserEntity) {
    Object.assign(this, props);
  }

  static createNew(
    userId: string,
    email: string,
    username: string,
    password: string
  ): UserEntity {
    if (!userId) throw new Error("userId is required");
    if (!email.includes("@")) throw new Error("Invalid email");
    if (username.length < 3) throw new Error("Username too short");

    return new UserEntity({
      userId: userId,
      email,
      username,
      password,
      isDisabled: false,
      hadExternalAuth: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
