const router = require('express').Router();
const { sms_list, company, user, sequelize } = require('../models');
const sms = require('../modules/sms');
const moment = require('moment');

// SMS 전송 관련
router.post('/', (req, res) => {
  const message = req.body.message;
  const companyId = req.body.companyId;
  const franchiseId = req.body.franchiseId;
  const type = req.body.type;

  const header = `[TheLaundry]\n`;

  findUser(companyId)
    .then(users => {
      return sendMessage(companyId, franchiseId, type, users, header, message);
    }).then(data => {
      res.json(data);
    }).catch(err => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.get('/list/franchise/:id', (req, res) => {
  const id = req.params.id;

  readLog(id, null, true)
    .then(data => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

function writeLog(companyId, franchiseId, message, count, from, sender, loss) {
  console.log(message);
  return sms_list.create({
    message,
    from,
    companyId,
    franchiseId,
    count,
    sender,
    loss,
  });
}

function readLog(franchiseId, companyId, isCompany = true) {
  if (isCompany) {   
    return sms_list.findAll({ 
      where: { 
        franchiseId 
      }
    });

  } else {
    return sms_list.findAll({
      where: {
        franchiseId, companyId
      }
    });
  }
}

function sendMessage(companyId, franchiseId, sendType, targets, header, message) {
  return sms(targets, header, message)
    .then(response => {
      response.ignoreCount = targets.length - response.count;
      return response;
    })
    .then(data => {
      return writeLog(companyId, franchiseId, message, data.count, sendType, sendType, data.ignoreCount);
    });
}

function findUser(targetCompanys) {
  return user.findAll({
    where: { 
      companyId: targetCompanys
    },
    attributes: ['phone'],
    raw: true,
  }).then(data => {
    return data.map(item => item.phone);
  });
}

module.exports = router;
