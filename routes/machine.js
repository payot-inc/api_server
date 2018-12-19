const router = require('express').Router();
const _ = require('lodash');
const moment = require('moment');
const { check, validationResult } = require('express-validator/check');
const { machine } = require('../models');

// 장치 정보 가져오기
router.get('/:id', (req, res) => {
    machine.findOne({
        where: {
            id: req.params.id
        },
        attributes: { exclude: ['updatedAt', 'deletedAt'] }
    }).then(result => {
        if (_.isEmpty(result)) res.status(204).json();
        else res.json(result)
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

router.post('/', [
    check('mac', '장비의 MAC주소를 입력해 주세요').isMACAddress(),
    check('name', '장치 이름을 입력해 주세요').isString().isLength({ min: 2, max: 20 }),
    check('price', '장치 가격을 입력해 주세요').isNumeric(),
    check('size', '장비의 규모를 입력해 주세요').isString().isLength({ min: 2, max: 10 }),
    check('serviceAmount', '장치가 동작하는 평균금액을 입력해 주세요').isNumeric(),
    check('serviceRuntimeSec', '장치가 동작하는 평균 시간을 입력해 주세요').isInt(),
    check('installAt', '구입일자를 작성해 주세요').custom(val => moment(val).isValid()),
    check('companyId', '업체 아이디를 입력해 주세요').isInt()
],(req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    let data = req.body;
    data.mac = data.mac.toUpperCase();

    machine.create(data)
        .then(result => {
            delete result.updateAt;
            delete result.createAt;

            res.json(result);
        }).catch(err => {
            if (err.name == 'SequelizeUniqueConstraintError') res.status(400).json({ error: '이미 등록된 MAC 주소입니다' });
            else res.status(500).json();
        });
});

router.put('/:id', [
    check('mac', '장비의 MAC주소를 입력해 주세요').isMACAddress().optional(),
    check('name', '장치 이름을 입력해 주세요').isString().isLength({ min: 2, max: 20 }).optional(),
    check('price', '장치 가격을 입력해 주세요').isNumeric().optional(),
    check('serviceAmmount', '장치가 동작하는 평균금액을 입력해 주세요').isNumeric().optional(),
    check('serviceRuntimeSec', '장치가 동작하는 평균 시간을 입력해 주세요').isInt().optional(),
    check('installAt', '구입일자를 작성해 주세요').custom(val => moment(val).isValid()).optional()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    let data = req.body;
    delete data.id;
    delete data.companyId;

    if (data.hasOwnProperty('mac')) {
        data.mac = data.mac.toUpperCase();
    }

    machine.update(data, {
        where: {
            id: req.params.id
        },
        attributes: Object.keys(data)
    }).then(result => {
        if (result[0] == 1) res.json({ status: 'success' });
        else res.status(204).json({ status: 'success' });
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

router.post('/bulk', (req, res) => {
    machine.bulkCreate(req.body)
        .then(data => {
            res.json(data)
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

// 장치 삭제
router.delete('/:id', (req, res) => {
    machine.destroy({
        where: {
            id: req.params.id
        }
    }).then(result => {
        if (result[0] == 1) res.json({ status: 'success' });
        else res.status(204).json({ status: 'success' });
    }).catch(err => {
        res.status(500).json({ error: err });
    })
})

module.exports = router;