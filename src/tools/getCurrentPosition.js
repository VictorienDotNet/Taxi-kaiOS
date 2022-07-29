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
      maximumAge: 7 * 24 * 60 * 60 * 1000 // 7 days in millisecond
    }
  );
  // Will Stop the Watch once the job is done
  const stop = () => {
    navigator.geolocation.clearWatch(IDWatch);
  };
};

/** NORMALIZATION OF COORDS
 * The Coords object is structured differentiel accross services. Leaflet use an array, Google Maps prefer a latitude and longitude as properties. This function format an initial coords into an object usable in every services.
 */
export const normalizeCoords = (input, source) => {
  let lat, lng, output;

  //console.log(input);
  //First, we get the properties we are interesd in from the initial object
  lat = input.latitude || input.lat || input[0] || 0;
  lng = input.longitude || input.lng || input[1] || 0;

  //console.log(lat, lng);

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
