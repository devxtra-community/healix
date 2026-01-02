import type { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service.js';

export class ProfileController {
  private profileService;
  constructor(profileService: ProfileService) {
    this.profileService = profileService;
  }

  // POST /profile
  createProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }

      const profile = await this.profileService.createProfile(userId, req.body);

      res.status(201).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /profile
  getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }

      const profile = await this.profileService.getProfileByUserId(userId);

      if (!profile) {
        return res
          .status(404)
          .json({ success: false, message: 'Profile not found' });
      }

      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  };

  // PUT /profile
  updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }

      const profile = await this.profileService.updateProfile(userId, req.body);

      res.status(200).json({ success: true, data: profile });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /profile
  deleteProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: 'Unauthorized' });
      }

      await this.profileService.deleteProfile(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
