import { Address, type IAddress } from '../models/address.model.js';

export class AddressRepository {
  findByUserId(userId: string) {
    return Address.find({ userId }).lean();
  }

  findById(userId: string, addressId: string) {
    return Address.findOne({ _id: addressId, userId }).lean();
  }

  create(data: IAddress) {
    return Address.create(data);
  }

  update(addressId: string, data: IAddress, userId: string) {
    return Address.findByIdAndUpdate({ _id: addressId, userId }, data, {
      new: true,
      runValidators: true,
    });
  }

  delete(addressId: string) {
    return Address.findByIdAndDelete(addressId);
  }
}
