import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { normalizeCoords } from "../../tools/getCurrentPosition";
import css from "./Map.module.css";
import { getBounds, getZoomLevel, getCenter } from "../../tools";
import "./Leaflet.1.7.1.css";

//export function Map({ center, children, zoom }) {
export const Map = React.forwardRef((props, ref) => {
  const { center = [0, 0], children, keyboard = true, to, className } = props;
  /* SETUP REF */
  // This ref is use to update map parameters */

  /* DEFINE THE BOUNDS */
  let [params, setParams] = useState({
    defaultBounds: L.latLngBounds(L.latLng(30, -60), L.latLng(-0, 60)),
  });

  /* We will define the higest and lowest bound's lattitudes and longitudes. By definition, latitude go from Nord to South with a scale of 90 to -90 and longitude go from West to Est with a scale of -180 to 180. If `A` is the Nord-Ouest corner, A.lgt should be the lowest value and A.lat should be the highest value. If `B` is the South-East corner, B.lgt should be the higgest value and B.lat should be the lowest value. */
  //N.B.: I could do it more simple https://stackoverflow.com/questions/27451152/fitbounds-of-markers-with-leaflet

  useEffect(() => {
    if (!Array.isArray(children)) return;

    /* DEFINE THE BOUNDS */
    let defaultBounds, defaultLeafletBounds, minZoom, minCenter;

    // Select childrens which we will put in the inital bounds
    const boundable = children.filter((child) => {
      return child && child.props && child.props.boundable;
    });

    // Calculate associated value to the bounds
    if (boundable) {
      defaultBounds = getBounds(boundable, (child) => {
        return child && child.props && child.props.position;
      });

      defaultLeafletBounds = L.latLngBounds(
        L.latLng(defaultBounds.NE.lat, defaultBounds.NE.lng),
        L.latLng(defaultBounds.SW.lat, defaultBounds.SW.lng)
      );

      minZoom = getZoomLevel(defaultBounds, { width: 240, height: 240 });
      minCenter = defaultLeafletBounds.getCenter();
    }

    /* DEFINE THE SNAPPING DURING ZOOM */
    let maxCenter, maxCenterBounds, maxCenterLeafletBounds;

    //Select childrens which we will focus during zoom
    const zoomable = children.filter((child) => {
      return child && child.props && child.props.zoomable;
    });

    if (zoomable) {
      maxCenterBounds = getBounds(zoomable, (child) => {
        return child && child.props && child.props.position;
      });

      maxCenterLeafletBounds = L.latLngBounds(
        L.latLng(maxCenterBounds.NE.lat, maxCenterBounds.NE.lng),
        L.latLng(maxCenterBounds.SW.lat, maxCenterBounds.SW.lng)
      );

      maxCenter = maxCenterLeafletBounds.getCenter();
    }

    setParams({
      minCenter: minCenter,
      minZoom: minZoom,
      defaultBounds: defaultLeafletBounds,
      maxCenter: maxCenter,
      maxZoom: 22,
    });
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
      {center && (
        <MapContainer className={css.Map} keyboardPanDelta={0}>
          <TileLayer url={tiles} />
          {children}
          <Set ref={ref} to={to} keyboard={keyboard} params={params} />
        </MapContainer>
      )}
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
