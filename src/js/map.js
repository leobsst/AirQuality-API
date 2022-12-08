
const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://diginamic.fr">Diginamic</a>'
})

const map = L.map('map', {center: [47.161490680080256, 2.3817511616546625], zoom: 6, layers: osm});

let GroupAir = L.layerGroup();
let GroupMeteo = L.layerGroup();


let overlayMaps = {
  "Qualité air": GroupAir,
  "Météo": GroupMeteo
};

L.control.layers(overlayMaps).addTo(map);

// API de Waqi (qualité d'air)
let cities = ['Paris','Marseille','Lyon','Toulouse','Nice','Nantes','Montpellier','Strasbourg','Bordeaux','Lille'];
const token = '';
const baseUrl = 'https://api.waqi.info/feed/';

// API de Météo Conccept (Météo)
const WeatherToken = '';
const WeatherBaseUrl = 'https://api.meteo-concept.com/api/forecast/nextHours?token=';
let xhr;

cities.forEach(city => makeRequest(city, baseUrl, token));

function SearchCity() {
  let NewCity = document.getElementById('city').value;
  makeRequest(NewCity, baseUrl, token);
}

async function makeRequest(city, baseUrl, token){
  try {
    let response = await fetch (`${baseUrl}${city}/?token=${token}`);
    let xhr = await new XMLHttpRequest();
    xhr.open('GET', response.url);
    xhr.onreadystatechange = handleResponse;
    xhr.send();
  } catch (error) {
    console.log(error);
  }
}

