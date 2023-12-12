import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use('/', router);

app.listen(5000);

export default app;
