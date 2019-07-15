const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
require('dotenv').config();

const User = require('../../Models/User');

// @route   GET api/users
// @desc    Test route
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    [
      check(
        'password',
        'Please enter a password with 6 or more characters and include at least one special character.'
      ).isLength({ min: 6 }),
      check(
        'password',
        'Please include at least one special character.'
      ).matches(/[`~!@#$%^&*()-_+=]+/),
      check('password', 'Please include at least one number.').matches(/[0-9]+/)
    ]
  ],

  async (req, res) => {
    const errors = validationResult(req);
    // const passwordErrors = [];
    // if (!errors.isEmpty())
    //   errors.array().map(result => {
    //     if (result.param === 'password') {
    //       passwordErrors.push(result.msg);
    //     }
    //   });
    // console.log(passwordErrors);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        // size
        s: '200',
        // rating
        r: 'pg',
        // default
        d: 'mm'
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          // acuual mongodb will have user._id but mongoose uses abstraction so we can simply define it as user.id
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
