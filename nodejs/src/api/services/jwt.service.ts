import { v4 as uuidv4 } from "uuid";
import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../config/jwt.config";
import type { JwtSignPayload } from "@/types/jwt";

export class JwtService {
  static generateAccessToken(
    payload: JwtSignPayload,
    privateKey: string,
    jti?: string,
    options?: SignOptions
  ) {
    const token = jwt.sign({ ...payload, jti }, privateKey, {
      ...JWT_CONFIG.accessToken,
      ...options,
      jwtid: jti,
    });

    return token;
  }

  static generateRefreshToken(
    payload: JwtSignPayload,
    privateKey: string,
    jti?: string,
    options?: SignOptions
  ) {
    const token = jwt.sign({ ...payload, jti }, privateKey, {
      ...JWT_CONFIG.refreshToken,
      ...options,
      jwtid: jti,
    });

    return token;
  }

  static generateTokenPair(payload: JwtSignPayload, privateKey: string) {
    const jti = uuidv4();
    const accessToken = this.generateAccessToken(payload, privateKey, jti);
    const refreshToken = this.generateRefreshToken(payload, privateKey, jti);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      jti: jti,
    };
  }

  static verify(token: string, publicKey: string) {
    try {
      return jwt.verify(token, publicKey, JWT_CONFIG.verify);
    } catch (err) {
      return null;
    }
  }

  static decode(token: string): (JwtSignPayload & { jti: string }) | null {
    try {
      const payload = jwt.decode(token) as JwtSignPayload & { jti: string };
      return payload;
    } catch (err) {
      return null;
    }
  }
}
