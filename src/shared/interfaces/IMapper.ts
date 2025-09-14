/**
 * A generic interface for mapping between domain entities and persistence models.
 * @template Domain - The domain entity type.
 * @template Persistence - The persistence model type.
 */
export interface IMapper<Domain, Persistence> {
  toDomain(raw: Persistence): Domain;
  toPersistence(entity: Domain): Persistence;
}
