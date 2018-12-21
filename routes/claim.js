const router = require('express').Router();
const { claim } = require('../models');
const moment = require('moment');

router.get('/company/:id', (req, res) => {
  const id = req.params.id;
  const start = moment(req.query.start).startOf('day').toDate();
  const end = moment(req.query.end).endOf('day').toDate();

  claim.findAll({
    where: {
      companyId: id,
      createdAt: {
        between: [start, end],
      }
    }
  }).then(data => {
    res.json(data);
  }).catch(err => {
    res.status(500).json(data);
  });
});

module.exports = router;