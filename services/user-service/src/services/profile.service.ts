import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import type { IUserProfile } from '../models/profile.model.js';
import { ProfileRepository } from '../repositories/profile.repository.js';

export class ProfileService {
  private profileRepo;
  constructor(profileRepo: ProfileRepository) {
    this.profileRepo = profileRepo;
  }

  async createProfile(
    userId: string,
    data: IUserProfile,
  ): Promise<IUserProfile> {
    const existingProfile = await this.profileRepo.findByUserId(userId);

    if (existingProfile) {
      throw new ConflictError('Profile already exists for this user');
    }

    return this.profileRepo.create({
      ...data,
      userId,
    });
  }

  async getProfileByUserId(userId: string): Promise<IUserProfile | null> {
    return this.profileRepo.findByUserId(userId);
  }

  async updateProfile(
    userId: string,
    data: Partial<IUserProfile>,
  ): Promise<IUserProfile | null> {
    const profile = await this.profileRepo.findByUserId(userId);

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    return this.profileRepo.updateByUserId(userId, data);
  }

  async deleteProfile(userId: string): Promise<boolean> {
    const deleted = await this.profileRepo.deleteByUserId(userId);
    return Boolean(deleted);
  }
}
