
const { check, validationResult } = require('express-validator/check');
const inside = require('point-in-polygon');
const NodeGeocoder = require('node-geocoder');
 
apis = {};

apis.get_outlet = function(req, res, next){
    

    let address = req.body.address;  //Linzer Straße 7, Vienna, Austria

    let geocoder_options = {
        provider: 'google',
        httpAdapter: 'https', // Default
        apiKey: 'AIzaSyBv6Yw9043ThP-2jTzSxUDUD7Y1-1OGV6M', // api key in .env 
        formatter: null         // 'gpx', 'string', ...
    };

    let geocoder = NodeGeocoder(geocoder_options);

    // get lat long from address using google api
    // geocoder.geocode(address).then((response) => {

        // we've got let long of the provided address
        // now we'll going to check if this lat long is available in any of our ploygon

        let response = [
            {
                "formattedAddress":"Linzer Str. 7, 1150 Wien, Austria",
                "latitude":48.1914127,
                "longitude":16.3183005,
                "extra":{
                    "googlePlaceId":"EiFMaW56ZXIgU3RyLiA3LCAxMTUwIFdpZW4sIEF1c3RyaWEiGhIYChQKEgnF-bgfBKhtRxGDrWDKZR4ITRAH",
                    "confidence":0.9,
                    "premise":null,
                    "subpremise":null,
                    "neighborhood":"Wien",
                    "establishment":null
                },
                "administrativeLevels":{"level1long":"Wien","level1short":"Wien"},
                "streetNumber":"7",
                "streetName":"Linzer Straße",
                "city":"Wien",
                "country":"Austria",
                "countryCode":"AT",
                "zipcode":"1150",
                "provider":"google"
            }
        ];

        let output = '';
        let latlong = [response[0].longitude, response[0].latitude];

        //looping thourgh each object of kml and looking for polygon only
        //the loop will end on true return so no more further checks after true result 
        let mainRes = global.parsedKML['features'].some((doc, index) => {
            if(doc.geometry.type == 'Polygon'){

                let insideRes = inside(latlong, doc.geometry.coordinates[0]);
                console.log(doc.properties.name, ' ', insideRes);
                if(insideRes){
                    //get name of the outlet
                    output = doc.properties.name;
                    return true;
                }
            }
            return false;
        });

        res.send(mainRes ? output : 'not found');

    // })
    // .catch((err) => {

    //     //error happend while getting lat long from google
    //     console.log(err);
    //     res.send(err);

    // });

};

module.exports = apis;
