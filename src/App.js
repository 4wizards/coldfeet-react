import React from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import axios from 'axios';
import {ResponsiveContainer, LineChart, Tooltip, XAxis, Line, YAxis} from 'recharts';

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
      list:[],
      reverse:[]
    });
if(state.reload){
  axios.get('http://coldfeet.herokuapp.com/api/getvalues/7')
      .then(function (response) {
        const data = response.data;
        data.forEach(item => {
          item.key = item.measurementTime;
          item.time = getTime(item.measurementTime);
        })
        setState({
          list: data,
          reverse: data.slice().reverse(),
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
      msg.time=getTime(msg.measurement.measurementTime);

  
  setState(prevValue=>{
    if(prevValue.list.length>7){
      prevValue.list.pop();
    }
    var list = [msg, ...prevValue.list]
    return{
      list:list,
      reverse: list.slice().reverse()
    }
  });
}}

return (
    <div className="App">
      <div className="content">
      <div className="head">
        <h1>MVGGruppen</h1>
      </div>
    <ResponsiveContainer width="99%" aspect={3}>
     <LineChart
      width={700}
      height={200}
      data={state.reverse}
      margin={{ top: 20, right: 0, left: 10, bottom: 5 }}
    >
    <YAxis yAxisId="right" orientation="left" />
    <XAxis dataKey="time" />
    <Tooltip />
    <Line type="monotone" dataKey="temperature" stroke="#ff7300" strokeWidth={5} yAxisId="right" />
    </LineChart>
   </ResponsiveContainer>

    <Headers />
      {state.list.map(item=>{
        return(
          <div className="item-container" key={item.key}>
            <Items
              name={item.deviceName}
              location={item.locationName}
              temp={item.temperature}
              humidity={item.humidity}
              time={item.time} />
          </div>
          )
        })}
      </div>
      <Footer />
      </div>
    
  );
};

export default App;
