//ELEMENTS

const iconElements = document.querySelector(".weather-icon");
const notificationElement = document.querySelector(".notification");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const timeElement = document.querySelector(".time p");

let temp1 = 0;
let temp2 = 0;
let temp3 = 0;

const weather = {
    temperature: {
        value: 18,
        unit: "celsius"
    },
    description: "few clouds",
    iconId: "01d",
    city: "London",
    country: "GB"
};



const APIkey = "7a7d9d2fe192358ca8a1e766c1b8ad87";

//Check if geolocation is supported

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else{
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser does not support location. Allow location!</p>";
}

// Show error if there is an issue with geolocation service
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longtitude = position.coords.longitude;

    getCurrentWeather(latitude, longtitude);
    getForecastWeather(latitude,longtitude);
}

//Get weather API

function getCurrentWeather(latitude,longtitude){
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&units=metric&APPID=${APIkey}`;

    fetch(api)
        .then(function(response){
            let data = response.json();
            console.log(data);
            return data;
        })
        .then(function(data){
            weather.temperature.value = data.main.temp;
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(function () {
            displayWeather();
        })

}

//Get forecast weather
function getForecastWeather(latitude,longtitude) {
    let api = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longtitude}&units=metric&APPID=${APIkey}`;

    fetch(api)
        .then(function(response){
            var data = response.json();
            console.log(data);
            return data;
        })
        .then(function (data) {
            for (var a = 1; a < 4; a++) {
                var today = new Date();
                //compared date
                var sel_date = new Date(today.setDate(today.getDate() + a));
                sel_date.setHours(0, 0, 0, 0);
                for (var i = 0; i < 40; i++) {

                    // define weather date in data
                    var weather_date = new Date(data.list[i].dt_txt);
                    weather_date.setHours(0, 0, 0, 0)
                    //console.log(i + "--- " + weather_date + "  " + sel_date);
                    if (Date.parse(weather_date) === Date.parse(sel_date)) {
                        var newForecast = document.createElement("div");
                        document.querySelector(".forecast").appendChild(newForecast);
                        newForecast.setAttribute("style","background-color: #c3c8ce;" +
                            "position: relative; left: 26px; border-radius: 10px; margin-top: 5%; margin-bottom: 10%; width: 350px");
                        newForecast.innerHTML =

                            `
                            <div class="date" id="date">${sel_date.toDateString()}</div>
                            <table style="width: 100%">
                                <tr>
                                    <td class="weather-icon" id="icon" style="padding: 0px; margin: 0 auto;width: 100px"><img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png"></td>
                                    <td class="temperature-value${a}"><p>${Math.round(data.list[i].main.temp)} °<span>C</span></p></td>
                                    <td class="temperature-description" style="font-style: normal;padding: 10px;text-align: center;"><p>${data.list[i].weather[0].description}</p></td>
                                </tr>
                            </table>`;
                        if(a==1){
                            temp1 = Math.round(data.list[i].main.temp);
                            newForecast.setAttribute("id", "1");
                            document.getElementById("1").style.display = "none";
                        } else if(a==2){
                            temp2 = Math.round(data.list[i].main.temp);
                            newForecast.setAttribute("id", "2");
                            document.getElementById("2").style.display = "none";
                        } else if (a == 3){
                            temp3 = Math.round(data.list[i].main.temp);
                            newForecast.setAttribute("id", "3");
                            document.getElementById("3").style.display = "none";
                        }

                        break;
                    }
                }

            }
        })

}
//Display current weather

function displayWeather() {
    iconElements.innerHTML =
        `<img src="http://openweathermap.org/img/wn/${weather.iconId}@2x.png"/>`;
    tempElement.innerHTML =
        `${weather.temperature.value} °<span>C</span>`;
    descElement.innerHTML =
        weather.description;
    locationElement.innerHTML =
        `${weather.city}, ${weather.country}`;
    timeElement.innerHTML =  `<span>${new Date().toDateString()}</span><br>${new Date().toTimeString()}</br>`;
}

// C to F conversion
function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

// CHANGE TEMPERATURE UNIT
tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;

    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        document.querySelector(".temperature-value1").innerHTML = `${Math.floor(celsiusToFahrenheit(temp1))}°<span>F</span>`;
        document.querySelector(".temperature-value2").innerHTML = `${Math.floor(celsiusToFahrenheit(temp2))}°<span>F</span>`;
        document.querySelector(".temperature-value3").innerHTML = `${Math.floor(celsiusToFahrenheit(temp3))}°<span>F</span>`;

        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        document.querySelector(".temperature-value1").innerHTML = `${temp1}°<span>C</span>`;
        document.querySelector(".temperature-value2").innerHTML = `${temp2}°<span>C</span>`;
        document.querySelector(".temperature-value3").innerHTML = `${temp3}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

//Display forecast
document.querySelector(".button").addEventListener("click", function () {
    if (document.getElementById("1").style.display === "none"){

        document.getElementById("1").style.display = "block";
        document.getElementById("2").style.display = "block";
        document.getElementById("3").style.display = "block";
    } else {
        document.getElementById("1").style.display = "none";
        document.getElementById("2").style.display = "none";
        document.getElementById("3").style.display = "none";
    }
})
