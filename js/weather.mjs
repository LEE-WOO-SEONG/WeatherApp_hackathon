const API_KEY = '64bb4412769a73988b668782663bd5f7';
const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const date = new Date();
const today = date.getDay();

const $weather = document.getElementById('weather');
const $forecast = $weather.querySelector('.forecast');
const $currently = $weather.querySelector('.currently');
const $currentlyBtn = $weather.querySelector('.currently_btn');
const $citySelect = $weather.querySelector('.city_select');
const $currentOption = $weather.querySelector('.current_option');

const $weatherContents = $forecast.querySelectorAll('.weather_content');
const $weatherIcons = $forecast.querySelectorAll('.fas.fa-spinner');
const $temps = $forecast.querySelectorAll('.temp');
const $dayNames = $forecast.querySelectorAll('.day_name');

// 날씨 정보 요청 api
const getJson = fetchStr =>
  fetch(fetchStr)
    .then(res => res.json())
    .then(jsonData => jsonData);

// 날씨 icon render
const weatherRender = weather => {
  const { daily } = weather;
  $weatherContents.forEach((_, i) => {
    switch (daily[i].weather[0].main) {
      case 'Thunderstorm':
        $weatherIcons[i].className = 'wi wi-lightning';
        break;
      case 'Rain':
      case 'Drizzle':
        $weatherIcons[i].className = 'wi wi-rain';
        break;
      case 'Snow':
        $weatherIcons[i].className = 'wi wi-snowflake-cold';
        break;
      case 'Mist':
      case 'Smoke':
      case 'Haze':
      case 'Dust':
      case 'Fog':
      case 'Sand':
      case 'Ash':
      case 'Squall':
      case 'Tornado':
        $weatherIcons[i].className = 'wi wi-fog';
        break;
      case 'Clear':
        $weatherIcons[i].className = 'wi wi-day-sunny';
        break;
      case 'Clouds':
        $weatherIcons[i].className = 'wi wi-cloudy';
        break;
      default:
        $weatherIcons[i].className = 'wi wi-refresh';
    }
    $temps[i].textContent = `${daily[i].temp.min}°C / ${daily[i].temp.max}°C`;
    $dayNames[i].textContent = week[today + i];
    $dayNames[0].textContent = 'Today';
  });
};

// 도시 정보
const cityRender = city => {
  $currently.textContent = city.name;
  $currentOption.textContent = city.name;
  $currentOption.selected = true;
};

// 네비게이터를 가져올 경우
function geoSuccess(position) {
  const { latitude, longitude } = position.coords;

  async function getWeatherAll(lat, lng) {
    $currentlyBtn.firstElementChild.className = 'fas fa-spinner';
    $currentlyBtn.disabled = true;
    $citySelect.disabled = true;

    const weatherData = await getJson(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=kr`
    );
    console.log(weatherData);
    weatherRender(weatherData);

    const cityData = await getJson(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
    );
    cityRender(cityData);

    const koreaCityData = await getJson('../json/cityKR.list.json', {
      credentials: 'same-origin',
    });

    $citySelect.addEventListener('change', ({ target }) => {
      const cityObj = koreaCityData.filter(city => city.name === target.value);
      const { lat, lon } = cityObj[0].coord;
      $weatherIcons.forEach(icon => {
        icon.className = 'fas fa-spinner';
      });

      getWeatherAll(lat, lon);
    });

    $currentlyBtn.firstElementChild.className = '';
    $currentlyBtn.disabled = false;
    $citySelect.disabled = false;
  }

  getWeatherAll(latitude, longitude);

  $currentlyBtn.addEventListener('click', () => {
    getWeatherAll(latitude, longitude);
  });
}
// 네비게이터를 가져오지 못할경우
function geoError() {
  $weatherContents.forEach(content => {
    content.textContent = '위치 정보를 가져올 수 없습니다.';
  });
}
// 네비게이터 가져오기
function askForCoords() {
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
}

// 초기 설정
window.addEventListener('load', () => {
  askForCoords();
});
