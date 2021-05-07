const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const upload = require('../middlewares/upload');
const gfs = require('../index');
const router = express.Router();

router.post('/modifyUser', async (req, res) => {
  const { email, password, name, dateOfBirth, gender, idProfilImage } = req.body;
  const user = req.user;
  if(email && email != ""){
    user.email = email;
  }
  if(password && password != ""){
    user.password = password;
  }
  if(name && name != ""){
    user.name = name;
  }
  if(dateOfBirth){
    user.dateOfBirth = dateOfBirth;
  }
  if(gender && gender != ""){
    user.gender = gender;
  }
  if(idProfilImage && idProfilImage != ""){
    user.idProfilImage = idProfilImage;
  }

  try {
    await user.save();
    return res.status(200).json({ message: 'Succes' });
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

router.get('/user', async (req, res) => {
  try {
    const returnUser = req.user.toJSON();
    delete returnUser.password;
    delete returnUser.__v;
    return res.send(returnUser);
  } catch (error) {
    return res.status(422).send(error.message);
  }
});

router.get('/image', async (req, res) => {
  try {
    const ObjectID = mongoose.Types.ObjectId;
    req.app.locals.gfs.find({ _id: ObjectID(req.query.id) }).toArray((err, files) => {
      if(!files[0] || files.length === 0) {
        return res.status(200).json({
          succes: false,
          message: 'No files available'
        });
      } else {
        req.app.locals.gfs.openDownloadStream(ObjectID(req.query.id)).pipe(res);
      }
    });
  } catch (err) {
    return res.send(`Error when trying get image: ${err}`);
  }
});

router.post('/image', async (req, res) => {
  try {
    await upload(req, res);

    console.log(req.file);
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }

    return res.send(req.file.id);
  } catch (error) {
    return res.send(`Error when trying upload image: ${error}`);
  }
});

module.exports = router;