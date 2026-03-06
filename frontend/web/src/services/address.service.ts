import userApi from '../lib/axios.user';

export type SavedAddress = {
  _id: string;
  addressType: 'billing' | 'home' | 'office';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};

type AddressListResponse = {
  success?: boolean;
  data?: SavedAddress[];
};

export type AddressPayload = {
  addressType: 'billing' | 'home' | 'office';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
};

type AddressItemResponse = {
  success?: boolean;
  data?: SavedAddress;
  message?: string;
};

type GenericResponse = {
  success?: boolean;
  data?: string;
  message?: string;
};

export const addressService = {
  getAddresses: async (): Promise<SavedAddress[]> => {
    const res = await userApi.get<AddressListResponse>('/address');
    return res.data?.data ?? [];
  },

  createAddress: async (payload: AddressPayload): Promise<SavedAddress> => {
    const res = await userApi.post<AddressItemResponse>('/address', payload);
    if (!res.data?.data) {
      throw new Error(res.data?.message || 'Failed to create address');
    }
    return res.data.data;
  },

  updateAddress: async (
    addressId: string,
    payload: AddressPayload,
  ): Promise<void> => {
    await userApi.put<GenericResponse>('/address', {
      addressId,
      data: payload,
    });
  },

  deleteAddress: async (addressId: string): Promise<void> => {
    await userApi.delete<GenericResponse>('/address', { data: { addressId } });
  },
};
