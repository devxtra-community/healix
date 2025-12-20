import { RefreshToken } from "../models/refreshToken.model.ts";

export class RefreshTokenRepository {
  async create(data: any) {
    return RefreshToken.create(data);
  }

  findValid(token: string) {
    return RefreshToken.findOne({
      token,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    });
  }

  revoke(token: string) {
<<<<<<< Updated upstream
    return RefreshToken.findOneAndUpdate(
      { token },
      { $set: { isRevoked: true } }
    );
  }
=======
    return RefreshToken.findOneAndDelete({ token });
  }         
>>>>>>> Stashed changes
}
