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
