// weather.js
// Created by: Bruce Elgort / Spring 2023
// Student: Colin Machajewski

// Function to get Latitude and Longitude from the OpenWeather API

// Declare Variables
const weatherContent = document.querySelector('#weather')
const errorBox = document.querySelector('#error')
const daysRow = document.querySelector('#daysRow')
const API_KEY = 'YOURKEYHERE' 

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getLatLon = (data,zipCode) => {
    // Check to see if an error occurred
    if (data.cod == '400' || data.cod == '404' || data.cod == '401' || zipCode.trim() == '') {
        // Show the initially hidden div
        errorBox.style.display = 'block'
        errorBox.innerHTML = 'Please enter a valid Zip Code'
        return; // exit
    } else {
        // return an array of the latitude and longitude
        return [data.lat,data.lon]
    }
}

// Function for formatting all of the various time-related variables
function getTime(data) {
        const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        let date = new Date(data.dt * 1000)
        let hour = date.getHours()
        let minute = date.getMinutes()
        let currMin = String(minute).length == 1 ? `0${minute}` : minute
        let currHour = hour > 12 ? hour - 12 : hour == 0 ? 12 : hour
        let amPm = hour > 12 ? 'PM' : 'AM'

        // Collect all of the data in a convenient object
        let dayObj = {
            "month": months[date.getMonth()],
            "weekday": weekDays[date.getDay()],
            "day": date.getDate(),
            "time": `${currHour}:${currMin}<span class='amPm'>${amPm}</span>`
        }
        // Return the data
        return dayObj
}

// Parse and format data from the API
function getData (data) {
        let main = data.main
        let weather = data.weather[0]
        let wind = data.wind
        let pressure = (main.pressure / 33.863886666667).toFixed(2)
        let deg = wind.deg

        // Calculate the wind compass direction based on degrees
        let direction = deg >= 337 || deg < 22 ? "N" : deg >= 22 && deg < 56 ? "NE" : deg >= 56 && deg < 112 ? "E" : deg >= 112 && deg < 146 ? "SE" : deg >= 146 && deg < 202 ? "S" : deg >= 202 && deg < 247 ? "SW" : deg >= 247 && deg < 292 ? "W" : "NW"

        // Collect all of the data into an object
        let dataObj = {
            "desc": weather.description,
            "icon": `${weather.icon}.png`,
            "icon2x": `${weather.icon}@2x.png`,
            "low": `${Math.round(main.temp_min)}<span>°F</span>`,
            "high": `${Math.round(main.temp_max)}<span>°F</span>`,
            "humidity": `${main.humidity}%`,
            "windSp": `${wind.speed}mph`,
            "windDir": direction,
            "deg": deg,
            "pressure": `${pressure}inHg`,
            "feels": `${Math.round(main.feels_like)}<span>°F</span>`,
            "temp": `${Math.round(main.temp)}<span>°F</span>`
        }
        // Return the data
        return dataObj
}

// Function to get the current weather given the data and zip code
function getCurrentWeather (data) {
    // Check to see if the OpenWeather API returned an error
    if (data.cod == '400' || data.cod == '404' || data.cod == '401') {
        // show the initially hidden div
        weatherContent.style.display = 'block'
        weatherContent.innerHTML = 'Please enter a valid Zip Code'
        return 
    }
    document.querySelector('.title') ? document.querySelector('.title').remove() : ''
    document.querySelector('#error').style.display = 'none'
    let dayDate = getTime(data)
    let dayData = getData(data)
    
    // Add top data
    const icon = document.createElement('img') 
    icon.src = `images/${dayData.icon}` 
    icon.alt = `Right Now: ${dayData.desc}`
    weatherContent.append(icon) 
    let h3 = document.createElement('h3')
    h3.innerHTML = dayData.desc
    h3.classList = 'desc'
    weatherContent.appendChild(h3)
    let todayRow = document.createElement('div')

    // Create center row
    todayRow.classList = 'todayRow'
    weatherContent.appendChild(todayRow)
    let div = document.createElement('div')

    // left data
    div.classList = 'todayLeft'
    todayRow.appendChild(div)
    let p = document.createElement('p')
    p.classList = 'sideTemp'
    p.innerHTML = `<span>Low</span> <span>${dayData.low}</span>`
    div.appendChild(p)
    p = document.createElement('p')
    p.classList = 'sideSub'
    p.innerHTML = `<span>Pressure</span> <span>${dayData.pressure}<span>`
    div.appendChild(p)

    // Center data
    div = document.createElement('div')
    div.classList = 'todayCenter'
    todayRow.appendChild(div)
    let h4 = document.createElement('h4')
    h4.innerHTML = dayData.temp
    h4.classList = 'temp'
    div.appendChild(h4)
    p = document.createElement('p')
    p.classList = 'feels'
    p.innerHTML = `Feels like <span>${dayData.feels}</span>`
    div.appendChild(p)
    p = document.createElement('p')
    let i = document.createElement('i')
    i.classList = 'fa-solid fa-arrow-up'
    i.style.transform = `rotate(${dayData.deg}deg)`
    p.appendChild(i)
    p.innerHTML += ` ${dayData.windDir} ${dayData.windSp}`
    div.appendChild(p)

    // right data
    div = document.createElement('div')
    div.classList = 'todayRight'
    todayRow.appendChild(div)
    p.classList = 'sideTemp'
    p.innerHTML = `<span>High</span> <span>${dayData.high}</span>`
    div.appendChild(p)
    p = document.createElement('p')
    p.classList = 'sideSub'
    p.innerHTML = `<span>Humidity</span> <span>${dayData.humidity}</span>`
    div.appendChild(p)
    
    // Bottom data
    let h5 = document.createElement('h5')
    h5.innerHTML = `${dayDate.month} ${dayDate.day}`
    h5.classList = 'date'
    weatherContent.appendChild(h5)
    h5 = document.createElement('h5')
    h5.innerHTML = dayDate.time
    h5.classList = 'time'
    weatherContent.appendChild(h5)
    
    weatherContent.style.display = 'flex'
    console.log(data)
    let h6 = document.createElement('h6')
    h6.innerHTML = `Right now in ${data.name}`
    h6.classList = 'title'
    weatherContent.after(h6)
}

