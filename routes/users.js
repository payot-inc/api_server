const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { user } = require('../models');
const { check, validationResult } = require('express-validator/check');

router.get('/:id', [
  check('id').toInt()
], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

  user.findOne({
    where: {
      id: req.params.id
    }
  }).then(data => {
    if (_.isEmpty(data)) res.status(204).json({});
    else res.json(data);
  }).catch(err => {
    res.status(500).json({ error: err });
  });
});

router.get('/company/:id', (req, res) => {
  user.findAll({
    where: {
      companyId: req.params.id,
    }
  }).then(result => {
    res.json(result);
  }).catch(err => {
    res.status(500).json({ error: err });
  });
});

router.get('/company/:id/phone/:phone', (req, res) => {
  user.findOne({
    where: {
      companyId: req.params.id,
      phone: req.params.phone
    },
    raw: true,
  }).then((data) => {
    res.json(data);
  }).catch((err) => {
    res.status(500).json(err);
  });
});

router.post('/', [
  check('phone').isMobilePhone(),
  check('companyId').isInt(),
], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });
  user.create(
    { companyId: req.body.companyId, phone: req.body.phone },
  ).then((data) => {
    return user.findOne({ where: { companyId: req.body.companyId, phone: req.body.phone } });
  }).then(data => {
    res.json(data);
  }).catch(err => {
    res.json(err);
  });
});

router.post('/point', (req, res) => {
  const poinChangeUsers = req.body.users;

  if (poinChangeUsers instanceof Array) {

  } else {
    
  }
});

router.get('/:phone/company/:id', [
  check('id').toInt(),
  check('phone').isMobilePhone()
], (req, res) => {
  
  user.findOrCreate({
    where: { companyId: req.params.id, phone: req.params.phone },
    defaults: { companyId: req.params.id, phone: req.params.phone },
  }).spread((data, created) => {
    res.json(data);
  }).catch(err => {
    res.json(err);
  });

  // user.findOne({
  //   where: {
  //     companyId: req.params.id,
  //     phone: req.params.phone,
  //   },
  // }).then(data => {
  //   if (!_.isEmpty(data)) res.json(data);

  //   return user.create({ phone: req.params.phone, companyId: req.params.id });
  // }).then((created) => {
  //   res.json(created);
  // }).catch(err => {
  //   res.status(500).json({ error: err });
  // });
});

module.exports = router;
