const { check, validationResult } = require('express-validator')

exports.checkRegUser = [
  check("username").trim().not().isEmpty().withMessage("Username is required!!"),
  check("password").trim().not().isEmpty().withMessage("Password is required!!").isLength({min:8}).not().withMessage("password must have least 8 characters!!"),
  check("emailid").trim().not().isEmpty().withMessage("Emailid is required!!").isEmail().withMessage("Please enter proper emailid!!"),
]

exports.checkLoginUser = [
  check("uname").trim().not().isEmpty().withMessage("Please Enter username or emailid!!"),
  check("password").trim().not().isEmpty().withMessage("Password is required!!"),
]

exports.valResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg;
    return res.status(422).json({success : false, error : error})
  }
    next();
};