import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/error.middleware.js';
import { SERVER_PORT } from './config/env.js';
import connectToDatabase from './database/sql.js';
import authRouter from './routes/auth.routes.js';
import adminRouter from './routes/admin.routes.js';
import productRouter from './routes/product.routes.js';
import medicineRouter from './routes/medicine.routes.js';



const app = express();

const corsOptions = {
  origin: '*',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/admin' , adminRouter)
app.use('/api/v1/product' , productRouter);
app.use('/api/v1/medicine', medicineRouter);

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send("welcome....");
});

app.listen(SERVER_PORT, async () => {
  console.log(`Medifit running on http://localhost:${SERVER_PORT}`);
  await connectToDatabase();
});

export default app;
