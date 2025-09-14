import { IProfileEntity } from "@modules/Profile/core/models/IProfileEntity";

export class RetrieveProfileResponseDto {
  private constructor(
    public name: string,
    public lastName: string,
    public country: string,
    public city: string,
    public bio: string,
    public avatar: string,
    public languages: string[],
    public frameworks: string[],
    public tools: string[],
    public createdAt: Date
  ) {}

  static fromDomain(profile: IProfileEntity): RetrieveProfileResponseDto {
    return new RetrieveProfileResponseDto(
      profile.name,
      profile.lastName,
      profile.country || "",
      profile.city || "",
      profile.bio || "",
      profile.avatar || "",
      profile.languages || [],
      profile.frameworks || [],
      profile.tools || [],
      profile.createdAt
    );
  }
}
