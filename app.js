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
const exerciseEntriesRoutes = require('./routes/exerciseEntries');
const hrvResultsRoutes = require('./routes/hrvResults');
const fetch = require('node-fetch');
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
app.use('/exerciseEntries', exerciseEntriesRoutes);
app.use('/hrvResults', hrvResultsRoutes);

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

// POLARIA VARTEN ->
// app.get('/oauth/authorize', (req, res) => {
//   const clientId = process.env.POLAR_CLIENT_ID;
//   const redirectUri = 'http://localhost:3100/oauth/callback';
//   const polarAuthUrl = `https://flow.polar.com/oauth2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
//   res.redirect(polarAuthUrl);
// });

// app.get('/oauth/callback', async (req, res) => {
//   const clientId = process.env.POLAR_CLIENT_ID;
//   const clientSecret = process.env.POLAR_CLIENT_SECRET;
//   const { code } = req.query;
//   const redirectUri = 'http://localhost:3100/oauth/callback';

//   // Exchange authorization code for access token
//   const tokenResponse = await fetch('https://polarremote.com/v2/oauth2/token', {
//     method: 'POST',
//     headers: {
//       'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
//       'Content-Type': 'application/x-www-form-urlencoded',
//     },
//     body: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(redirectUri)}`,
//   });

//   if (tokenResponse.ok) {
//     const tokenData = await tokenResponse.json();
//     const accessToken = tokenData.access_token;
//     const refreshToken = tokenData.refresh_token;
    

//     // Use access token to fetch user ID
//     const userResponse = await fetch('https://www.polaraccesslink.com/v3/users', {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//       },
//     });

//     if (userResponse.ok) {
//       const userData = await userResponse.json();
//       const userId = userData.polar_user.id;

//       // Store accessToken, refreshToken, and userId in your database or session
//       // For this example, we'll store them in cookies
//       res.cookie('polarAccessToken', accessToken);
//       res.cookie('polarRefreshToken', refreshToken);
//       res.cookie('polarUserId', userId);

//       res.redirect('/');
//     } else {
//       res.status(500).send('Failed to fetch user ID');
//     }
//   } else {
//     const errorData = await tokenResponse.json();
//     console.log('Token request error:', errorData);
//     res.status(500).send('Failed to obtain access token');
//   }
// });

// // Add this route to use the stored access token and user ID
// app.get('/api/daily-steps', async (req, res) => {
//   try {
//     const token = req.cookies.polarAccessToken;
//     const userId = req.cookies.polarUserId;

//     const response = await fetch(`https://www.polaraccesslink.com/v3/daily-activity/${userId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//     });

//     if (response.ok) {
//       const activityData = await response.json();
//       const steps = activityData['activity-log'].steps;
//       res.json({ steps });
//     } else {
//       res.status(response.status).json({ message: 'Failed to fetch daily steps from Polar' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'An error occurred while fetching daily steps', error });
//   }
// });

// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong.');
// });

// module.exports = app;
