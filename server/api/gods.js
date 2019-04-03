const router = require('express').Router();
const { GodPlayerStats, God, GodInfo } = require('../../db');
const godStats = require('../util/godStats');
const defaultStats = Object.keys(require('../util/defaultPlayerGodStats'));

const redis = require('redis')
const client = redis.createClient();
const {promisify} = require('util')
const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)


router.get('/', async (req, res, next) => {
    try {
        let gods;
         try{
          gods = await getAsync ( 'godKey')
         console.log('used cache', typeof gods)
     }catch(e1){
         gods = await God.findAll().map(god => god.name);
        let cacheresp = await setAsync('godKey', gods) // send to cache
        console.log('used db', typeof gods)

        console.log(cacheresp)
        
       }
        res.send(gods);
    } catch(err){
        console.log('some error happened')
        next(err);
    }
})

router.get('/:godName', async (req, res, next) => {
    try {
        let godInfo = await God.findOne({
            where: {
                name: req.params.godName
            },
            include: [{
                model: GodInfo,
                required: true
            }]
        });
        res.send(godInfo);
    } catch(err){
        next(err);
    }
})

router.get('/:godName/stats', async (req, res, next) => {
    try {
        let godInfo = await God.findOne({where: {name: req.params.godName}});
        let stats = await godStats.getStats(req.params.godName, defaultStats, req.query);
        godInfo.dataValues.stats = stats;
        res.send(godInfo);
    } catch(err){
        next(err);
    }
})

router.get('/:godName/stats/KDA', async (req, res, next) => {
    try {
        let godKDAs = await godStats.getKDA(req.params.godName, req.query);
        res.send(godKDAs);
    } catch(err){
        next(err);
    }
})

router.get('/:godName/stats/games', async (req, res, next) => {
    try {
        let gamesPlayed = await godStats.getGames(req.params.godName, req.query);
        res.send(gamesPlayed);
    } catch(err){
        next(err);
    }
})

router.get('/:godName/stats/:statName', async (req, res, next) => {
    try {
        let stat = await godStats.getStats(req.params.godName, [req.params.statName], req.query);
        res.send(stat);
    } catch(err){
        next(err);
    }
})

module.exports = router;