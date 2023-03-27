import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import css from "./Map.module.css";
import { getBounds } from "../../tools";
import "./Leaflet.1.7.1.css";

/* DEFINE THE DEFAULT MAP PARAMETERS */
// The initial Zoom and Center are the position parameter of the first openingl; The defaultZoom is use when there is a single marker on the map and not zoom defined
let initialCenter = [-6.81189846638549, 39.281616210937]; //Dar Es Salam
let initalZoom = 1;
let defaultZoom = 11;
let tiles = {
  username: "mapbox",
  id: "streets-v9",
  size: 256, //512 or 256
  token: process.env.REACT_APP_MAP_TOKEN,
};

export const Map = React.forwardRef((props, ref) => {
  /* DEFINE THE PARAMETRES */
  const { children, className } = props;
  let [mapProps, setMapProps] = useState(null);

  /* CONSTRUCT THE URL FOR THE TILES */
  let tilesURL = `https://api.mapbox.com/styles/v1/${tiles.username}/${tiles.id}/tiles/${tiles.size}/{z}/{x}/{y}?access_token=${tiles.token}`;

  /* CALCULATE THE MAP BOUNDS BASED ON MARKERS */
  //We calculate the map bound based on the markers recieve as children. We take in consideration only children with a `boundable` prop.
  useEffect(() => {
    //## Firstly, we select the children concerned by the bounds
    let boundable;
    if (children && Array.isArray(children)) {
      let childs = children.filter((child) => {
        return child && child.props && child.props.boundable;
      });
      boundable = childs.length === 1 ? childs[0] : childs;
    } else if (children && children.props.boundable) {
      boundable = children;
    }

    //## Secondly, if there is multiple children we define a bounds, otherwise we center the map on the unique children. At the end, if there is not children, we center on the default values.
    if (Array.isArray(boundable)) {
      //### The case with multiple children:
      let boundpoints, bounds;

      // We select points at the border of the bounds
      //TODO: getBounds could directly setup the bounds with the same parameters name than Leaflet Bounds parameter. Maybe it will avoid to use L.latLngBounds function.
      boundpoints = getBounds(boundable, (child) => {
        return child && child.props && child.props.position;
      });

      //We convert points into a Leaflet object
      bounds = L.latLngBounds(
        L.latLng(boundpoints.NE.lat, boundpoints.NE.lng),
        L.latLng(boundpoints.SW.lat, boundpoints.SW.lng)
      );

      //We update the map with the bounds
      setMapProps({
        bounds: bounds,
      });
    } else if (boundable) {
      //### The case with one children:
      //We center the map on the only marker with the default zoom
      setMapProps({
        center: boundable.props.position,
        zoom: defaultZoom,
      });
    } else {
      //### The case without children:
      setMapProps({
        center: initialCenter,
        zoom: initalZoom,
      });
    }
  }, [children]);

  return (
    <div className={`${css.Container} ${className}`}>
      {mapProps && (
        <MapContainer {...mapProps} className={css.Map} keyboardPanDelta={0}>
          <TileLayer url={tilesURL} />
          <Set ref={ref} mapProps={mapProps} />
          {children}
        </MapContainer>
      )}
    </div>
  );
}); /**/

/* TRIGGER MAP UPDATE */

/* MapContainer props are immutable: changing them after they have been set a first time will have no effect on the Map instance or its container. The Leaflet Map instance created by the MapContainer element can be accessed by child components using one of the provided hooks or the MapConsumer component. The component is use to triger re-render on the map */

const Set = React.forwardRef((props, ref) => {
  const { mapProps } = props;

  /* DEFINE THE REF */
  //We sent back a `ref` object to parents to give them the ability to update the map
  const map = useMap();

  if (ref) {
    ref.current = map;
  }

  /* UPDATE tHE MAP IN PROPS IS UPDATED */
  useEffect(() => {
    let { bounds, center, zoom } = mapProps;
    if (bounds) {
      map.fitBounds(bounds, {
        // I don't undertsand anything about the value of the padding.
        padding: [24, 48],
      });
    } else if (center) {
      let c = new L.LatLng(center[0], center[1]);
      let z = zoom || defaultZoom;
      map.setView(c, z);
    }
  }, [map, mapProps]);

  map.invalidateSize();
  return null;
});
