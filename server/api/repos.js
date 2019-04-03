const redis = require('redis')
const client = redis.createClient();
const {promisify} = require('util')
const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

client.on("error", (err)=>{
    console.log("Error "+ err)
})

client.get("/", async (req,res,next)=>{
    try {
        let gods = await God.findById(1).map(god => god.name);
        let cacheresp = await client.setAsync('godKey', gods) // send to cache
        res.send(cacheresp); // log something
    } catch(err){
        next(err);
    }
})


module.exports = client ;