var express = require('express');
var router = express.Router();
var mongo = require('../utils/mongo');

/* GET users listing. */
router.get('/', function (req, res, next) {
    mongo.mongoConnect('carfax_com')
        .then(db => {
            db.collection('demo_dealers').find()
                .toArray()
                .then(dealers => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(200).send({ dealers })
                })
        })
});

module.exports = router;