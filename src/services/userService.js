const supabase = require('../config/supabase');
const bycrt = require('bcrypt');
const config = require('../config/env');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

const registerUser = async ({ username, email, password }) => {
    //Check if user already exists
    const { data: existing } = await supabase.from('users').select('id').eq('email', email).single();
    if (existing) throw new Error('User already exists');

    //Hash password
    const hashedPassword = await bycrt.hash(password, SALT_ROUNDS);

    //Insert user into DB
    const { data, error } = await supabase
    .from('users')
    .insert([{ username: username, email: email, password: hashedPassword, display_name: username }])
    .select('id, username, email, display_name, created_at, updated_at')
    .single();

    if (error) throw new Error(error.message);
        
    return data;
}

const loginUser = async ({ identifier, password }) => {
    const isEmail = identifier.includes('@');
    const { data : user, error } = await supabase.from('users').select('*').eq(isEmail ? 'email' : 'username', identifier).single();

    if (error || !user) throw new Error('Invalid credentials');

    const valid = await bycrt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: config.jwtExpiry});

    return { token, user: { id: user.id, username: user.username, email: user.email, display_name: user.display_name } };
    
} 

const getUserById = async (id) => {
    const { data, error } = await supabase.from('users').
    select('id, username, email, display_name, created_at, updated_at').
    eq('id', id).single();

    if (error || !data) throw new Error('User not found');

    return data;
}

const updateUser = async (id, updates) => {
    const allowed = ['display_name', 'password'];
    const updateEntries = Object.entries(updates);
    const allowedEntries = updateEntries.filter(([key]) => allowed.includes(key));
    const filtered = Object.fromEntries(allowedEntries);

  const { data, error } = await supabase
    .from('users')
    .update(filtered)
    .eq('id', id)
    .select('id, username, email, display_name')
    .single();

    if (error) throw new Error(error.message);
    return data
}

module.exports = { registerUser, loginUser, getUserById, updateUser };