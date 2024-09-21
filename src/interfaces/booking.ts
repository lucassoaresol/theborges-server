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
  client: {
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
  };
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
