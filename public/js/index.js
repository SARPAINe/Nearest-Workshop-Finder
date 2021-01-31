console.log("javascript connected!")
let long;
let lat;
const successCallback= (position)=>{
  lat= position.coords.latitude;
  long=position.coords.longitude
  console.log(lat,long);
}
const errorCallback=(error)=>{
  console.log(error);
}
navigator.geolocation.getCurrentPosition(successCallback,errorCallback,{
  enableHighAccuracy:true,
  timeout:5000
});

async function getWorkshops(){
  const res=await fetch('api/v1/sarpaine');
  const workshops=await res.json();
  return workshops
  // console.log(workshops);
}

workshops=getWorkshops();
workshops.then(function(workshops) {
  console.log(workshops[0].contact);
  mapboxgl.accessToken = 'pk.eyJ1Ijoic2FycGFpbmUiLCJhIjoiY2trZHozNjRvMDA1ODJvbmd5MnJqMTViMCJ9.vmzH3stox32zQHX9uw69Uw';
  const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [long,lat],
  // center: [90.403037,23.879323499999998],
  // first one is longitude and second one is latitude
  zoom:13
  });

  console.log(workshops[0].contact);
  map.addControl(new mapboxgl.NavigationControl());

  var popup = new mapboxgl.Popup()
    .setText('Your Location')
    .addTo(map);

  var marker = new mapboxgl.Marker({
  color: "#3289a8",
  // draggable: true
  }).setLngLat([90.403105,23.879227])
  .addTo(map).setPopup(popup);
  console.log(typeof workshops);
  console.log(workshops);
  console.log(typeof workshops[1])

  function deg2rad(deg) {
  return deg * (Math.PI/180)
}

  for(let i=0;i<workshops.length;i++)
  {
    var R=6371//in km radius of earth
    var dLat=(Math.PI/180)*(lat-workshops[i].lat);
    var dLon=(Math.PI/180)*(long-workshops[i].long);
    var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(workshops[i].lat)) * Math.cos(deg2rad(lat)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    workshops[i].distance=d;

  }

  console.log(workshops);
  workshops.sort(function(a, b) {
  var keyA = a.distance,
    keyB = b.distance;
  // Compare the 2 dates
  if (keyA < keyB) return -1;
  if (keyA > keyB) return 1;
  return 0;
  });
// console.log(workshops);

  for(let i=0;i<3;i++)
  {
    var popup2 = new mapboxgl.Popup()
      .setText(workshops[i].workshopName+"\n contact:"+workshops[i].contact)
      .addTo(map);
    var marker = new mapboxgl.Marker({
    color: "#fc1c03",
    // draggable: true
    }).setLngLat([workshops[i].long,workshops[i].lat])
    .addTo(map).setPopup(popup2);
  }

})

