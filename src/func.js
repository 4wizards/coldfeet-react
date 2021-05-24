function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function getTime(time){
    return new Date((time)*1000).toLocaleTimeString("sv-SE")
  }

export {IsJsonString , getTime}