
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const morgan = require('morgan');
const path = require('path');
const tj = require('@mapbox/togeojson');
const DOMParser = require('xmldom').DOMParser;
const fs = require('fs');
const dotenv = require('dotenv');

const app = express();
const outlet = require('./app/outlet'); // Imports routes for the products


dotenv.config({path: '.env'});
console.log(process.env.GOOGLE_API_KEY);
//For the purpose I'm parsing this file on app init, 
// other wise it will be parse by some event like kml file change event
var kml = new DOMParser().parseFromString(fs.readFileSync('DeliveryAreas.kml', 'utf8'));
global.parsedKML = tj.kml(kml);


//Making /public folder static (/public will be the root of all files inside public)
app.use(express.static(__dirname + '/public'));

//Validation middleware
app.use(expressValidator());

//Converting body into json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));




//Using routers from multiple files and folders
// app.use('/auth', auth);
// app.use('/product', auth_controller.check, product);
app.use('/outlet', outlet);




let port = 1234;
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
    console.log('Production Mode ', process.env.pro);
});

