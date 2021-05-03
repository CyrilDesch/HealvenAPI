const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
  let authorization = req.headers.authorization;
  if (!authorization) {
    authorization = req.query.token;
    if(!authorization){
      return res.status(401).send({ error: 'You must be logged in.' });
    }
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, 'MY_SECRET', async (err, payload) => {
    if(err){
      console.log(token);
      return res.status(401).send({ error: 'You must be logged in.' });
    }

    const { userId } = payload;

    const user = await User.findById(userId);
    req.user = user;
    next();
  });
};