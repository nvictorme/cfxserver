var express = require('express');
var router = express.Router();
var mongo = require('../utils/mongo');

/* GET users listing. */
router.get('/:state', function (req, res, next) {
    try {
        const toFind = (req.params.state != undefined && req.params.state != '') ? {
            state: req.params.state
        } : {};
        mongo.mongoConnect('carfax')
            .then(db => {
                db.collection('carfax_dealers').find(toFind)
                    .toArray()
                    .then(dealers => {
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.status(200).send({
                            dealers
                        })
                    })
            });
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;