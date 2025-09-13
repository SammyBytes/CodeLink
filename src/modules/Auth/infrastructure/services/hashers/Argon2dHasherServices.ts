import type { IPasswordHasherServices } from "@modules/Auth/application/services/IPasswordHasherServices";
import { hash as argon2dHash, verify as argon2dVerify } from "argon2";
import { injectable } from "tsyringe";

@injectable()
export class Argon2dHasherServices implements IPasswordHasherServices {
  private readonly memoryCost = 2 ** 16; // 64 MB
  private readonly timeCost = 3; // Number of iterations

  async hash(password: string): Promise<string> {
    return argon2dHash(password, {
      memoryCost: this.memoryCost,
      timeCost: this.timeCost,
    });
  }
  async compare(password: string, hashed: string): Promise<boolean> {
    return argon2dVerify(hashed, password);
  }
}
