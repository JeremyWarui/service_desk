import express from 'express';
import dotenv from 'dotenv';
import router from './routes/index';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  // origin that is allowed to access the api
  origin: 'http://localhost:3000'
}));
app.use('/', router);

app.listen(port, () => {
    // console.log('Server started successfully');
    console.log(`Server running on  ${port}, 1:${port}`)
});

export default app;
