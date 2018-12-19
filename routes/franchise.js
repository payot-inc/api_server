const router = require("express").Router();
const _ = require("lodash");
const moment = require("moment");
const password = require("../modules/password");
const { sequelize, franchise, company, owner, user, machine } = require("../models");
const { check, validationResult } = require("express-validator/check");

// 프랜차이즈 로그인
router.post(
  "/login",
  [
    check("email")
      .isEmail(),
    check("password")
      .isString()
      .isLength({ min: 4, max: 20 })
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array() });

    franchise
      .findOne({
        where: {
          email: req.body.email
        },
        attributes: ["id", "hash", "salt"]
      })
      .then(data => {
        if (_.isEmpty(data)) throw { name: "NotFoundFranchise" };
        return password
          .match(req.body.password, data.salt, data.hash)
          .then(passwordMatched => {
            if (!passwordMatched) throw { name: "NotMatchedPassword" };
            else return data.id;
          });
      })
      .then(id => {
        res.redirect(`/franchise/${id}`);
      })
      .catch(err => {
        if (err.name == "NotFoundFranchise")
          res.status(400).json({ error: "없는 계정입니다" });
        else if (err.name == "NotMatchedPassword")
          res.status(403).json({ error: "비밀번호 오류입니다" });
        else res.status(500).json({ error: err });
      });
  }
);

// 프랜차이즈 조회
router.get(
  "/:id",
  [check("id", "아이디는 숫자이어야 합니다").toInt()],
  (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array() });

    franchise
      .findOne({
        where: {
          id: req.params.id
        },
        include: [
          {
            model: company,
            attributes: {
              exclude: [
                "hash",
                "salt",
                "franchiseId",
                "createdAt",
                "updatedAt",
                "deletedAt"
              ]
            },
            include: [owner, machine]

          }
        ],
        attributes: {
          exclude: ["hash", "salt", "createdAt", "updatedAt", "deletedAt"]
        }
      })
      .then(result => {
        if (result == null || result.length == 0) res.json({});
        else res.json(result);
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
);

// 프랜차이즈 생성
router.post(
  "/",
  [
    check("email", "이메일을 입력해 주세요")
      .isEmail()
      .normalizeEmail(),
    check("name", "이름 입력해 주세요")
      .isString()
      .isLength({ min: 2, max: 10 }),
    check("number", "사업자 번호를 입력해 주세요")
      .isString()
      .isLength({ min: 12, max: 12 }),
    check("password", "비밀번호를 입력해 주세요")
      .isString()
      .isLength({ min: 4, max: 20 }),
    check("address", "주소를 입력해 주세요").isString(),
    check("tel", "전화번호를 입력해 주세요")
      .isString()
      .isLength({ min: 9, max: 20 })
      .optional()
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array() });

    const ps = req.body.password;
    const obj = req.body;
    delete obj.password;

    password
      .create(ps)
      .then(result => {
        obj.hash = result.hash;
        obj.salt = result.salt;

        return obj;
      })
      .then(data => {
        return franchise.create(obj);
      })
      .then(company => {
        delete company.dataValues.hash;
        delete company.dataValues.salt;
        delete company.dataValues.updatedAt;

        res.json(company);
      })
      .catch(err => {
        if (err.name == "SequelizeUniqueConstraintError") {
          res.status(400).json({ error: "이미 가입된 이메일 입니다" });
        } else {
          res.status(500).json({ error: err });
        }
      });
  }
);

// 프랜차이즈 변경
router.put(
  "/:id",
  [
    check("id").isInt(),
    check("name", "이름 입력해 주세요")
      .isString()
      .isLength({ min: 2, max: 10 })
      .optional(),
    check("number", "사업자 번호를 입력해 주세요")
      .isString()
      .isLength({ min: 12, max: 12 })
      .optional(),
    check("password", "비밀번호를 입력해 주세요")
      .isString()
      .isLength({ min: 4, max: 20 })
      .optional(),
    check("address", "주소를 입력해 주세요")
      .isString()
      .optional(),
    check("tel", "주소를 입력해 주세요")
      .isString()
      .optional()
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(422).json({ error: errors.array() });

    // 이메일 정보는 변경할 수 없음
    delete req.body.email;
    // 사업자 번호는 변경할 수 없음
    delete req.body.number;

    // 변경할 내용이 없는 경우
    if (_.isEmpty(req.body)) return res.status(204).json();

    let changeData;

    if (!_.isEmpty(req.body.password)) {
      // 변경되는 내용중에 비밀번호 항목이 있는 경우
      changeData = password.create(req.body.password).then(result => {
        let data = req.body;
        delete data.password;

        data.hash = result.hash;
        data.salt = result.salt;

        return data;
      });
    } else {
      changeData = new Promise((resolve, rejcet) => {
        resolve(req.body);
      });
    }

    changeData
      .then(data => {
        return franchise.update(data, {
          where: {
            id: req.params.id
          },
          attributes: Object.keys(data)
        });
      })
      .then(result => {
        if (result[0] == 1) res.json({ status: "success" });
        else res.status(204).json({ status: "success" });
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
);

// 프랜차이즈 삭제
router.delete("/:id", [check("id").toInt()], (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) return res.status(422).json({ error: errors.array() });

  franchise
    .destroy({
      where: {
        id: req.params.id
      }
    })
    .then(result => {
      if (result == 1) res.json({ status: "success" });
      else res.status(204).json({ status: "success" });
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.get('/:id/company/users', (req, res) => {
  company.findAll({
    where: {
      franchiseId: req.params.id
    },
    attributes: ['name', 'address', 'openDate', 'number'],
    include: [
      { model: user, attributes: ['phone', 'point'] }
    ]
  }).then(data => {
    res.json(data);
  }).catch(err => {
    res.status(500).json({ error: err });
  });
});

module.exports = router;
