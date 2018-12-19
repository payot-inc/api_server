const router = require('express').Router();
const _ = require('lodash');
const moment = require('moment');
const { payments, machine, sequelize } = require('../models');
const { check, validationResult } = require('express-validator/check');

// test SQL : SELECT COUNT(*) as count, SUM(amount) as Total FROM payments WHERE companyId = 7 AND payAt > "2018-12-01" AND payAt < "2018-12-02";


router.get('/company/:id', [
    check('id').isInt(),
    check('start').custom(value => moment(value).isValid()).optional(),
    check('end').custom(value => moment(value).isValid()).optional(),
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    const startDate = moment(req.query.start, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const endDate = moment(req.query.end, 'YYYY-MM-DD').format('YYYY-MM-DD');

    const query = `
    SELECT * FROM payments
    WHERE
        companyId = :companyId
        AND
        DATE(payAt) >= :start
        AND
        DATE(payAt) < :end
    ORDER BY payAt DESC;`;

    sequelize.query(query, { replacements: {
        companyId: req.params.id,
        start: startDate,
        end: endDate
    }}).spread((results, metadata) => {
        const result = {
            size: results.length,
            data: results
        };
        res.json(results);
    }, err => {
        res.json(err);
    });
        
    // payments.findAll({
    //     where: {
    //         companyId: req.params.id,
    //         payAt: {
    //             between: [startDate, endDate]
    //         }
    //     },
    //     order: ['payAt', 'DESC'],
    // }).then(data => {
    //     const result = {
    //         size: data.length,
    //         data: data
    //     };
    //     res.json(result);
    // }).catch(err => {
    //     res.status(500).json({ error: err });
    // });
});

router.get('/franchise/:id', [
    check('id').isInt(),
    check('start').custom(value => moment(value).isValid()).optional(),
    check('end').custom(value => moment(value).isValid()).optional(),
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    const startDate = moment(req.query.start).toDate();
    const endDate = moment(req.query.end).toDate();

    payments.findAll({
        where: {
            franchiseId: req.params.id,
            payAt: {
                between: [startDate, endDate]
            }
        }
    }).then(data => {
        res.json(data);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

router.get('/machine/:id', [
    check('id').isInt(),
    check('start').custom(value => moment(value).isValid()).optional(),
    check('end').custom(value => moment(value).isValid()).optional(),
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    const startDate = moment(req.query.start).toDate();
    const endDate = moment(req.query.end).toDate();

    machine.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['mac']
    }).then(mac => {
        if (_.isEmpty(mac)) return;
        return payments.findAll({
            where: {
                mac: mac,
                payAt: {
                    between: [startDate, endDate]
                }
            }
        }).then(data => {
            res.json(data);
        }).catch(err => {
            res.status(500).json({ error: err });
        });
    });
});

router.get('/test', (req, res) => {
    const startDate = moment('2018-12-01')
})

module.exports = router;
