require('dotenv').config();
const express = require('express');
const cors = require('cors');

const initServer = require('./src/utils/initServer');
const router = require('./src/routes');

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 8082;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const app = express();

app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  optionsSuccessStatus: 200
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('/', (req, res) => {
  res.status(200).json({ status: 200, message: 'Welcome to Node API' });
});

app.use("/api/users", (req, res)=>{
  return res.status(200).json({
    message: "This is new feature."
  })
})

// Define routes
app.use(router);

app.all('*', (req, res) => {
  res.status(404).json({ status: 404, message: 'Not Found Server' });
});

// Connect to database
initServer()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is up and running in port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error initializing server:', error);
    process.exit(1); // Exit with error
  });
