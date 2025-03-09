import { User } from "../models/user.model";
import { UserDocument } from "../types";

export class UserRepository {
  async create(userData: Partial<UserDocument>): Promise<UserDocument> {
    const user = new User(userData);
    return await user.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await User.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return await User.findById(id);
  }
}
