import axios from 'axios';

const apiUsingNow = axios.create({
  baseURL: process.env.URL_API_PHP,
  timeout: 100000,
});

export const updatePassword = async (user_id: number) => {
  await apiUsingNow.get(`update-passwords.php?user_id=${user_id}`);
};
