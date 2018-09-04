var express = require("express");
var router = express.Router();
var mongo = require("../utils/mongo");

/* GET users listing. */
router.get("/:dealerId", function (req, res, next) {
    mongo.mongoConnect("carfax").then(db => {
        if (req.params.dealerId != undefined) {
            db.collection("carfax_vehicles")
                .find({
                    dealerId: req.params.dealerId
                })
                .toArray()
                .then(vehicles => {
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.status(200).send({
                        vehicles
                    });
                });
        } else {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.status(400).send({
                error: "Missing dealerId"
            });
        }
    });
});

module.exports = router;