const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { pseudo, password } = req.body;

  if (!pseudo || !password) {
    return res.status(422).send({ error: 'Must provide pseudo and password' });
  }

  try {
    const user = new User({ pseudo, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET');
    const returnUser = user.toJSON();
    delete returnUser.password;
    delete returnUser.__v;
    res.send({ token, returnUser });
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

router.post('/signin', async (req, res) => {
  const { pseudo, password } = req.body;

  if (!pseudo || !password) {
    return res.status(422).send({ error: 'Must provide pseudo and password' });
  }

  const user = await User.findOne({ pseudo });
  if (!user) {
    return res.status(422).send({ error: 'Invalid password or pseudo' });
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET');
    const returnUser = user.toJSON();
    delete returnUser.password;
    res.send({ token, returnUser });
  } catch (err) {
    return res.status(422).send({ error: 'Invalid password or pseudo' });
  }
});

module.exports = router;