const { createClient } = require('@supabase/supabase-js');
require('dotenv').config()

const express = require('express');
const app = express();
const port = 8080;

const supabaseUrl = 'https://apkuarlppngqawvovkqh.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// const { data, error } = await supabase
// .from('Users')
// .select()

app.listen(port, () => console.log("Ouvindo na Porta: "+port))