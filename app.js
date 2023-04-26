require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { engine } = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const methodOverride = require('method-override');
const workoutRoutes = require('./routes/api/workouts');
const userRoutes = require('./routes/user');
const diaryEntriesRoutes = require('./routes/diaryEntries');
const { log } = require('console');
const spawn = require('child_process').spawn;

mongoose.set('strictQuery', true);
// express app
const app = express();

// middleware

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(cors());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const options = {
  layoutsDir: 'views/layouts/',
  defaultLayout: 'main',
  partialsDir: 'views/partials/',
  helpers: require('./helpers/hbs'),
  extname: '.hbs',
};

app.engine('.hbs', engine(options));
app.set('view engine', '.hbs');
app.set('views', './views');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/activities_and_diary', require('./routes/diaryEntries'));
app.use('/api/workouts', workoutRoutes);
app.use('/api/user', userRoutes);
app.use('/diaryEntries', diaryEntriesRoutes);

//route for javascript -files
app.use('/', express.static(__dirname + '/'));

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database');
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT || 3000);
    });
  })
  .catch((err) => {
    console.log(err);
});


app.use(express.urlencoded({ extended: true }));

'use strict';

require('dotenv').config();
const fetch = require('node-fetch');

const userAgent = 'Muuvi KubiosTest';

const login = async () => {
const cookie = 'muuviRandomRnadomRandomRan';
const myHeaders = {Cookie: `XSRF-TOKEN=${cookie}`, 'User-Agent': userAgent};
const myBody = new URLSearchParams();
myBody.set('client_id', process.env.CLIENT_ID);
myBody.set('redirect_uri', 'https://analysis.kubioscloud.com/v1/portal/login');
myBody.set('username', process.env.KUBIOS_USERNAME);
myBody.set('password', process.env.PASSWORD);
myBody.set('response_type', 'token');
myBody.set('access_type', 'openid');
myBody.set('_csrf', cookie);
const option = {
method: 'POST',
headers: myHeaders,
redirect: 'manual',
body: myBody,
};
const response = await fetch('https://kubioscloud.auth.eu-west-1.amazoncognito.com/login', option);
const location = response.headers.raw().location[0];
const token = location.substring(location.indexOf('=') + 1, location.indexOf('&'));
return token;
};

// const perso = async () => {
// const token = await login();
// const myHeaders = {Authorization: 'Bearer ' + token, 'User-Agent': userAgent};
// const response = await fetch('https://analysis.kubioscloud.com/v2/user/self', { headers: myHeaders });
// const json = await response.json();
// console.log('json', json);
// };

// perso();


// const data = async () => {
// const fs = require('fs');  
// const token = await login();
// const myHeaders = { Authorization: 'Bearer '+ token, 'User-Agent': userAgent };
// const response = await fetch('https://analysis.kubioscloud.com/v2/result/self?types=readiness&daily=yes&from=2023-01-22T00%3A00%3A00%2B00%3A00&to=2023-02-04T23%3A59%3A59%2B00%3A00', { headers: myHeaders });
// const json = await response.json();
// console.log('json', json);
// fs.writeFile("data.json", JSON.stringify(json), function(err) {
//   if (err) {
//       console.log(err);
//   }
// });
// };

// data(); 

