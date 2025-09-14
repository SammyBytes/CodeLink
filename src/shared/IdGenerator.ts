import { monotonicFactory } from "ulid";

const monotonicUlid = monotonicFactory();

export const IdGenerator = {
  newId: () => monotonicUlid(),
};
