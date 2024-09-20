import axios from 'axios';

const apiUsingNow = axios.create({
  baseURL: `${process.env.URL_API_WPP}/theborges`,
  timeout: 100000,
});

export const createMessage = async (data: {
  number: string;
  message: string;
}) => {
  await apiUsingNow.post('messages', data);
};

export const verifyNumber = async (number: string) => {
  const reponse = await apiUsingNow.get<{ _serialized: string }>(
    `number/${number}`,
  );
  return reponse.data;
};

const apiBoot = axios.create({
  baseURL: `${process.env.URL_API_WPP}/monitoramento`,
  timeout: 100000,
});

export const avisos = async (data: { message: string }) => {
  await apiBoot.post('messages', {
    ...data,
    number: '120363307872837951@g.us',
  });
};
