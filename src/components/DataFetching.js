import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'


function DataFetching() {
    const [posts, setPosts] = useState({})
    const [temp, settemp] = useState([])
    const [long, setlong] = useState("-114.07")
    const [lat, setlat] = useState("51.05")


    function search(event) {
        // event.preventDefault()
        if (event.key === "Enter") {
            axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}1&lon=${long}&units=metric&appid=d892c42d140f0fbdfeb4ddc6b89de977`)
                .then(res => {
                    setPosts((prevStates) => {
                        return (
                            res.data
                        )
                    })
                })
        }
    }


    // useEffect( ()=> {

    //     if(temp.length==0){
    //         axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}1&lon=${long}&units=metric&appid=d892c42d140f0fbdfeb4ddc6b89de977`)
    //         .then(res => {
    //             setPosts( (prevStates)=>{
    //                 return(
    //                     res.data
    //                     )
    //                 })
    //             })
    //             .catch( (err)=> {
    //                 console.log(err)
    //             })
    //         }

    // }, [])

    function handleLong(event) {
        setlong(event.target.value)
    }

    function handleLat(event) {
        setlat(event.target.value)
    }


    // (time) temp[0] = {time: xxx}
    // (temp) temp[1] = {temperature: xxx , weatherID: xxx , descrip: xxx}

    function formatTime(val1, val2) {
        let more = new Date().getTimezoneOffset() * 60
        let unix_timestamp = val1 + val2 + more
        var date = new Date(unix_timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
    }


    function ex() {
        const array = []
        array.push({ lat: posts.lat, lon: posts.lon })

        var formattedTime = formatTime(posts.current.dt, posts.timezone_offset)
        array.push({ time: formattedTime })
        array.push({ temperature: posts.current.temp, descrip: posts.current.weather[0].description })

        if (temp.length == 0) {
            settemp(array)
        }
        console.log(posts)
        console.log("ABOVE IS FULL THING (posts), BELOW IS PUSHED (temp)")
        console.log(temp)
    }
    setTimeout(ex, 500)


    return temp.length == 0 ? <div>
        <form>
            <input type={"text"} placeholder='Longitude' onChange={handleLong}></input>
            <input type={"text"} placeholder='Latitude' onChange={handleLat} onKeyPress={search}></input>
            <h1>Long is {long}</h1>
            <h1>Lat is {lat}</h1>
        </form>
    </div> : (
        <div>
            <form>
                <input type={"text"} placeholder='Longitude' onChange={handleLong}></input>
                <input type={"text"} placeholder='Latitude' onChange={handleLat} onKeyPress={search}></input>
                <h1>Long is {long}</h1>
                <h1>Lat is {lat}</h1>
            </form>
            <h2>{temp[1].time}</h2>
            <h2>{temp[2].temperature}°C ({Math.round((temp[2].temperature * 9 / 5 + 32) * 100) / 100}°F)</h2>
            <h2>{temp[2].descrip}</h2>
            {/* <li style={{display: temp[0].temperature==0 ? 'none' : 'block'}}>{temp[0].temperature}</li> */}
        </div>
    )
}

export default DataFetching
