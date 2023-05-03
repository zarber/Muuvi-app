require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
let fetch;
(async () => {
  fetch = await import('node-fetch').then(module => module.default);
})();

const app = express();

app.use(cookieParser());

app.get('/oauth/authorize', (req, res) => {
  const clientId = process.env.POLAR_CLIENT_ID;
  const redirectUri = 'http://localhost:4000/oauth/callback';
  const polarAuthUrl = `https://flow.polar.com/oauth2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  console.log(polarAuthUrl);
  res.redirect(polarAuthUrl);
});

app.get('/oauth/callback', async (req, res) => {
  const clientId = process.env.POLAR_CLIENT_ID;
  const clientSecret = process.env.POLAR_CLIENT_SECRET;
  console.log('Received query:', req.query);

  const { code } = req.query;
  const redirectUri = 'http://localhost:4000/oauth/callback';

  console.log('Received code:', code);

  const tokenResponse = await fetch('https://polarremote.com/v2/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
  });

  const tokenData = await tokenResponse.json();
  console.log(tokenData);
  console.log('Token response status:', tokenResponse.status);


  if (tokenResponse.ok) {
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    const userResponse = await fetch(`https://www.polaraccesslink.com/v3/users/${tokenData.x_user_id}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });    
    console.log('User response status:', userResponse.status);

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('User data:', userData);
      const userId = userData['polar-user-id'];

      res.cookie('polarAccessToken', accessToken);
      res.cookie('polarRefreshToken', refreshToken);
      res.cookie('polarUserId', userId);

      res.redirect('/');
    } else {
      res.status(500).send('Failed to fetch user ID');
    }
  } else {
    console.log('Error:', tokenData);
    res.status(500).send('Failed to obtain access token');
  }
});

  
  app.get('/', (req, res) => {
    res.send('Welcome! You have successfully authenticated with the Polar API.');
  });
  

app.listen(process.env.PORT, () => {
    console.log(`Listening for requests on port ${process.env.PORT}`);
});

app.get('/daily-steps', async (req, res) => {
  const accessToken = req.cookies.polarAccessToken;
  const userId = req.cookies.polarUserId;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const startDate = yesterday.toISOString().split('T')[0].replace(/-/g, '');
  const endDate = today.toISOString().split('T')[0].replace(/-/g, '');

  try {
    const dailyActivityResponse = await fetch(`https://www.polaraccesslink.com/v3/users/${userId}/activity-summary?from=${startDate}&to=${endDate}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (dailyActivityResponse.ok) {
      const dailyActivityData = await dailyActivityResponse.json();
      console.log('Daily activity data:', dailyActivityData);

      const steps = dailyActivityData['activity-summary'][0]?.steps;
      res.send(`Daily steps: ${steps}`);
    } else {
      console.log('Daily activity response status:', dailyActivityResponse.status);
      console.log('Daily activity response text:', await dailyActivityResponse.text());
      res.status(500).send('Failed to fetch daily activity data');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching daily activity data');
  }
});
