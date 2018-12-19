const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const { userPoint } = require('../models');
const _ = require('lodash');
const moment = require('moment');

// 사용자 포인트 사용목록 조회하기
router.get('/user/:id', [
    check('id', '아이디는 숫자이어야 합니다').isInt(),
    check('start').custom(val => moment(val).isValid()).optional(),
    check('end').custom(val => moment(val).isValid()).optional(),
    check('resultCount').isInt({ min: 1, max: 200 }).optional()
],
(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });
    
    let query = req.query;

    query.start = query.hasOwnProperty('start') ? moment(query.start).toDate() : moment().add(-1, "month").toDate();
    query.end = query.hasOwnProperty('end') ? moment(query.end).toDate() : moment().add(-1, "month").toDate();
    query.resultData = query.hasOwnProperty('resultCount') ? query.resultData : 30;

    userPoint.findAll({
        where: {
            createdAt: {
                between: [query.start, query.end]
            }
        },
        limit: query.resultData
    }).then(result => {
        if (_.isEmpty(result)) res.status(204).json([]);
        else res.json(result)
    }).catch(err => {
        res.status(500).json({ error: err });
    });
});

module.exports = router;