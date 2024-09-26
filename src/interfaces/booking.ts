import { IClient } from './client';

export interface IBookingData {
  id: number;
  date: Date;
  startTime: number;
  clientId: number;
  publicId: string;
}

export interface IBooking extends IBookingData {
  createdAt: Date;
  endTime: number;
  forPersonName: string | null;
  professionalId: number;
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
