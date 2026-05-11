import express from 'express';
import jobRoutes from './api/routes/email.routes.js';
const app = express();

app.use('/api', jobRoutes);

app.listen(3000, () => {
    console.log("Server Running");
})