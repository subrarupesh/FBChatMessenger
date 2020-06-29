const User = require('./../models/users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.login = (req,res,next) => {
    User.findOne({email: req.body.email}).then((userInfo) => {
       if(userInfo === null || userInfo === undefined) {
          return res.status(500).json({
               message: 'Unable to login. No User found with given Email'
           });
       } else {
          bcrypt.compare(req.body.password, userInfo.password).then((cmpResult) => {
            if(!cmpResult) {
                return res.status(401).json({
                          message: 'Wrong Password..No record found!!!'
                });
             } else {
               const token = jwt.sign(
                   { email: userInfo.email, user_id: userInfo._id,
                    name: userInfo.name },
                   process.env.JWT_SECRET_KEY,
                   { expiresIn: '8h' }
                );
                res.status(200).json({
                     data: {
                         token: token,
                         user_id: userInfo.user_id,
                         expiresIn: 7200
                     },
                     message: 'User Login Successfull!'
                });
             }
          }).catch((err) => {
            res.status(500).json({
                  message: err.message
              });
          });
        }
     }).catch((err) => {
       res.status(500).json({
             message: err.message
         });
     });
}


exports.signUp = (req,res,next) => {
   User.findOne({email: req.body.email}).then((userInfo) => {
     if(userInfo === null || userInfo === undefined) {
       bcrypt.hash(req.body.password, 10).then((hashPassword) => {
          const user = new User(req.body);
          user.name = req.body.name;
          user.email = req.body.email;
          user.password = hashPassword;
          user.save().then((result) => {
            res.status(201).json({
                  message: 'User has been registered!!!',
                  result: result
              });
          }).catch((err) => {
              res.status(500).json({
                    message: err.message
                });
            });
         })
      } else {
        res.status(500).json({
              message: 'User Already Present'
          });
      }
   }).catch((err) => {
       res.status(500).json({
             message: err.message
         });
     });
}

exports.getUser = (req,res,next) => {
  User.findOne({email: req.body.email}).then((userInfo) => {
    if(userInfo !== undefined) {
      res.status(201).json({
            message: 'User Data has been fetched!!!',
            result: {
              user_id: userInfo.user_id,
              name: userInfo.name,
              email: userInfo.email
            }
        });
     } else {
       res.status(500).json({
             message: 'User Not Present'
         });
     }
  }).catch((err) => {
      res.status(500).json({
            message: err.message
        });
    });
}
