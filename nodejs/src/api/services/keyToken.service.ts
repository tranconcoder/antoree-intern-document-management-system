import { errorResponses } from "@/constants/error.constant";
import ErrorResponse from "@/core/error.core";
import keyTokenModel from "@/models/keyToken.model";

export default class KeyTokenService {
  /**
   * Tạo mới hoặc cập nhật key token cho user
   * @param userId - ID của user
   * @param publicKey - public key của user
   * @param jti - JWT ID
   */
  public static async createKeyToken(
    userId: string,
    publicKey: string,
    jti: string
  ) {
    return await keyTokenModel.findOneAndUpdate(
      { userId },
      { publicKey, jti },
      { new: true, upsert: true }
    );
  }

  /**
   * Tìm key token theo userId và jti
   * @param userId - ID của user
   * @param jti - JWT ID
   */
  public static async findKeyToken(userId: string, jti: string) {
    const keyToken = await keyTokenModel.findOne({ userId, jti });
    console.log(keyToken);

    if (!keyToken)
      throw new ErrorResponse({
        errorResponseItem: errorResponses.AUTH_KEY_TOKEN_NOT_FOUND,
      });

    return keyToken;
  }
}
