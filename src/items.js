import React from 'react';

function items(props){
    return(
    <div>
        <p>{props.name}</p>
        <p>{props.location}</p>
        <p>{props.temp}°C</p>
        <p>{props.humidity}%</p>
        <p>{props.time}</p>
    </div>
    )
}

export default items