import { Router } from 'express';
import { AddressRepository } from '../../repositories/address.repository.js';
import { AddressService } from '../../services/address.service.js';
import { AddressController } from '../../controllers/address.controller.js';

const router = Router();

const addressRepo = new AddressRepository();
const addressService = new AddressService(addressRepo);
const addressController = new AddressController(addressService);

router.post('/', addressController.createAddress);
router.get('/', addressController.getAddress);
router.get('/:id', addressController.createAddress);
router.put('/', addressController.updateAddress);
router.delete('/', addressController.deleteAddress);

export default router;
