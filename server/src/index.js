import dotenv from 'dotenv';
import { createApp } from './app.js';

dotenv.config();

const port = Number(process.env.PORT || 4000);
const app = createApp();

app.listen(port, () => {
  console.log(`Garage management API listening on port ${port}`);
});
