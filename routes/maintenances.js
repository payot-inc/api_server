const router = require('express').Router();
const _ = require('lodash');
const moment = require('moment');
const { check, validationResult } = require('express-validator/check');
const { maintenance, company, franchise } = require('../models');

router.post('/', [
    check('electric').isNumeric(),
    check('gas').isNumeric(),
    check('water').isNumeric(),
    check('spaceRant').isNumeric(),
    check('management').isNumeric(),
    check('repiar').isNumeric(),
    check('companyId', '업체 아이디를 입력해 주세요').isInt(),
    check('franchiseId', '업체 아이디를 입력해 주세요').isInt(),
    check('targetDate').custom(value => moment(value).isValid())
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    const data = req.body;
    data.targetDate = moment(data.targetDate).endOf('month').toDate();

    maintenance.findOne({
        where: {
            targetDate: data.targetDate,
            companyId: req.body.companyId
        }
    }).then(result => {
        if (result) return result.udpate(data);
        else return maintenance.create(data)
    }).then(result => {
        res.json({ status: 'success' });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

router.get('/company/:id', [
    check('id').isInt(),
    check('start').custom(value => moment(value).isValid()),
    check('end').custom(value => moment(value).isValid()),
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    const startDate = moment(req.query.start).startOf('month').toDate();
    const endDate = moment(req.query.end).endOf('month').toDate();

    maintenance.findAll({
        where: {
            companyId: req.params.id,
            targetDate: {
                between: [startDate, endDate]
            }
        },
        attributes: { exclude: ['id', 'companyId', 'franchiseId'] }
    }).then(result => {
        if (!result) res.status(204).json({});
        else res.json(result);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

router.get('/franchise/:id', [
    check('id').isInt(),
    check('start').custom(value => moment(value).isValid()),
    check('end').custom(value => moment(value).isValid()),
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    const startDate = moment(req.query.start).startOf('month').toDate();
    const endDate = moment(req.query.end).endOf('month').toDate();

    maintenance.findAll({
        where: {
            franchiseId: req.params.id,
            targetDate: {
                between: [startDate, endDate]
            }
        },
        attributes: { exclude: ['id', 'franchiseId'] }
    }).then(result => {
        if (!result) res.status(204).json({});
        else res.json(result);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

module.exports = router;