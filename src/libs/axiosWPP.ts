import axios from 'axios';

const apiUsingNow = axios.create({
  baseURL: process.env.URL_API_WPP,
  timeout: 100000,
});

export const createMessage = async (
  client_id: string,
  data: {
    number: string;
    message: string;
  },
) => {
  await apiUsingNow.post(`${client_id}/messages`, data);
};

export const verifyNumber = async (number: string) => {
  const reponse = await apiUsingNow.get<{ _serialized: string }>(
    `monitoramento/number/${number}`,
  );
  return reponse.data;
};
