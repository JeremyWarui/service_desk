import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  // origin that is allowed to access the api
  origin: 'http://localhost:3000'
}));
app.use('/', router);

app.listen(5000, () => {
    console.log('Server started successfully');
});

export default app;