// This function must be used to display the 5 day weather forecast
function getWeatherForecast (data) {
    if (data.cod == '400' || data.cod == '404' || data.cod == '401') {
        // show the initially hidden div
        errorBox.style.display = 'flex'
        errorBox.innerHTML = 'Could not get forecast'
        return 
    }
    const dataChunks = data.list
    daysRow.style.display = 'flex'
    daysRow.innerHTML = ''
    let days = []
    let dayNum
    let dayData

    // Break apart and process each day's data
    dataChunks.forEach((chunk) => {
        let date = new Date(chunk.dt * 1000)
        let day = date.getDate()
        
        // Calculate how many total days are included
        if (day != dayNum) {
            !dayData ? '' : days.push(dayData)
            dayNum = day
            dayData = []
        }
        dayData.push(chunk)
    })

    // Process each of the days
    for (let i = 0; i < days.length; i++) {
        let item = days[i]
        let div = document.createElement('div')
        div.id = 'display-' + i
        div.classList = 'dayBox'
        // Adds a class of "last" to the last day summary box for CSS to grab
        i == days.length - 1 ? div.classList.add('last') : ''
        daysRow.appendChild(div)
        
        // Create the box that contains the hourly data for each day
        let dataDiv = document.createElement('div')
        dataDiv.id = 'data-' + i
        dataDiv.classList = 'dayDataBox closed'
        daysRow.appendChild(dataDiv)

        // Add an event listener to each row to expand the hourly display
        div.addEventListener('click', () => {
            const allDays = document.querySelectorAll('.dayBox')

            // Remove the 'active' class from all boxes
            allDays.forEach((box) => {
                box.classList.remove('active')
            })

            // Find the associated hour box and change it's status of closed or open
            let target = document.querySelector('#data-' + i)
            target.classList.toggle('closed')

            // Only add the active class to the clicked box if the associated hourly box was opened
            !target.classList.contains('closed') ? document.querySelector('#display-' + i).classList.add('active') : ''
            
            const allDaysHourly = document.querySelectorAll('.dayDataBox')
            
            // Check each of the hourly boxes
            allDaysHourly.forEach((box) => {
                // Adds a data attribute for the number of entries so CSS can assign the correct height
                // Then closes any other hourly boxes that may have been open
                box.id == 'data-' + i ? target.dataset.count = days[i].length : !box.classList.contains('closed') ? box.classList.add('closed') : ''
            })

            // Adds or removes a class that squishes down all other daily rows when an hourly box is expanded
            // Timer allows for smoother animation
            setTimeout(()=>{
                allDays.forEach((box)=>{
                    let currBox = document.querySelector(`#display-${i}`)
                    if (!currBox.classList.contains('active')) {
                        setTimeout(() => {
                            box.classList.remove('squish')
                        }, 350)
                    } else {
                        !target.classList.contains('closed') ? box.classList.add('squish') : ''
                    }
                })
            }, 50)
        }) 

        // Event listener for the hourly box to close if clicked
        dataDiv.addEventListener('click', () =>  {
            let currDiv = document.querySelector(`#data-${i}`)
            let allDays = document.querySelectorAll('.dayBox')
            currDiv.classList.add('closed')
            allDays.forEach((element) => {
                element.classList.remove('squish')
                element.classList.remove('active')
            })
        })

        // Now populate all of the boxes with their data
        singleDay(item, i)
    }
}