function handleResponse(xhr){
  try {
    let target = JSON.parse(xhr.srcElement.responseText).data;
    let pm25 = '';
    let pm10 = '';
    let o3 = '';
    let no2 = '';
    let so2 = '';
    let co = '';
    let color = '';
    if(typeof target.aqi !== 'number') {
      color = '#7B7B7B';
    }
    if(target.aqi <= 50) {
      color = '#2AAD27';
    } 
    if(target.aqi >= 51 && target.aqi <= 100) {
      color = '#FFD326';
    }
    if(target.aqi >= 101 && target.aqi <= 150) {
      color = '#CB8427';
    }   
    if(target.aqi >= 151 && target.aqi <= 200) {
      color = '#CB2B3E';
    } 
    if(target.aqi >= 201 && target.aqi <= 300) {
      color = '#9C2BCB	';
    } 
    if(xhr.srcElement.readyState === 4){
      if(xhr.srcElement.status === 200){
        if(typeof target.iaqi.pm25 !== 'undefined') { 
          pm25 = target.iaqi.pm25.v ;
        } else { 
          pm25 = 'n/a';
        }
        if(typeof target.iaqi.pm10 !== 'undefined') { 
          pm10 = target.iaqi.pm10.v ;
        } else { 
          pm10 = 'n/a';
        }  
        if(typeof target.iaqi.o3 !== 'undefined') { 
          o3 = target.iaqi.o3.v ;
        } else { 
          o3 = 'n/a';
        }
        if(typeof target.iaqi.no2 !== 'undefined') { 
          no2 = target.iaqi.no2.v ;
        } else { 
          no2 = 'n/a';
        } 
        if(typeof target.iaqi.so2 !== 'undefined') { 
          so2 = target.iaqi.so2.v ;
        } else { 
          so2 = 'n/a';
        } 
        if(typeof target.iaqi.co !== 'undefined') { 
          co = target.iaqi.co.v ;
        } else { 
          co = 'n/a';
        }
        
        WeatherRequest(WeatherBaseUrl, WeatherToken, target); 

        async function WeatherRequest(WeatherBaseUrl, WeatherToken) {
          try {
            let weather = await fetch (`${WeatherBaseUrl}${WeatherToken}&latlng=${target.city.geo[0]},${target.city.geo[1]}`);
            let WeatherData = await new XMLHttpRequest();
            WeatherData.open('GET', weather.url);
            WeatherData.onreadystatechange = handleResponseWeather
            WeatherData.send();
          } catch (error) {
            console.log(error)
          }
        }

        function handleResponseWeather(WeatherData) {
          try {
            let WeatherTarget = JSON.parse(WeatherData.target.responseText).forecast[0];
            let InfoWeather = '';
            let IconWeather = '';
            let Icon = '';
            if(WeatherTarget.weather === 0) {
              IconWeather = 'wi-day-sunny';
              InfoWeather= 'Ensoleillé';
              Icon = L.divIcon({
                className: 'custom-div-icon',
                html: '<i class="wi wi-day-sunny"></i>',
                iconSize: [30, 42],
                iconAnchor: [10, 15]
              })
            }
            if(WeatherTarget.weather >= 1 && WeatherTarget.weather <= 5) {
              IconWeather = 'wi-day-cloudy';
              InfoWeather= 'Nuageux';
              Icon = L.divIcon({
                className: 'custom-div-icon',
                html: '<i class="wi wi-day-cloudy"></i>',
                iconSize: [30, 42],
                iconAnchor: [10, 15]
              })
            }
            if(WeatherTarget.weather >= 6 && WeatherTarget.weather <= 7) {
              IconWeather = 'wi-day-fog';
              InfoWeather= 'Brouillardeux';
              Icon = L.divIcon({
                className: 'custom-div-icon',
                html: '<i class="wi wi-day-fog"></i>',
                iconSize: [30, 42],
                iconAnchor: [10, 15]
              })
            }
            if(WeatherTarget.weather >= 10 && WeatherTarget.weather <= 16) {
              IconWeather = 'wi-day-rain';
              InfoWeather= 'Pluvieux';
              Icon = L.divIcon({
                className: 'custom-div-icon',
                html: '<i class="wi wi-day-rain"></i>',
                iconSize: [30, 42],
                iconAnchor: [10, 15]
              })
            }
            if(WeatherTarget.weather >= 20 && WeatherTarget.weather <= 32) {
              IconWeather = 'wi-day-fog';
              InfoWeather= 'Neigeux';
              Icon = L.divIcon({
                className: 'custom-div-icon',
                html: '<i class="wi wi-day-fog"></i>',
                iconSize: [30, 42],
                iconAnchor: [10, 15]
              })
            }
            if(WeatherTarget.weather >= 40 && WeatherTarget.weather <= 78) {
              IconWeather = 'wi-day-hail';
              InfoWeather= 'Averses';              
              Icon = L.divIcon({
                className: 'custom-div-icon',
                html: '<i class="wi wi-day-hail"></i>',
                iconSize: [30, 42],
                iconAnchor: [10, 15]
              })
            }
            if(WeatherTarget.weather >= 100 && WeatherTarget.weather <= 142) {
              IconWeather = 'wi-day-thunderstorm';
              InfoWeather= 'Orageux';
              Icon = L.divIcon({
                className: 'custom-div-icon',
                html: '<i class="wi wi-day-thunderstorm"></i>',
                iconSize: [30, 42],
                iconAnchor: [10, 15]
              })
            }
            if(WeatherTarget.weather >= 210 && WeatherTarget.weather <= 235) {
              IconWeather = 'wi-day-hail';
              InfoWeather= 'Averses';
              Icon = L.divIcon({
                className: 'custom-div-icon',
                html: '<i class="wi wi-day-hail"></i>',
                iconSize: [30, 42],
                iconAnchor: [10, 15]
              })
            }

            let InfoPopup1 = L.popup().setContent(`<strong>${target.city.name}</strong><br><br> PM25 : ${pm25}<br> PM10 : ${pm10}<br> O3 : ${o3}<br> NO2 : ${no2}<br> SO2 : ${so2}<br> CO: ${co}`);
            let markers1 = L.circle([target.city.geo[0], target.city.geo[1]], {color: color, filCcolor:	color, fillOpacity: 0.8, radius:15000}).bindPopup(InfoPopup1)
    
            let InfoPopup2 = L.popup().setContent(`<strong>${target.city.name}</strong><br><br> ${WeatherTarget.temp2m}°C | ${InfoWeather}`);
            let markers2 = L.marker([target.city.geo[0], target.city.geo[1]], {icon: Icon}).bindPopup(InfoPopup2)
    
            GroupAir.addLayer(markers1).addTo(map)
            GroupMeteo.addLayer(markers2)
            
          } catch (error) {
          }
        }
      }
    }
  } catch (error) {
  }
}