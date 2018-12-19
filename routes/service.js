const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const { service } = require('../models');
const _ = require('lodash');
const moment = require('moment');

// 서비스 조회
router.get('/:id', [
    check('id').isInt()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    service.findOne({
        where: {
            id: req.params.id
        },
        attributes: { exclude: ['updatedAt', 'createdAt'] }
    }).then(result => {
        if (_.isEmpty(result)) res.status(204).json({});
        else res.json(result)
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

// 장비별 서비스 조회
router.get('/machine/:id', [
    check('id').isInt()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    service.findAll({
        where: {
            machineId: req.params.id
        },
        attributes: { exclude: ['machineId', 'createdAt', 'updatedAt'] }
    }).then(result => {
        if (_.isEmpty(result)) res.status(204).json({});
        else res.json(result);
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

// 서비스 등록
router.post('/machine/:id', [
    check('name', '서비스 이름을 입력해 주세요').isString().isLength({ min: 2, max: 20 }),
    check('notice', '서비스 설명').isString().optional(),
    check('price', '서비스 가격을 입력해 주세요').isNumeric().optional(),
    check('runTimeSec', '서비스 동작시간을 입력해 주세요').isInt().optional(),
    check('id', '서비스가 동작할 장비를 입력해주세요').isInt()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    let data = req.body;
    delete data.id;
    delete data.machineId;
    data.machineId = req.params.id;

    service.create(data)
        .then(result => {
            res.json(result);
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

// 서비스 업데이트
router.put('/:id', [
    check('name', '서비스 이름을 입력해 주세요').isString().isLength({ min: 2, max: 20 }).optional(),
    check('notice', '서비스 설명').isString().optional(),
    check('price', '서비스 가격을 입력해 주세요').isNumeric().optional(),
    check('runTimeSec', '서비스 동작시간을 입력해 주세요').isInt().optional(),
    check('isSales').isBoolean().optional()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    let data = req.body;
    delete data.id;
    delete data.companyId;

    service.update(data, {
        where: {
            id: req.params.id
        }
    }).then(result => {
        if (result[0] == 1) res.json({ status: 'success' });
        else res.status(204).json({ status: 'sucess' });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

// 서비스 삭제
router.delete('/:id', [
    check('id').isInt()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    service.destroy({
        where: {
            id: req.params.id
        }
    }).then(result => {
        if (result[0] == 1) res.json(result);
        else res.status(204).json({});
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

module.exports = router;