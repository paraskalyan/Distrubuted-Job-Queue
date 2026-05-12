import express from 'express';
import jobRoutes from './api/routes/email.routes.js';
const app = express();

app.use(express.json())

app.use('/api/jobs', jobRoutes);

app.get("/", (req, res) => {
  res.send("working");
});

app.listen(3000, () => {
    console.log("Server Running");
})