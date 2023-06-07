import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react/cjs/react.development'

// Forms.js is the one you want to use! Ignore the DataFetch files

export default function Forms() {
    const [formData, setFormData] = useState({ latitude: "", longitude: "", })
    const [posts, setPosts] = useState([])
    const [initial, setinitial] = useState(true)

    function handleChange(event) {
        const { name, value } = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
            }
        })
    }

    const sanityCheck = formData.latitude.length != 0 && formData.longitude.length != 0 && isNaN(formData.latitude) == false && isNaN(formData.longitude) == false && Math.abs(formData.latitude) <= 90 && Math.abs(formData.longitude) <= 180

    function handleSubmit(event) {
        if (sanityCheck) {
            event.preventDefault()
            setinitial(false)
            setPosts([])
            // submitToApi(formData)
            console.log("Below is formData")
            console.log(formData)
            axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${formData.latitude}&lon=${formData.longitude}&units=metric&appid=`)
                .then(res => {
                    const array = []
                    var formattedTime = formatTime(res.data.current.dt, res.data.timezone_offset)
                    array.push({ time: formattedTime })
                    array.push({
                        temperature: res.data.current.temp,
                        feelsLike: res.data.current.feels_like,
                        humidity: res.data.current.humidity,
                        uvIndex: res.data.current.uvi,
                        windSpeed: res.data.current.wind_speed,
                        descrip: res.data.current.weather[0].description

                    })

                    console.log(res.data)

                    array.push({
                        dailyHigh: res.data.daily[0].temp.max,
                        dailyLow: res.data.daily[0].temp.min,
                        dailySunrise: formatTime(res.data.daily[0].sunrise, res.data.timezone_offset),
                        dailySunset: formatTime(res.data.daily[0].sunset, res.data.timezone_offset)
                    })

                    array.push({
                        tmrwMax: res.data.daily[1].temp.max,
                        tmrwMin: res.data.daily[1].temp.min,
                        rainProbability: res.data.daily[1].pop,
                        maxUVI: res.data.daily[1].uvi,
                        description: res.data.daily[1].weather[0].description,
                        tmrwWindSpeed: res.data.daily[1].wind_speed,
                        tmrwPressure: res.data.daily[1].pressure

                    })


                    array.push({
                        tmrwMax2: res.data.daily[2].temp.max,
                        tmrwMin2: res.data.daily[2].temp.min,
                        rainProbability2: res.data.daily[2].pop,
                        maxUVI2: res.data.daily[2].uvi,
                        description2: res.data.daily[2].weather[0].description,
                        tmrwWindSpeed2: res.data.daily[2].wind_speed,
                        tmrwPressure2: res.data.daily[2].pressure


                    })




                    // (time) temp[0] = {time: xxx}
                    // (current temp) temp[1] = {temperature: xxx , feelsLike: xxx , humidity: xxx , uvIndex: xxx , windSpeed: xxx , descrip: xxx}
                    // (daily temp) temp[2] = {daiyHigh: xxx , dailyLow: xxx , dailySunrise: xxx , dailySunset: xxx}
                    // (tomorrow) temp[3] = {tmrwMax: xx , tmrwMin: xx ,}
                    // (day after tomorrow) temp[4] = 
                    setPosts((prevStates) => {
                        // console.log(res.data)
                        return (array)
                    })
                })
        }
        else {
            alert('Invalid Coordinates! \n\n I only accept positive/negative decimals, ranging from -90 to 90 for latitude and -180 to 180 for longitude. \n\n Please click "OK" and try again.')
        }


    }

    let now = new Date()

    function formatTime(val1, val2) {
        let more = now.getTimezoneOffset() * 60
        let unix_timestamp = val1 + val2 + more
        var date = new Date(unix_timestamp * 1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
    }





    return (Object.keys(posts).length == 0 ?
        (initial == true ?
            <div className='loading'>
                <form onSubmit={handleSubmit}>
                    <h1>Type in the coordinates (latitude and longitutde) of any location and learn more about the weather over there!</h1>
                    <h2>Click <a href='https://www.latlong.net/' target={'_blank'}>Here</a> for a Latitude and Longitude Finder!</h2>
                    <input
                        type="text"
                        placeholder="LATITUDE"
                        onChange={handleChange}
                        name="latitude"
                        value={formData.latitude}
                    />
                    <input
                        type="text"
                        placeholder="LONGITUDE"
                        onChange={handleChange}
                        name="longitude"
                        value={formData.longitude}
                    />
                    <button>Go!</button>
                </form>
            </div>
            :
            <h1 className='loading2'>LOADING.......</h1>
        )
        :
        <div className='loaded'>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="LATITUDE"
                    onChange={handleChange}
                    name="latitude"
                    value={formData.latitude}
                />
                <input
                    type="text"
                    placeholder="LONGITUDE"
                    onChange={handleChange}
                    name="longitude"
                    value={formData.longitude}
                />
                <button>Submit</button>
            </form>
            <h1>Latitude: {parseFloat(formData.latitude).toFixed(2)}   Longitude: {parseFloat(formData.longitude).toFixed(2)}</h1>
            <div className='parentContainer'>
                <div className='child1'>
                    <h1>Weather for Today, {(now.toLocaleString('default', { month: 'long' })).substring(0, 3)}. {now.getDate()}, {now.getFullYear()}</h1>
                    <h2>Local Time: {posts[0].time}</h2>
                    {/* <h2>Current Temperature: {posts[1].temperature}°C ({Math.round((posts[1].temperature*9/5+32)*100)/100}°F)</h2> */}
                    <h2>Current Temperature: {posts[1].temperature}°C</h2>
                    <h2>Description: {posts[1].descrip}</h2>
                    <h2>Humidity: {posts[1].humidity}%</h2>
                    <h2>Current UV Index: {posts[1].uvIndex}</h2>
                    <h2>Wind Speed: {(posts[1].windSpeed * 3.6).toFixed(2)} km/h</h2>

                    <h2>Daily High: {posts[2].dailyHigh}°C</h2>
                    <h2>Daily Low: {posts[2].dailyLow}°C</h2>
                    <h2>Sunrise Time: {posts[2].dailySunrise}</h2>
                    <h2>Sunset Time: {posts[2].dailySunset}</h2>
                </div>
                <div className='child2'>
                    <h1>Weather for Tomorrow, {(now.toLocaleString('default', { month: 'long' })).substring(0, 3)}. {now.getDate() + 1}, {now.getFullYear()}</h1>
                    <h2>High: {posts[3].tmrwMax}°C</h2>
                    <h2>Low: {posts[3].tmrwMin}°C</h2>
                    <h2>Description: {posts[3].description}</h2>
                    <h2>Probability of Percipitation: {posts[3].rainProbability * 100}%</h2>
                    <h2>Highest UV Index: {posts[3].maxUVI}</h2>
                    <h2>Wind Speed:{posts[3].tmrwWindSpeed * 3.6} km/h</h2>
                    <h2>Pressure (Sea Level):{posts[3].tmrwPressure} hPa</h2>

                </div>
                <div className='child3'>
                    <h1>Weather for {(now.toLocaleString('default', { month: 'long' })).substring(0, 3)}. {now.getDate() + 2}, {now.getFullYear()}</h1>
                    <h2>High: {posts[4].tmrwMax2}°C</h2>
                    <h2>Low: {posts[4].tmrwMin2}°C</h2>
                    <h2>Description: {posts[4].description2}</h2>
                    <h2>Probability of Percipitation: {posts[4].rainProbability2 * 100}%</h2>
                    <h2>Highest UV Index: {posts[4].maxUVI2}</h2>
                    <h2>Wind Speed:{posts[4].tmrwWindSpeed2 * 3.6} km/h</h2>
                    <h2>Pressure (Sea Level):{posts[4].tmrwPressure2} hPa</h2>

                </div>
            </div>
        </div>


    )
}
