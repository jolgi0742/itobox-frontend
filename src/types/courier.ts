export interface Package {
  id: string;
  tracking: string;
  shipper: string;
  consignee: string;
  weight: number;
  volume: number;
  status: 'created' | 'in-transit' | 'delivered';
}

export interface Rate {
  id: number;
  name: string;
  country: string;
  serviceType: 'Lb' | 'CF';
  baseRate: number;
  taxPercentage: number;
  insurancePercentage: number;
  active: boolean;
}