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
   * Cập nhật key token với việc verify old jti trước khi update
   * @param userId - ID của user
   * @param oldJti - JWT ID cũ để verify
   * @param publicKey - public key mới
   * @param newJti - JWT ID mới
   */
  public static async updateKeyToken(
    userId: string,
    oldJti: string,
    publicKey: string,
    newJti: string
  ) {
    // Tìm và cập nhật key token, chỉ khi old jti match
    const result = await keyTokenModel.findOneAndUpdate(
      { userId, jti: oldJti }, // Verify old jti
      { publicKey, jti: newJti }, // Update with new values
      { new: true }
    );

    if (!result) {
      throw new ErrorResponse({
        errorResponseItem: errorResponses.AUTH_KEY_TOKEN_NOT_FOUND,
      });
    }

    return result;
  }

  /**
   * Tìm key token theo userId và jti
   * @param userId - ID của user
   * @param jti - JWT ID
   */
  public static async findKeyToken(userId: string, jti: string) {
    console.log("🔍 KeyTokenService.findKeyToken:", { userId, jti });

    // Kiểm tra tất cả key tokens của user này
    const allUserTokens = await keyTokenModel.find({ userId });
    console.log(
      "📋 All tokens for user:",
      allUserTokens.map((t) => ({
        id: t._id,
        jti: t.jti,
        created_at: t.created_at,
        updated_at: t.updated_at,
        publicKeyLength: t.publicKey?.length,
      }))
    );

    const keyToken = await keyTokenModel.findOne({ userId, jti });
    console.log("📋 Key token result:", keyToken ? "Found" : "Not found");

    if (keyToken) {
      console.log("🔑 Key token details:", {
        id: keyToken._id,
        userId: keyToken.userId,
        jti: keyToken.jti,
        publicKeyLength: keyToken.publicKey?.length,
      });
    }

    if (!keyToken)
      throw new ErrorResponse({
        errorResponseItem: errorResponses.AUTH_KEY_TOKEN_NOT_FOUND,
      });

    return keyToken;
  }

  /**
   * Xóa key token khi logout
   * @param userId - ID của user
   * @param jti - JWT ID
   */
  public static async deleteKeyToken(userId: string, jti?: string) {
    const filter: any = { userId };
    if (jti) {
      filter.jti = jti;
    }

    return await keyTokenModel.deleteOne(filter);
  }
}
