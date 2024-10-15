import cors from 'cors';
import express from 'express';

import 'express-async-errors';
import { env } from '../application/config/env';
import { errorHandler } from '../application/errors/handleError';
import routes from '../routes';

const app = express();

app.use(cors());

app.use(express.json());
app.use(routes);

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Servidor executando na porta ${env.port}.`);
});
