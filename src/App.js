import React from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './App.css';
//import Footer from './Footer';

const client = new W3CWebSocket('ws://coldfeetwebsocket.herokuapp.com/message');

function App() {

    function IsJsonString(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }
  

const [state, setState] = React.useState([]);

//=======on open=======
client.onopen = () => {
  console.log('WebSocket Client Connected');
};
//======on message=====
client.onmessage = (message) => {
  if(IsJsonString(message.data)){
  var msg = JSON.parse(message.data);
  msg.key=msg.measurement.measurementTime;
  
  setState(prevValue=>{
    if(prevValue.length>7){
      prevValue.pop();
    }
    return[msg, ...prevValue]
  });
}
}
//======get time=======
function getTime(time){
  return new Date((time)*1000).toLocaleTimeString("sv-SE")
}


return (
    <div className="App">
    
      <div className="content">
      <p>Device Name</p>
          <p>Location</p>
          <p>Temperature</p>
          <p>Humidity</p>
          <p>Time</p>
      {state.map(item=>{
        return(
          <div className="item-container" key={item.key}>
          <p>{item.device.deviceName}</p>
          <p>{item.location.locationName}</p>
          <p>{item.measurement.temperature}°C</p>
          <p>{item.measurement.humidity}%</p>
          <p>{getTime(item.measurement.measurementTime)}</p>


          </div>
          )
        })}
      </div>
      <div className="footer">
        <p id="footer">Created by Ahmed Alhasani, Jonathan Koitsalu, Vincent Palma, Daniel Mini Johansson</p>
      </div>
    
      </div>
    
  );
}

export default App;
