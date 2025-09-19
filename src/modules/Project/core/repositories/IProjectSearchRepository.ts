export interface IProjectSearchRepository {
  findByProjectId(projectId: string): Promise<boolean>;
  findByProfileId(profileId: string): Promise<boolean>;
  findAllTags(
    filter: { tags: string[] },
    pagination: { page: number; limit: number }
  ): Promise<string[]>;
}
