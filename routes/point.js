const router = require('express').Router();
const { check, validationResult } = require('express-validator/check');
const { append_point, sequelize } = require('../models');
const _ = require('lodash');
const moment = require('moment');

// 사용자 포인트 사용목록 조회하기
// router.get('/user/:id', [
//     check('id', '아이디는 숫자이어야 합니다').isInt(),
//     check('start').custom(val => moment(val).isValid()).optional(),
//     check('end').custom(val => moment(val).isValid()).optional(),
//     check('resultCount').isInt({ min: 1, max: 200 }).optional()
// ],
// (req, res) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

//     let query = req.query;

//     query.start = query.hasOwnProperty('start') ? moment(query.start).toDate() : moment().add(-1, "month").toDate();
//     query.end = query.hasOwnProperty('end') ? moment(query.end).toDate() : moment().add(-1, "month").toDate();
//     query.resultData = query.hasOwnProperty('resultCount') ? query.resultData : 30;

//     userPoint.findAll({
//         where: {
//             createdAt: {
//                 between: [query.start, query.end]
//             }
//         },
//         limit: query.resultData
//     }).then(result => {
//         if (_.isEmpty(result)) res.status(204).json([]);
//         else res.json(result)
//     }).catch(err => {
//         res.status(500).json({ error: err });
//     });
// });

router.post('/add/company/:id', (req, res) => {
  const updateQuery = `
        UPDATE users 
        SET point = point + :point 
        WHERE 
        phone IN (:phones)`;

  const companyId = req.params.id;

  sequelize
    .query(updateQuery, {
      replacements: { point: req.body.point, phones: req.body.users },
    })
    .then(() => {
      return append_point.create({
        companyId,
        point: req.body.point,
        notice: req.body.notice,
        manyPerson: req.body.users.length,
      });
    })
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/add/list/company/:id', (req, res) => {
  const start = moment(req.query.start)
    .startOf('day')
    .toDate();
  const end = moment(req.query.end)
    .endOf('day')
    .toDate();

  append_point
    .findAll({
      where: {
        companyId: req.params.id,
        createdAt: {
          between: [start, end],
        },
      },
    })
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
