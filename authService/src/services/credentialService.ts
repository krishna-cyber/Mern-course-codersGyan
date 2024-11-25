import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

class CredentialService {
  constructor() {}
  async checkForPasswordMatch(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(String(password), hashedPassword);
  }
}

export default CredentialService;
