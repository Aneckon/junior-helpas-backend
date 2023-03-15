require('dotenv').config();
const Pool = require('pg').Pool;
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const router = require('./routes/index');
const path = require('path');
const sequelize = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(cookieParser());
app.use(
  fileUpload({
    limits: {
      fileSize: 10000000,
    },
    abortOnLimit: true,
  }),
);
app.use('/api', router);

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.connect();

pool.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (!err) {
    console.log(res);
  } else {
    console.log(err);
  }
  pool.end();
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Connection has been established successfully.');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`server running on port ${process.env.PORT || 5000}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
