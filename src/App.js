import React from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './App.css';
//import Footer from './Footer';

const client = new W3CWebSocket('ws://coldfeetwebsocket.herokuapp.com/message');

function App() {

const [state, setState] = React.useState([]);

//=======on open=======
client.onopen = () => {
  console.log('WebSocket Client Connected');
};
//======on message=====
client.onmessage = (message) => {
  var msg = JSON.parse(message.data);
  setState(prevValue=>{
    return[msg, ...prevValue]
  });
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
          <div className="item-container">
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
        <p id="footer">Created by HackeHacksmet, JokoLoko, Vincent Vega, ankDaniel</p>
      </div>
    
      </div>
    
  );
}

export default App;
