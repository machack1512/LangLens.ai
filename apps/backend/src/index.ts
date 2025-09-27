import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import translateRouter from './routes/translate';
import { uploadRouter }  from './routes/upload';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/translate', translateRouter);
app.use('/api/upload', uploadRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});