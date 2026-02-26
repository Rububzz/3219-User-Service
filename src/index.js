const app = require('./app');
const config = require('./config/env');

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
})