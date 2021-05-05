require('./models/User');
require('./models/Track');
const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('./middlewares/requireAuth');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const userRoutes = require('./routes/userRoutes');

mongoose.set('useFindAndModify', false);
const app = express();

app.use(express.json());
app.use(authRoutes);
app.use(trackRoutes);
app.use(userRoutes);

const uri = 'mongodb+srv://admin:admin@cluster0.wmykm.mongodb.net/ReactCourses18484?retryWrites=true&w=majority';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true
});

let gfs;
mongoose.connection.on('connected', () => {
  gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'profileImage',
  });  
  app.locals.gfs = gfs;
  console.log('Connected to mongo instance');
});
mongoose.connection.on('error', (error) => {
  console.log('Error: ' + error);
});

module.exports = gfs;

app.listen(process.env.PORT || 3000, () => console.log('Listening port 3000'));