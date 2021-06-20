const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');

const router = express.Router();

router.use(requireAuth);

router.get('/tracks', async(req, res) => {
  const tracks = await Track.find({ userId: req.user._id });

  res.send(tracks);
});

router.post('/tracks', async(req, res) => {
  const { locations, speedMoy, date, time} = req.body;

  if (!speedMoy || !locations || !date || !time) {
    return res.status(422).send({ error: 'Must provide all args' });
  }
  
  try {
    const track = new Track({ speedMoy, locations, userId: req.user._id, date, time });
    await track.save();
    res.send(track);
  } catch (err) {
    res.status(422).send({ error: err.message });
  }
});

module.exports = router;