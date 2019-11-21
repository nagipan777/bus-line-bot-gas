function BusTimeline(busline, busstop) {
  try{  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(busline);
  var sheet_values = sheet.getRange(1,1, sheet.getLastRow(), sheet.getLastColumn()).getValues();;  
  var now = new Date();
  var nowHour = now.getHours();
  var nowMin = now.getMinutes();
  var index;
  var bus_stop_name = busstop;
  
  for(var i =1 ;i< sheet_values.length;i++){
    if(sheet_values[i][1] === busstop){
      var index = sheet_values[i][0];
      Logger.log(index);
      
    }
  }
  var recent = "なし";
  var next = "なし";
  var timelag = 0;
  for(var i= 2 ;i < sheet_values[index].length;i++){
    var time = sheet_values[index][i];
    var timeHour = time.getHours();
    var timeMin = time.getMinutes();
    
    if(recent != "なし"){
      next = formatTime2str(timeHour, timeMin); 
      break; 
    }
    if( nowHour == timeHour ){
      if(nowMin < timeMin){
        recent = formatTime2str(timeHour, timeMin);
      }
      }else if(nowHour < timeHour){
        recent = formatTime2str(timeHour, timeMin); 
      }
    }
    if (recent == "なし"){
      return "今日のバスの運行はすべて終了しました。";
    }else{
    var nowTime = formatTime2str(nowHour, nowMin);
    return "現在時刻は"+ nowTime +"です。 \n次の" + bus_stop_name +"停車のバスは、"+ recent +"に到着予定です。";
    }
  } catch(e){
  return "miss";
  }
}


function formatTime2str(hours, minutes){
    return ("0"+ hours).slice(-2) + ":" + ("0" + minutes).slice(-2);    
} 

function doGet(e){
  var res = ContentService.createTextOutput();
  var busline = e.parameter.busline;
  busline = decodeURI(busline);
  var busstop = e.parameter.busstop;
  busstop = decodeURI(busstop);
  var retval = BusTimeline(busline,busstop);
  res.setContent(retval);

  
  return res;
}
