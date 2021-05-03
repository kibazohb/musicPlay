const redis = require('redis')
require('dotenv').config()

const client = redis.createClient(
    process.env.REDIS_URI, {tls: {
    rejectUnauthorized: false
}})

client.on('connect', () => {
    console.log('Client got connected', new Date().toLocaleTimeString());
})

client.on('error', (err) => {
    console.log(err.message);
})

client.on('ready', () => {
    console.log('Client got connected and is ready to use');
})

client.on('end', () => {
    console.log('Client got disconnected', new Date().toLocaleTimeString());
})

process.on('SIGINT', () => {
    client.quit()
})

module.exports = client