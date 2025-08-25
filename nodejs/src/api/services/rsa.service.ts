import { generateKeyPairSync } from "crypto";

export default class RSAService {
  /**
   * Sinh cặp khóa RSA (privateKey, publicKey)
   */
  public static generateKeyPair() {
    const { publicKey, privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });
    return { publicKey, privateKey };
  }
}
