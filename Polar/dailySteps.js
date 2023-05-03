const express = require('express');
const fetch = require('node-fetch');
const app = express();

// this is integrated tot Polar/app.js
app.get('/api/daily-steps', async (req, res) => {
  try {
    const token = 'your_access_token';
    const userId = 'your_user_id';
    const response = await fetch(`https://www.polaraccesslink.com/v3/daily-activity/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const activityData = await response.json();
      const steps = activityData['activity-log'].steps;
      res.json({ steps });
    } else {
      res.status(response.status).json({ message: 'Failed to fetch daily steps from Polar' });
    }
  } catch (error) {
    console.error('Error fetching daily steps:', error);
    res.status(500).json({ message: 'Failed to fetch daily steps' });
  }
});
