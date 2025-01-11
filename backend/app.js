const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', apiRoutes);

module.exports = app;
