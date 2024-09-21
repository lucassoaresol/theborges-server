import { IClient } from './client';

export interface IBooking {
  id: number;
  date: Date;
  clientId: number;
  createdAt: Date;
  endTime: number;
  forPersonName: string | null;
  professionalId: number;
  publicId: string;
  startTime: number;
  status: string;
  updatedAt: Date;
  wasReminded: boolean;
  client: IClient;
  services: {
    price: number;
    order: number;
    service: {
      id: number;
      name: string;
      description: string;
      durationMinutes: number;
      price: number;
      color: string;
      categoryId: number;
      isAdditional: boolean;
      additionalPrice: number | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }[];
}
