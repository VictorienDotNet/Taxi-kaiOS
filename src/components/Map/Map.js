import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { normalizeCoords } from "../../tools/getCurrentPosition";
import css from "./Map.module.css";
import { getBounds, getZoomLevel } from "../../tools";
import { ReactComponent as Target } from "./images/target.svg";
import "./Leaflet.1.7.1.css";

//export function Map({ center, children, zoom }) {
export const Map = React.forwardRef((props, ref) => {
  const { center = [0, 0], children, keyboard = true, to } = props;
  /* SETUP REF */
  // This ref is use to update map parameters */

  /* DEFINE THE BOUNDS */
  let [params, setParams] = useState({});

  /* We will define the higest and lowest bound's lattitudes and longitudes. By definition, latitude go from Nord to South with a scale of 90 to -90 and longitude go from West to Est with a scale of -180 to 180. If `A` is the Nord-Ouest corner, A.lgt should be the lowest value and A.lat should be the highest value. If `B` is the South-East corner, B.lgt should be the higgest value and B.lat should be the lowest value. */
  //N.B.: I could do it more simple https://stackoverflow.com/questions/27451152/fitbounds-of-markers-with-leaflet

  useEffect(() => {
    if (children) {
      //Figure Out which points we will focus during the Zoom in
      const pointsZoomSnapping = children.filter((child) => {
        return child.props.zoomSnapping;
      });

      const zoomMaxBounds = getBounds(pointsZoomSnapping, (child) => {
        return child.props.position;
      });

      const zoomMaxLeafletBounds = L.latLngBounds(
        L.latLng(zoomMaxBounds.NE.lat, zoomMaxBounds.NE.lng),
        L.latLng(zoomMaxBounds.SW.lat, zoomMaxBounds.SW.lng)
      );

      const defaultBounds = getBounds(children, (child) => {
        return child.props.position;
      });

      const minZoom = getZoomLevel(defaultBounds, { width: 240, height: 320 });

      const defaultLeafletBounds = L.latLngBounds(
        L.latLng(defaultBounds.NE.lat, defaultBounds.NE.lng),
        L.latLng(defaultBounds.SW.lat, defaultBounds.SW.lng)
      );

      setParams({
        minCenter: defaultLeafletBounds.getCenter(),
        minZoom: minZoom,
        defaultBounds: defaultLeafletBounds,
        maxCenter: zoomMaxLeafletBounds.getCenter(),
        maxZoom: 22,
      });
    } else {
      setParams({
        defaultBounds: L.latLngBounds(L.latLng(30, -60), L.latLng(-30, 60)),
      });
    }
  }, [children]);

  const token =
    "pk.eyJ1IjoiYnZpY3RvcmllbiIsImEiOiJja3RycWNhYmMwNGQ2MnVtaTNnMGNwMTJwIn0.HirDPOdiEpC0myYa1x45RA";

  const tiles =
    "https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=" +
    token;

  return (
    <div
      className={css.Container}
      data-fullscreen={keyboard}
      data-update={to ? true : false}
    >
      {to && (
        <div className={css.Target}>
          <Target />
        </div>
      )}
      {center && (
        <MapContainer className={css.Map} keyboardPanDelta={0}>
          <TileLayer url={tiles} />
          {children}
          <Set ref={ref} to={to} keyboard={keyboard} params={params} />
        </MapContainer>
      )}
      <div className={css.Softkeys}>
        <div>Zoom out</div>
        <div>Select</div>
        <div>Zoom In</div>
      </div>
    </div>
  );
}); /**/

/* TRIGGER MAP UPDATE */

/* MapContainer props are immutable: changing them after they have been set a first time will have no effect on the Map instance or its container. The Leaflet Map instance created by the MapContainer element can be accessed by child components using one of the provided hooks or the MapConsumer component. The component is use to triger re-render on the map */

const Set = React.forwardRef((props, ref) => {
  const { to, keyboard, params } = props;

  let { minCenter, minZoom, maxCenter, maxZoom, defaultBounds } = params;

  const map = useMap();

  if (ref) {
    ref.current = map;
  }

  /* Here, we setup all keyboard actions*/
  //First, we define the incremental int from the keyboard
  const i = 25;
  //Then, we define the onKeyDown function
  const onKeyDown = (evt) => {
    if (evt.key === "1") {
      const zoom = map.getZoom();
      if (zoom <= minZoom - 1) {
        map.flyTo(minCenter, zoom - 1);
      } else {
        map.flyTo(maxCenter, zoom - 1);
      }
    } else if (evt.key === "3") {
      const zoom = map.getZoom();
      if (zoom >= minZoom - 1) {
        map.flyTo(maxCenter, zoom + 1);
      } else {
        map.flyTo(minCenter, zoom + 1);
      }
    }
    if (!keyboard) return false;
    //Events related to zoom
    if (evt.key === "SoftLeft") {
      map.zoomOut();
    } else if (evt.key === "SoftRight") {
      map.zoomIn();
      //Events related to zoom
    } else if (evt.key === "ArrowUp") {
      map.panBy([0, -i], { animate: true });
    } else if (evt.key === "ArrowDown") {
      map.panBy([0, i], { animate: true });
    } else if (evt.key === "ArrowLeft") {
      map.panBy([-i, 0], { animate: true });
    } else if (evt.key === "ArrowRight") {
      map.panBy([i, 0], { animate: true });
      //This last entry, trigger the onSubmit function and sent back the center of the map to the parent
    } else if (evt.key === "Enter") {
      //Go to display the results according to the coords
      if (to) {
        to({
          coords: normalizeCoords(map.getCenter(), "map"),
        });
      }
    } else if (evt.key === "Backspace") {
      if (to) {
        to("Choose Location");
      }
    } else {
      return;
    }
    evt.preventDefault();
  };
  //Secondly,  We mount the onKeyDown when the app start
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyboard, minCenter, minZoom, maxCenter, maxZoom, defaultBounds]);

  // We adjust the bounds of the map. We can use fitBounds for no animation and flyToBounds for animation.
  useEffect(() => {
    map.fitBounds(defaultBounds, {
      // I don't undertsand anything about the value of the padding.
      padding: [24, 48],
    });
  }, [defaultBounds, map]);

  map.invalidateSize();

  //Suppose to disa
  //map.keyboard.disable();

  return null;
});

/* USEFULL LINKS, DATA AND API */

/**
 * We could improve the first view of the map by zooming on the country of the users. To perform that without knowing his accurate location, we could use IP localisation API. We found three API for that:
 
 1. ipinfo.io
 * https://ipinfo.io/blog/replacing-getcurrentposition

 2. country.is + country coords
 * https://www.npmjs.com/package/react-ipgeolocation
 * https://developers.google.com/public-data/docs/canonical/countries_csv
 
 3. Abstract API
 * https://www.abstractapi.com/guides/how-to-use-ip-geolocation-in-react
 
 */

/* USEFULL LINKS 
	var mapboxUrl =
		"https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
	var accessToken =
		"pk.eyJ1IjoiYnZpY3RvcmllbiIsImEiOiJja3RycWNhYmMwNGQ2MnVtaTNnMGNwMTJwIn0.HirDPOdiEpC0myYa1x45RA";
	var id = "light-v9";

	var MyTiles =
		"https://api.mapbox.com/styles/v1/bvictorien/cl668wlli001515rvn4aobdou/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnZpY3RvcmllbiIsImEiOiJja3RycWNhYmMwNGQ2MnVtaTNnMGNwMTJwIn0.HirDPOdiEpC0myYa1x45RA";

	var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
	/**/
