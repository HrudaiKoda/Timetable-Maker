import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import { Entry } from './models/entriesModel.js';
import entryRoute from './routes/entryRoute.js';
import cors from 'cors';
import cron from 'node-cron';
import multer from 'multer';
import path, { dirname } from 'path';
const __dirname = path.resolve();
const app = express();

//app.use(express.static(path.join(__dirname, 'public')));

// Express middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.get('/ping', (req, res) => {
  res.status(200).send('Server is alive!');
});

cron.schedule('5 * * * * *', () => {
  // Perform an HTTP request to your own server
  // Use fetch instead of axios
  fetch(`https://mern-app-lf5e.onrender.com/ping`)
    .then(response => response.text())
  
    .catch(error => {
      console.error('Ping failed:', error.message);
    });
});
app.use('/entrys', entryRoute);


mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('DB connected');
    app.listen(PORT, () => {
      console.log(`Server listening on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
