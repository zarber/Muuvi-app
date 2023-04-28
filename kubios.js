'use strict';

require('dotenv').config();
const userAgent = 'Muuvi KubiosTest';

const login = async () => {
const cookie = 'muuviRandomRnadomRandomRan';
const myHeaders = {Cookie: `XSRF-TOKEN=${cookie}`, 'User-Agent': userAgent};
const fetch = require('node-fetch');
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


const data = async () => {
const fs = require('fs');  
const token = await login();
const myHeaders = { Authorization: 'Bearer '+ token, 'User-Agent': userAgent };
const response = await fetch('https://analysis.kubioscloud.com/v2/result/self?types=readiness&daily=yes&from=2023-01-22T00%3A00%3A00%2B00%3A00&to=2023-02-04T23%3A59%3A59%2B00%3A00', { headers: myHeaders });
const json = await response.json();
console.log('json', json);
const jsonresults = json['results'];
console.log(jsonresults);


const { MongoClient } = require('mongodb');

//Connection Mongodb URI from env-file
const uri = process.env.MONGO_URI;

//Creating a new MongoClient
const client = new MongoClient(uri);

//Connecting to the Mongodb server
client.connect().then(async () => {
  try {
    // Selecting the database and collection
    const db = client.db('Muuvi');
    const collection = db.collection('hrv_results');
    //Get selected data from jsonresults
    for(let i = 0; i < jsonresults.length; i++) {
      const date = jsonresults[i].daily_result;
      const readiness = jsonresults[i].result.readiness;
      const stress = jsonresults[i].result.stress_index;
      const result = await collection.insertOne({date, readiness, stress});
      console.log(`Lisätty ${result.insertedId}`);
    }
    // Insert the document into the collection
    // const result = await collection.insertMany(jsonresults);
    // console.log(`Lisätty ${result.insertedCount} tiedostoa`);
    } catch (error) {
      console.error(error);
    } finally {
      // Close the client
      client.close();
    }
  }).catch(error => console.error(error));
};

data();
 