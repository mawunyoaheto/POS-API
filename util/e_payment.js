const request = require('request')
var http = require('http');

var postheaders = {
    'Content-Type' : 'application/json',
};

const requestOptions = {
    headers: postheaders,
    url: 'https://api.reddeonline.com/v1/receive',
    method: 'POST',
    json: {},
    body: JSON.stringify({
        "amount": 1.00,
        "appid": "string",
        "clientreference": "string", 
        "clienttransid": "string",
        "description": "string", 
        "nickname": "wigal",
        "paymentoption": "MTN",
        "walletnumber": "0546773703"
    })
  };
  request(requestOptions, (err, res, body) => {
    if (err) {
      console.log(err);
    } else if (res.statusCode === 200) {
        res.send(body);
      console.log(body);
    } else {
      console.log(res.statusCode);
    }
  });
  
  