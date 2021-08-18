const ipAddressText = document.querySelector('.ip-info-content:nth-child(1) p')
const ipLocationText = document.querySelector('.ip-info-content:nth-child(2) p')
const ipTimezoneText = document.querySelector('.ip-info-content:nth-child(3) p')
const ipISPText = document.querySelector('.ip-info-content:nth-child(4) p')
const formInput = document.querySelector('form input#ip-input')

const searchFormSubmitButton = document.querySelector(
  'header .content form button'
)

let myMap = L.map('map', {
  center: [51.05, -0.09],
  zoom: 12,
  zoomControl: false
})

let myMapIcon = L.icon({
  iconUrl: '../images/icon-location.svg'
})

const markers = []

L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/outdoors-v11',
    // id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: ''
  }
).addTo(myMap)

function ipDataRequest(url) {
  axios
    .get(`http://ip-api.com/json/${url}`)
    .then(function (response) {
      // On Success
      const { city, region, zip, query, timezone, isp, status, lat, lon } =
        response.data
      if (response.data) {
        if (status === 'success') {
          if (markers.length > 0) {
            myMap.removeLayer(markers[0])
            markers.shift()
          }
          ipAddressText.innerText = query
          ipLocationText.innerText = `${city}, ${region} ${zip}`
          ipTimezoneText.innerText = `UTC ${
            ct.getTimezone(timezone).utcOffsetStr
          }`
          ipISPText.innerText = isp
          myMap.setView([lat + 0.03, lon], 12)
          const layerMarker = new L.marker([lat, lon], { icon: myMapIcon })
          markers.push(layerMarker)
          myMap.addLayer(markers[0])
        } else {
          alert('Ingrese un valor válido')
          formInput.value = ''
        }
      }
    })
    .catch(function (error) {
      // Handle Error
      console.log(error)
    })
}

axios.get('https://api.ipify.org/?format=json').then(function (response) {
  if (response.data) {
    ipDataRequest(response.data.ip)
  }
})

searchFormSubmitButton.addEventListener('click', function (event) {
  event.preventDefault()
  ipDataRequest(formInput.value)
})
