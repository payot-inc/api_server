const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const sendSMS = require('../modules/sms');
const mqtt = require('../modules/mqtt');
const { machine, user, sms, userPoint, claim, sequelize } = require('../models');
const _ = require('lodash');
const moment = require('moment');

router.post('/company/:id/sms', [
    check('id', '아이디는 숫자이어야 합니다').isInt(),
    check('message', '메시지는 140Byte이상 전송할 수 없습니다').isString().isByteLength({ max: 140 }),
    check('sendType', '메시지 분류').isString().optional()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    user.findAll({
        where: {
            companyId: req.params.id
        },
        attributes: ['phone']
    }).then(numbers => {
        const phoneNumbers = numbers.map(u => u.phone);

        return sendSMS.send(phoneNumbers, req.body.message)
    }).then(sendCount => {
        const data = {
            sendType: req.body.sendType ? req.body.sendType : '일반 전송',
            companyId: req.params.id,
            from: '',
            count: sendCount
        }

        return sms.create(data)
    }).then(result => {
        res.json(result)
    }).catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// 사용자 개별 포인트 추가
router.post('/company/:id/user/point', [
    check('userId').isInt(),
    check('point').isInt()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    user.update(
        {
            point: sequelize.literal(`point + ${req.body.point}`)
        },
        {
            where: {
                id: req.body.userId,
            },
        }).then(data => {
            res.json(data);
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

// 사용자 포인트 추가
router.post('/company/:id/point', [
    check('id').isInt(),
    check('point').isInt().isLength({ min: 1 }),
    check('isSMS').isBoolean().optional()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    user.update({
        point: sequelize.literal(`point + ${req.body.point}`)
    }, {
            where: {
                companyId: req.params.id
            }
        }).then(([count]) => {
            if (count == 0) {
                res.status(204).json();
            } else {
                res.json({ status: `${count}개의 사용자의 포인트를 적용하였습니다` });
            };
        }).catch(err => {
            res.status(500).json({ error: err });
        });
});

// 장치 원격 투입
// 1. 장치 검색
// 2. MQTT 장치 신호 전송
// 3. MQTT 응답 처리
// 4. DB 기록
router.post('/machine/:id/claim', [
    check('id').isInt(),
    check('amount').isNumeric({ min: 500, max: 9500 }),
    check('reason').isString().optional()
], (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

    // 장치를 찾음
    machine.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'mac', 'companyId']
    }).then(m => {
        // 장치가 존재하지 않는다면
        if (_.isEmpty(m)) throw { code: 404, name: '없는 장치 입니다' }

        // mqtt전송
        const topic = `server/${m.mac}/service/claim`;
        const message = ['000', req.body.amount, 'N', 'N'].join(' ');

        return mqtt.request(topic, message)
            .then(deviceResponse => {
                // mqtt의 응답이 오류가 발생하였다면
                console.log(topic, deviceResponse.message[0], req.body.amount)
                if (deviceResponse.message[0] !== '000') throw { code: 400, name: '장치로부터 응답이 없습니다' }

                return {
                    reason: !req.body.reason ? '장비 오작동으로 인한 원격투입' : req.body.reason,
                    amount: req.body.amount,
                    companyId: m.companyId,
                    machineId: m.id
                }
            })
    }).then(data => {
        return claim.create(data)
    }).then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
        if (!err.hasOwnProperty('code')) {
            res.status(500).json({ error: err });
        } else if (err.code == 404) {
            res.status(400).json({ error: '없는 장치 입니다' });
        } else if (err.code == 400) {
            res.status(406).json({ error: '장치로부터 응답이 없습니다' })
        } else {
            res.status(500).json({ error: '알수 없는 오류가 발생하였습니다' });
        };
    });
});

// 

module.exports = router;
