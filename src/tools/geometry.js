/**
 * FUNCTION RELATED TO KAIOS SYSTEMS
 * In this files, we store all function related to geometry, coordinates and spatiality. We can :
 *
 * 1. Get Distance
 * 2. Get Bounds
 * 3. Get Zoom Level
 * 4. Get Center
 * 5. Get Current User Position
 * 6. Normalize Coords
 *
 */

/* GET DISTANCE BETWEEN TWO POINTS */
export function getDistance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km

  if (d < 1) {
    return Math.round(d * 1000) + "m";
  } else {
    return Math.round(d) + "km";
  }
}

export function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/* GET BOUNDS */
export function getBounds(points, fct) {
  const NE = { lat: 0, lng: 0 }; // Nord East
  const SW = { lat: 0, lng: 0 }; // South West

  points.forEach((item) => {
    const lat = typeof fct === "function" ? fct(item)[0] : item[0]; // latitude
    const lng = typeof fct === "function" ? fct(item)[1] : item[1]; // longitude

    // NW.lat should be the highest value
    NE.lat = NE.lat ? (NE.lat > lat ? NE.lat : lat) : lat;
    // NW.lng should be the higgest value
    NE.lng = NE.lng ? (NE.lng > lng ? NE.lng : lng) : lng;
    // B.lat should be the lowest value
    SW.lat = SW.lat ? (SW.lat < lat ? SW.lat : lat) : lat;
    // B.lng should be the lowest value
    SW.lng = SW.lng ? (SW.lng < lng ? SW.lng : lng) : lng;
  });

  return { NE: NE, SW: SW };
}

/* GET ZOOM MAP LEVEL */
export function getZoomLevel(bounds, sizes) {
  const WORLD_DIM = { height: 256, width: 256 };
  const ZOOM_MAX = 21;

  function latRad(lat) {
    const sin = Math.sin((lat * Math.PI) / 180);
    const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
    return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  }

  function zoom(mapPx, worldPx, fraction) {
    return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }

  const ne = bounds.NE;
  const sw = bounds.SW;

  const latFraction = (latRad(ne.lat) - latRad(sw.lat)) / Math.PI;

  const lngDiff = ne.lng - sw.lng;
  const lngFraction = (lngDiff < 0 ? lngDiff + 360 : lngDiff) / 360;

  const latZoom = zoom(sizes.height, WORLD_DIM.height, latFraction);
  const lngZoom = zoom(sizes.width, WORLD_DIM.width, lngFraction);

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

/* GET CENTER FROM A BOUNDS */
export function getCenter(bounds) {
  return [
    (bounds.NE.lat + bounds.SW.lat) / 2,
    (bounds.NE.lng + bounds.SW.lng) / 2,
  ];
}

/* GET THE CURRENT USER POSITION */
//documentation: https://stackoverflow.com/questions/10077606/check-if-geolocation-was-allowed-and-get-lat-lon#35628523

export const getCurrentPosition = (success, denied, error) => {
  //We will store the amount of fail into failcount,
  //We will use later to determinate when to give up.
  let failcount = 0;
  const IDWatch = navigator.geolocation.watchPosition(
    function (position) {
      // IF IT'S A SUCCESS
      //We callback the function related to success
      success(position);
      //We Stop to watch the position
      stop();
    },
    function (err) {
      // IF IT'S A FAIL
      //We don't give up after only one fail,
      //We continue until couple of fails or if the user denied
      failcount++;

      if (err.code === err.PERMISSION_DENIED) {
        stop();
        denied(err);
      } else if (failcount > 6) {
        stop();
        error(err);
      }
    },
    {
      //We setup a Timeout in case of an unfinishable retrieving
      enableHighAccuracy: true,
      timeout: 2500,
      maximumAge: 7 * 24 * 60 * 60 * 1000, // 7 days in millisecond
    }
  );
  // Will Stop the Watch once the job is done
  const stop = () => {
    navigator.geolocation.clearWatch(IDWatch);
  };
};

/* NORMALIZATION OF COORDS */
// The Coords object is structured differentiel accross services. Leaflet use an array, Google Maps prefer a latitude and longitude as properties. This function format an initial coords into an object usable in every services.

export const normalizeCoords = (input, source) => {
  let lat, lng, output;

  //First, we get the properties we are interesd in from the initial object
  lat = input.latitude || input.lat || input[0] || 0;
  lng = input.longitude || input.lng || input[1] || 0;

  //Secondly, we create new array with latitude on index 0 and longitude and index 1
  output = [lat, lng];

  //Thirdly, we set back the properties
  output.latitude = lat;
  output.lat = lat;
  output.longitude = lng;
  output.lng = lng;
  output.source = source;

  //We return the final object
  return output;
};
