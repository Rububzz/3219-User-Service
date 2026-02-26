const express = require('express');
const config = require('./config/env');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok' , env:config.nodeEnv})
})

app.use('/api/users', require('./routes/userRoutes'));

app.use((err, req, res, next) => {
  if (config.isDev) console.error(err.stack);
  res.status(500).json({
    error: config.isDev ? err.message : 'Internal server error'
  });
});

module.exports = app;