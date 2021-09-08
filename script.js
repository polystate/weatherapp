const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");

async function getWeatherData(city){
    const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=407a1e2c2ac239ed7ea61fdde441fd39`, {mode: 'cors'});
    const weatherData = await response.json();
    return weatherData;
}

searchButton.addEventListener('click',function(){
    let userData = getWeatherData(searchInput.value);
    userData.then((value) => {
        console.log(value);
        let appData = selectAppData(value);
        appendAppData(appData);
    });
})

function appendAppData(obj){
    const weatherPanel = document.getElementById("weather-panel");
    weatherPanel.innerHTML = "";
    appendElement(weatherPanel,searchInput.value);
    appendAllElements(weatherPanel, obj);
}

function appendElement(parent,text){
    let elem = document.createElement("p");
    elem.setAttribute("class","panel-text");
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
}


function selectAppData(obj){
    const appData = {
        sys: {
            country: obj.sys.country,
            sunrise: obj.sys.sunrise,
            sunset: obj.sys.sunset
        },
        main: {
            temp: obj.main.temp,
            feels_like: obj.main.feels_like,
            humidity: obj.main.humidity,
            pressure: obj.main.pressure
        },
        weather: {
            main: obj.weather[0].main,
            description: obj.weather[0].description
        },
        wind: {
            gust: obj.wind.gust,
            speed: obj.wind.speed
        }
    };
    console.log(appData);
    return appData;
}
