const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')

const User = require('../models/user')

router.route('/register')
  .post((req, res) => {
    const user = new User({
      ...req.body,
      created: Date.now()
    })
    User.findOne({ username: req.body.username }, (err, result) => {
      if (err) {
        return err
      }
      if (result) {
        res.status(500).send({
          msg: 'User exists'
        })
      } else {
        user.save((err) => {
          if (err) {
            throw err
          }
          res.status(200).send({
            msg: 'Register succeed'
          })
        })
      }
    })
  })

router.route('/login')
  .get((req, res) => {
    res.render('b-login')
  })
  .post((req, res) => {
    User.findOne({ username: req.body.email }, (err, result) => {
      if (result === null) {
        return res.render('b-login', {
          status: 0,
          message: 'User does not exist'
        })
      }
      if (result) {
        if (result.password !== req.body.password) {
          return res.render('b-login', {
            status: 0,
            message: 'Password is incorrect'
          })
        }
        const token = jwt.sign({ username: result.username }, 'secret', {
          expiresIn: 7 * 24 * 60 * 60
        })
        res.cookie('token', token, {
          expires: new Date(Date.now() + 7 * 24 * 60 * 60)
        }).redirect('/articleList')
      }
    })
  })

module.exports = router
