let api_key = "32273e1edabe3f7e12571409dbace3cf";

function setBackground(str) {
    switch (str.slice(0, 2)) {
        case "01":
            document.getElementById("weather-box").style.backgroundImage = "url('src/sunny.png')";
            break;
        case "02":
            document.getElementById("weather-box").style.backgroundImage = "url('src/few-clouds.png')";
            break;
        case "03":
            document.getElementById("weather-box").style.backgroundImage = "url('src/cloudy.png')";
            break;
        case "04":
            document.getElementById("weather-box").style.backgroundImage = "url('src/more-cloudy.png')";
            break;
        case "09":
            document.getElementById("weather-box").style.backgroundImage = "url('src/more-rainy.jpg')";
            break;
        case "10":
            document.getElementById("weather-box").style.backgroundImage = "url('src/rainy.png')";
            break;
        case "11":
            document.getElementById("weather-box").style.backgroundImage = "url('src/thunder.png')";
            break;
        case "13":
            document.getElementById("weather-box").style.backgroundImage = "url('src/snow.png')";
            break;
        case "50":
            document.getElementById("weather-box").style.backgroundImage = "url('src/mist.png')";
            break;
    }
}

function loadCurrentWeather(data) {
    document.getElementById("city-name").innerHTML = data.name;
    document.getElementById("temp").innerHTML =
        (Math.round(data.main.temp) >= 0 ? "+" + Math.round(data.main.temp) : Math.round(data.main.temp)) +
        "<sup>o</sup>";
    document.getElementById("feels-like").innerHTML =
        (Math.round(data.main.feels_like) >= 0
            ? "+" + Math.round(data.main.feels_like)
            : Math.round(data.main.feels_like)) + "<sup>o</sup>";
    document.getElementById("weather-icon").innerHTML =
        '<img class = "weather-img" src=http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png alt="">';
    document.getElementById("desc-text").innerHTML =
        data.weather[0].description[0].toUpperCase() + data.weather[0].description.slice(1);
    document.getElementById("wind").innerHTML = Math.round(data.wind.speed) + " м/с";
    document.getElementById("humidity").innerHTML = data.main.humidity + "%";
    document.getElementById("pressure").innerHTML = Math.round(data.main.pressure / 1.33) + " мм рт. ст.";
}

function loadHourForecast(data) {
    const casts = document.getElementsByClassName("cast");
    let i = 0;
    for (let cast of casts) {
        cast.getElementsByClassName("cast-time")[0].innerHTML = data.list[i].dt_txt.slice(-8, -3);
        cast.getElementsByClassName("cast-main")[0].innerHTML =
            (Math.round(data.list[i].main.temp) >= 0
                ? "+" + Math.round(data.list[i].main.temp)
                : Math.round(data.list[i].main.temp)) + "<sup>o</sup>";
        cast.getElementsByClassName("cast-temp-icon")[0].innerHTML =
            '<img class="cast-img" src=http://openweathermap.org/img/wn/' +
            data.list[i].weather[0].icon +
            '@2x.png alt="">';
        cast.getElementsByClassName("cast-desc")[0].innerHTML =
            data.list[i].weather[0].description[0].toUpperCase() + data.list[i].weather[0].description.slice(1);
        i++;
    }
}

function loadWeather(url, urlForecast) {
    let errorBox = document.getElementById("error-box");
    let errorMsg = document.getElementById("error-text");

    fetch(url)
        .then(
            (response) => response.json(),
            (error) => {
                errorMsg.innerHTML = "<b>Ошибка!</b>" + error;
                if (!errorBox.classList.contains("error-box-visible")) {
                    errorBox.classList.toggle("error-box-visible");
                    errorBox.classList.toggle("error-box-hidden");
                }
            }
        )
        .then((result) => {
            if (result.cod === "404") {
                errorMsg.innerHTML = "<b>Ошибка!</b>Город не найден. Попробуйте еще раз.";
                if (!errorBox.classList.contains("error-box-visible")) {
                    errorBox.classList.toggle("error-box-visible");
                    errorBox.classList.toggle("error-box-hidden");
                }
            } else {
                if (errorBox.classList.contains("error-box-visible")) {
                    errorBox.classList.toggle("error-box-visible");
                    errorBox.classList.toggle("error-box-hidden");
                }

                loadCurrentWeather(result);
                setBackground(result.weather[0].icon);
                fetch(urlForecast)
                    .then((response) => response.json())
                    .then((result) => loadHourForecast(result));
            }
        });
}

function loadWeatherFromInput() {
    let input = document.getElementById("search_input");
    let city = input.value === "" ? "Москва" : encodeURIComponent(input.value);

    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&lang=ru&units=metric&appid=" + api_key;
    let urlForecast =
        "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&lang=ru&units=metric&appid=" + api_key;

    loadWeather(url, urlForecast);
}

function main() {
    loadWeatherFromInput();
    const success = (position) => {
        let url =
            "https://api.openweathermap.org/data/2.5/weather?lat=" +
            position.coords.latitude +
            "&lon=" +
            position.coords.longitude +
            "&lang=ru&units=metric&appid=" +
            api_key;
        let urlForecast =
            "https://api.openweathermap.org/data/2.5/forecast?lat=" +
            position.coords.latitude +
            "&lon=" +
            position.coords.longitude +
            "&lang=ru&units=metric&appid=" +
            api_key;
        loadWeather(url, urlForecast);
    };

    navigator.geolocation.getCurrentPosition(success);
}
