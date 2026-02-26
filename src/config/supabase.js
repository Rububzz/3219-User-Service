const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

const supabase = config.isTest
    ? {}
    : createClient(config.supabaseUrl, config.supabaseServiceKey);

module.exports = supabase;