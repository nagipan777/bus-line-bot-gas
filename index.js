const request = require('request-promise');
exports.handler = async (event) => {
  
  const body = JSON.parse(event.body);
    const busline = body.queryResult.parameters.busline;
    console.log(busline);
    const busstop = body.queryResult.parameters.busstop;
    console.log(busstop);
    var speechText = '';

  await regist(busline, busstop)
      .then(val => {
          speechText = val;
  });
  
  if (speechText === "miss") {
      speechText = "エラーが起きています、もう一度打ち直してね！";
  }
  
  
  return new Promise(function(resolve) {
      const responseJson = JSON.stringify({
        "fulfillmentText": "",
        "followupEventInput": {
          "name": "FINISH",
          "languageCode": "ja-JP",
          "parameters": {
            "message": speechText
          }
        }
      });
      var response = {
        statusCode: 200,
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: responseJson
      };
      resolve(response);
    });
};

const regist = (busline, busstop) => {
      let url = process.env.Gas + "?busline=" + busline + "&busstop=" + busstop;
      url = encodeURI(url);
      console.log(url);
      return request(url);
  };