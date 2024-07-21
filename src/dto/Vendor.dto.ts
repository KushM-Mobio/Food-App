export interface CreateVendorInput {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: number;
  address: string;
  phone: string;
  email: string;
  password: string;
}

export interface LogInVendor {
  email: string;
  password: string;
}

export interface VendorToken {
  _id: any;
  name: string;
  email: string;
  foodType: [string];
}

export interface EditVendorInput {
  name?: string;
  address?: string;
  pincode?: number;
  phone?: string;
  foodType?: [string];
}
