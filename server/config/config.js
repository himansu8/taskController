import 'dotenv/config'


const config = {
    MONGO_URL : process.env.MONGODB_URL,
    PRIVATE_KEY : process.env.PRIVATE_KEY,
    JWT_EXPIRY : process.env.JWT_EXPIRY,
    BASE_URL : process.env.BASE_URL
}

//console.log(config)

export default config;