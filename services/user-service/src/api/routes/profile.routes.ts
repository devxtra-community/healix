import { Router } from 'express';
import { ProfileRepository } from '../../repositories/profile.repository.js';
import { ProfileService } from '../../services/profile.service.js';
import { ProfileController } from '../../controllers/profile.controller.js';

const router = Router();

const profileRepo = new ProfileRepository();
const profileService = new ProfileService(profileRepo);
const profileController = new ProfileController(profileService);

router.post('/', profileController.createProfile);
router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);
router.delete('/', profileController.deleteProfile);

export default router;