// Function to parse and assign data to each box
function singleDay(weatherData, index) {
    // Get a handle on each respective box for the day being processed
    const dayDiv = daysRow.querySelector('#display-' + index)
    const dayDataDiv = daysRow.querySelector('#data-' + index)

    // Get the time based data
    const summaryTime = getTime(weatherData[0])
    
    // Create the top portion of the daily data
    const sumTop = document.createElement('div')
    sumTop.classList = 'summaryTop'
    sumTop.innerHTML += `<h2><span>${summaryTime.month}</span><span class="day">${summaryTime.day}</span></h2><h3>${summaryTime.weekday}</h3>`
    
    // Create the bottom portion
    const sumBot = document.createElement('div')
    sumBot.classList = 'summaryBottom'
    const loDiv = document.createElement('div')
    loDiv.classList = 'low'
    loDiv.innerHTML = '<p>Low</p>'
    sumBot.appendChild(loDiv)
    const hiDiv = document.createElement('div')
    hiDiv.innerHTML = '<p>High</p>'
    hiDiv.classList = 'high'
    sumBot.appendChild(hiDiv)

    // For the summary, it's a full day, look at the middle entry, if the first entry is partial look at the first entry, and if the last day is partial, look at the last entry
    let summaryData = getData(weatherData.length == 8 ? weatherData[4] : index == 0 ? weatherData[0] : weatherData[-1])

    // Get the associated image
    // I created custom art and gave the files the same names the API uses
    const icon = document.createElement('img')   
    icon.src = `images/${summaryData.icon}`
    icon.alt = summaryData.desc
    sumTop.appendChild(icon)

    // Make each day summary
    let high
    let low

    // Process each hourly entry
    weatherData.forEach((item) => {
        let dayTime = getTime(item)
        let main = item.main
        let data = getData(item)
        
        // Find the high and low of each day
        !high ? high = main.temp_max : ''
        !low ? low = main.temp_min : ''
        main.temp_max > high ? high = main.temp_max : ''
        main.temp_min < low ? low = main.temp_min : ''

        // Create the elements for the associated data
        let hourDiv = document.createElement('div')
        let hourImg = document.createElement('img')
        hourImg.src = `images/${data.icon}`
        hourImg.alt = `${dayTime.time} - ${data.desc}`
        hourDiv.appendChild(hourImg)
        let p = document.createElement('p')
        p.innerHTML = `${dayTime.time} <br>${data.desc}`
        hourDiv.appendChild(p)
        p = document.createElement('p')
        p.innerHTML = `Low <br>${data.low}`
        hourDiv.appendChild(p)
        p = document.createElement('p')
        p.innerHTML = `High <br>${data.high}`
        hourDiv.appendChild(p)
        p = document.createElement('p')
        p.innerHTML = `Humidity <br>${data.humidity}`
        hourDiv.appendChild(p)
        p = document.createElement('p')
        let i = document.createElement('i')
        i.classList = 'fa-solid fa-arrow-up'
        i.style.transform = `rotate(${data.deg}deg)`
        p.appendChild(i)
        p.innerHTML += ` ${data.windDir} ${data.windSp}`
        hourDiv.appendChild(p)
        p = document.createElement('p')
        p.innerHTML = `Pressure <br>${data.pressure}`
        hourDiv.appendChild(p)
        dayDataDiv.appendChild(hourDiv)
    })

    // Assign the calculated values of high and low temps for the day
    loDiv.innerHTML += `${Math.round(low)}<span>°F</span>`
    hiDiv.innerHTML += `${Math.round(high)}<span>°F</span>`

    // Append the summary data
    dayDiv.appendChild(sumTop)
    dayDiv.appendChild(sumBot)
}
window.addEventListener('load', () => {
document.querySelector('#getWeather').addEventListener('click', () => {
    weatherContent.innerHTML = '' // clear out prior results
    let zipCode = document.querySelector('#zip').value
        
    // First call the geolocation API to get the latitude and longitude of the zip code
    let url = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCode},US&appid=${API_KEY}`
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Call the getLatLon function which returns an array
            const geo = getLatLon(data,zipCode)
            
            // Now get current weather data
            url = `http://api.openweathermap.org/data/2.5/weather?lat=${geo[0]}&lon=${geo[1]}&appid=${API_KEY}&units=imperial`
            forecast = `http://api.openweathermap.org/data/2.5/forecast?lat=${geo[0]}&lon=${geo[1]}&appid=${API_KEY}&units=imperial`
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    // Call getWeather function
                    getCurrentWeather(data,geo[0],geo[1])
                }).catch((e) => {
                console.log(`This error occurred: ${e}`)
                })
            fetch(forecast)
                .then(response=>response.json())
                .then(result=>{
                    getWeatherForecast(result,geo[0],geo[1])
                }).catch((e) => {
                    console.log(`This error occurred: ${e}`)
                })
        }).catch((e) => {
            console.log(`This error occurred: ${e}`)
        })
    })

});