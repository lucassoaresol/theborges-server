export interface IClient {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthDay: number | null;
  birthMonth: number | null;
  wantsPromotions: boolean;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IClientWithBooking extends IClient {
  booking_id: number;
  date: Date;
  startTime: number;
  booking_public_id: string;
}
