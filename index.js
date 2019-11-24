const request = require('request-promise');
exports.handler = async (event) => {
  
  // バスのルートと停留所をDialogFlowの変数から取り出す
  const body = JSON.parse(event.body);
    const busline = body.queryResult.parameters.busline;
    const busstop = body.queryResult.parameters.busstop;
  // 返信用のテキストを準備
    var speechText = '';
  // 返信用テキストを取得
  await regist(busline, busstop)
      .then(val => {
          speechText = val;
  });
  // エラーが起きたときの処理
  if (speechText === "miss") {
      speechText = "エラーが起きています、もう一度打ち直してね！";
  }
  
  // Dialogflowへのリクエストを生成
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
// gasへ投げるURLを取得してgasにrequestで投げる
const regist = (busline, busstop) => {
      let url = process.env.Gas + "?busline=" + busline + "&busstop=" + busstop;
      // 2バイト文字を扱うためエンコード処理
      url = encodeURI(url);
      return request(url);
  };