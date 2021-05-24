import React from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import axios from 'axios';

import './App.css';
import Headers from './headers';
import Footer from './footer';
import Items from './items';
import {IsJsonString, getTime} from './func'

const client = new W3CWebSocket('ws://coldfeetwebsocket.herokuapp.com/message');

function App(){
  const [state, setState] = React.useState(
    {
      reload: true,
      list:[]
    });
if(state.reload){
  axios.get('http://coldfeet.herokuapp.com/api/getvalues/7')
      .then(function (response) {
        const data = response.data;
        data.forEach(item => {item.key = item.measurementTime})
        setState({
          list: data, 
          reload: false
        });
    })
  .catch(function (error) {
    console.log(error);
  })
  .then(function () {
    console.log("axios done!")
  });
}
  client.onopen = () => {
  console.log('WebSocket Client Connected');
};

client.onmessage = (message) => {
  if(IsJsonString(message.data)){
  var msg = JSON.parse(message.data);
      msg.key=msg.measurement.measurementTime;
      msg.deviceName=msg.device.deviceName;
      msg.locationName=msg.location.locationName;
      msg.temperature=msg.measurement.temperature;
      msg.humidity=msg.measurement.humidity;
      msg.measurementTime=msg.measurement.measurementTime;
  
  setState(prevValue=>{
    if(prevValue.list.length>7){
      prevValue.list.pop();
    }
    return{
      list:[msg, ...prevValue.list]
    }
  });
}}

return (
    <div className="App">
    
      <div className="content">
     <Headers />
      {state.list.map(item=>{
        return(
          <div className="item-container" key={item.key}>
            <Items
              name={item.deviceName}
              location={item.locationName}
              temp={item.temperature}
              humidity={item.humidity}
              time={getTime(item.measurementTime)} />
          </div>
          )
        })}
      </div>
      <Footer />
      </div>
    
  );
};

export default App;
