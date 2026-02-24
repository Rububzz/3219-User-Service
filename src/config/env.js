require('dotenv').config();

const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.NODE_ENV === 'production' ? '7d' : '30d',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
};

// Fail fast — crash immediately if any required variable is missing
const required = ['supabaseUrl', 'supabaseServiceKey', 'jwtSecret'];
for (const key of required) {
  if (!config[key]) throw new Error(`Missing required env variable: ${key}`);
}

module.exports = config;