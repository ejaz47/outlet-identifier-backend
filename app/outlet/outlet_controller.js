
const { check, validationResult } = require('express-validator/check');
const inside = require('point-in-polygon');
const NodeGeocoder = require('node-geocoder');
 
apis = {};

apis.get_outlet = function(req, res, next){
    
    let address = req.query.address;  //Linzer Straße 7, Vienna, Austria

    if(!address){
        res.status(400);
        res.send({error: 'address parameter not found'});
        return;
    }

    console.log(address);

    let geocoder_options = {
        provider: 'google',
        httpAdapter: 'https', // Default
        apiKey: process.env.GOOGLE_API_KEY, // api key in .env 
        formatter: null         // 'gpx', 'string', ...
    };

    let geocoder = NodeGeocoder(geocoder_options);

    // get lat long from address using google api
    geocoder.geocode(address).then((response) => {

        // we've got let long of the provided address
        // now we'll going to check if this lat long is available in any of our ploygon

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

        res.send({data: mainRes ? output : 'not found'});

    })
    .catch((err) => {

        //error happend while getting lat long from google
        console.log(err);
        res.status(500);
        res.send({error: 'somthing went wrong!'});

    });

};

module.exports = apis;
