var express = require("express");
var router = express.Router();
var mongo = require("../utils/mongo");
var _ = require('lodash');

/* GET vehicle stats. */
router.get("/", function (req, res, next) {
    mongo.mongoConnect("carfax").then(db => {
        if (req.query.year != undefined && req.query.make != undefined && req.query.model != undefined) {
            const year = parseInt(req.query.year);
            const make = req.query.make;
            const model = req.query.model;
            db.collection("carfax_vehicles")
                .find({
                    year,
                    make,
                    model
                })
                .toArray()
                .then(vehicles => {
                    const clean = vehicles.filter(vehicle => {
                        return vehicle.noAccidents === true;
                    })
                    const damage = vehicles.filter(vehicle => {
                        return vehicle.noAccidents === false;
                    })

                    const max_price = _.max(vehicles.map(vehicle => {
                        return vehicle.currentPrice
                    }));
                    const min_price = _.min(vehicles.map(vehicle => {
                        return vehicle.currentPrice
                    }));

                    const avg_clean_price = Math.round(_.mean(clean.map(vehicle => {
                        return vehicle.currentPrice
                    })));
                    const avg_clean_mileage = Math.round(_.mean(clean.map(vehicle => {
                        return vehicle.mileage
                    })));
                    const avg_damage_price = Math.round(_.mean(damage.map(vehicle => {
                        return vehicle.currentPrice
                    })));
                    const avg_damage_mileage = Math.round(_.mean(damage.map(vehicle => {
                        return vehicle.mileage
                    })));

                    const best = _.sortBy(clean.filter(vehicle => {
                        return vehicle.currentPrice <= avg_clean_price && vehicle.mileage <= avg_clean_mileage;
                    }), ['currentPrice', 'mileage']);

                    const worst = _.sortBy(damage.filter(vehicle => {
                        return vehicle.currentPrice >= avg_damage_price && vehicle.mileage >= avg_damage_mileage;
                    }), ['currentPrice', 'mileage']);

                    // const best = clean.filter(vehicle => {
                    //     return vehicle.currentPrice <= (avg_price_clean + avg_diff);
                    // });
                    // const worst = damage.filter(vehicle => {
                    //     return vehicle.currentPrice >= (avg_price_clean - avg_diff);
                    // });

                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.status(200).send({
                        vehicle: {
                            year,
                            make,
                            model,
                        },
                        max_price,
                        min_price,
                        avg_clean_price,
                        avg_clean_mileage,
                        avg_damage_price,
                        avg_damage_mileage,
                        best,
                        worst,
                        total_sample: vehicles.length,
                    });
                });
        } else {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.status(400).send({
                error: "Missing Vehicle Specs"
            });
        }
    });
});

module.exports = router;