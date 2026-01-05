import { IAddress } from '../models/address.model.js';
import { AddressRepository } from '../repositories/address.repository.js';

export class AddressService {
  private addressRepo: AddressRepository;

  constructor(addressRepo = new AddressRepository()) {
    this.addressRepo = addressRepo;
  }

  //creating address
  async createAddress(data: IAddress): Promise<IAddress> {
    return this.addressRepo.create(data);
  }

  //fetching all addresses
  async getAddress(userId: string): Promise<IAddress[]> {
    return this.addressRepo.findByUserId(userId);
  }

  async getAddressById(
    userId: string,
    addressId: string,
  ): Promise<IAddress | null> {
    return this.addressRepo.findById(userId, addressId);
  }

  //update address
  async updateAddress(
    addressId: string,
    data: IAddress,
    userId: string,
  ): Promise<IAddress | null> {
    return this.addressRepo.update(addressId, data, userId);
  }

  //delete address
  async deleteAddress(addressId: string): Promise<IAddress | null> {
    return this.addressRepo.delete(addressId);
  }
}
