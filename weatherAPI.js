window.onload = function () {
  const weather = document.querySelector(".js_weather");
  const weatherMain = document.querySelectorAll(".weather_main");
  const weatherIcon = document.querySelectorAll(".weather_icon");
  const weatherText = document.querySelectorAll(".weather_text");

  const API_KEY = "64bb4412769a73988b668782663bd5f7";
  const COORDS = `coords`;

  const week = ["일", "월", "화", "수", "목", "금", "토"];
  const date = new Date();
  const today = date.getDay();

  function getWeather(lat, lng) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`)
      .then(function (response) {
        return response.json();
      }).then(function (json) {
        console.dir(json);
        weatherMain.forEach((main, i) => {
          const j = i > 0 ? (i * 8) : i;
          switch (json.list[j].weather[0].main) {
            case "Clear":
              weatherIcon[i].className = "fa fa-sun";
              json.list[j].weather[0].main = "맑음";
              break;
            case "Rain":
              weatherIcon[i].className = "fa fa-cloud-rain";
              json.list[j].weather[0].main = "비옴";
              break;
            case "Clouds":
              weatherIcon[i].className = "fa fa-cloud";
              json.list[j].weather[0].main = "구름";
              break;
            default:
              weatherIcon[i].className = "fa fa-wind";
              json.list[j].weather[0].main = "바람";
          }
          main.textContent = `날씨 ${json.list[j].weather[0].main} / 온도 ${json.list[j].main.temp}°C`;
          weatherText[i].textContent = week[(today + i) === 7 ? 0 : (today + i) === 8 ?  1 : (today + i) === 9 ? 2 : (today + i) === 10 ? 3 : today + i];
          weatherText[0].textContent = "ToDay";
        });
        const temperature = json.list[0].main.temp;
        const place = json.city.country;
        const _weather = json.list[0].weather[0].main;
        console.log(_weather);
        switch (_weather) {
          case "Rain":
            console.log("비오네요");
            break;
          case "Clouds":
            console.log("구름 많네요");
            break;
        }
        weather.textContent = `온도 ${temperature}°C @ 국가 ${place} 날씨 ${_weather}`;
      });
  }

  function saveCoords(coordsObj) {
    localStorage.setItem(COORDS, JSON.stringify(coordsObj));
  }

  function handleGeoSucces(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
      latitude,
      longitude
    };
    saveCoords(coordsObj);
    getWeather(latitude, longitude);
  }

  function handleGeoError() {
    console.log("Cant acces geo location");
  }

  function askForCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError);
  }

  function loadCoords() {
    const loadedCords = localStorage.getItem(COORDS);
    if (loadedCords === null) {
      askForCoords();
    } else {
      const parsedCoords = JSON.parse(loadedCords);
      getWeather(parsedCoords.latitude, parsedCoords.longitude);
    }
  }

  function init() {
    loadCoords();
  }
  init();
};
