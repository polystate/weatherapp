const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");
let ID = 0;

async function getWeatherData(city){
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=407a1e2c2ac239ed7ea61fdde441fd39`, {mode: 'cors'});
    const weatherData = await response.json();
    return weatherData;
}

searchButton.addEventListener('click',function(){
    let userData = getWeatherData(searchInput.value);
    userData.then((value) => {
        let appData = selectAppData(value);
        appendAppData(appData);
    }).catch(function(){
        if(searchInput.value === ""){
            alert(`No city was entered. Please try again.`);
        } else {
            alert(`The city of ${searchInput.value} was not found. Please try again.`);
        }
        console.clear();
    })
})

function appendAppData(obj){
    const weatherPanel = document.getElementById("weather-panel");
    weatherPanel.innerHTML = "";
    appendElement(weatherPanel,searchInput.value);
    appendAllElements(weatherPanel, obj);
    line = document.createElement("hr");
    line.setAttribute("class","hr-line");
    weatherImage = document.createElement("span");
    weatherImage.setAttribute("class","weather-image");
    weatherImage.innerHTML = chooseWeatherImage();
    weatherPanel.appendChild(line);
    weatherPanel.appendChild(weatherImage);
}

function appendElement(parent,text){
    ID++;
    let elem = document.createElement("p");
    elem.setAttribute("class","panel-text");
    elem.setAttribute("id",`panel-text-${ID}`);
    elem.innerText = text;
    parent.appendChild(elem);
}

function appendAllElements(weatherPanel, obj){
    let objInfo = Object.values(obj);
    for(let props in objInfo){
        for(let values in objInfo[props]){
            appendElement(weatherPanel,objInfo[props][values]);
        }
    }
    ID = 0;
}


function selectAppData(obj){
    const appData = {
        main: {
            country: obj.sys.country,
            main: obj.weather[0].main,
            description: obj.weather[0].description,
        },
        temp: {
            temp: `Temperature: ${kelvinToFahrenheit(obj.main.temp)}° F`,
            feels_like: `Feels Like: ${kelvinToFahrenheit(obj.main.feels_like)}° F`,
            humidity: `Humidity: ${obj.main.humidity}%`,
            pressure: `Pressure: ${obj.main.pressure}`
        },
        sun: {
            sunrise: `Sunrise: ${convertUnix(obj.sys.sunrise)}`,
            sunset: `Sunset: ${convertUnix(obj.sys.sunset)}`
        },
        wind: {
            gust: `${obj.wind.gust}`,
            speed: `Wind Speed: ${obj.wind.speed} km`
        }
    };
    if(appData.wind.gust == "undefined"){
        appData.wind.gust = "Wind Gust: 0 km";
    } else {
        appData.wind.gust = `Wind Gust: ${obj.wind.gust} km`;
    }
    return appData;
}

function kelvinToFahrenheit(kelv){
    fahr = (kelv - 273.15) * 9/5 + 32;
    return Math.round(fahr);
}

function fahrenheitToCelsius(fahr){
    cels = (fahr - 32) * 5/9;
    return Math.round(cels);
}

function convertUnix(num){
    let date = new Date(num*1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime;
}

function chooseWeatherImage(){
    const weatherPanel = document.getElementById("weather-panel");
    const weatherDescription = weatherPanel.childNodes[2].innerText
    const imageMap = {
        "Rain": `<i class="fas fa-cloud-showers-heavy" style="color:darkblue"></i>`,
        "Clouds": `<i class="fas fa-cloud" style="color:skyblue"></i>`,
        "Mist": `<i class="fas fa-cloud-moon" style="color:whitesmoke"></i>`,
        "Clear": `<i class="fas fa-cloud-sun" style="color:rgb(237,213,158)"></i>`,
        "Fog": `<i class="fas fa-smog" style="color:lightgrey"></i>`,
        "Smoke": `<i class="fas fa-fire-alt" style="color:#B73239"></i>`,
        "Snow": `<i class="fas fa-snowflake" style="color:white"></i>`,
        "Drizzle": `<i class="fas fa-cloud-rain" style="color:silver"></i>`,
        "Thunderstorm": `<i class="fas fa-bolt" style="color:yellow"></i>`,
        "Haze": `<i class="fas fa-wind" style="color:purple"></i>`,
        "Dust": `<i class="fas fa-feather-alt" style="color:#322A26"></i>`,
        "Ash": `<i class="fas fa-meteor" style="color:red"></i>`,
        "Squall": `<i class="fas fa-poo-storm" style="color: brown"></i>`,
        "Tornado": `<i class="fas fa-dizzy" style="black"></i>`
    }
    return imageMap[weatherDescription];
}
