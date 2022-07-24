import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import css from "./Map.module.css";
import { ReactComponent as Target } from "./images/target.svg";
import "./Leaflet.1.7.1.css";

//export function Map({ center, children, zoom }) {
export const Map = React.forwardRef((props, ref) => {
  const { center = [0, 0], children, update, fullscreen = true } = props;
  /* SETUP REF */
  // This ref is use to update map parameters */

  /* DEFINE THE BOUNDS */
  let [bounds, setBounds] = useState([]);

  /* We will define the higest and lowest bound's lattitudes and longitudes. By definition, latitude go from Nord to South with a scale of 90 to -90 and longitude go from West to Est with a scale of -180 to 180. If `A` is the Nord-Ouest corner, A.lgt should be the lowest value and A.lat should be the highest value. If `B` is the South-East corner, B.lgt should be the higgest value and B.lat should be the lowest value. */
  //N.B.: I could do it more simple https://stackoverflow.com/questions/27451152/fitbounds-of-markers-with-leaflet

  useEffect(() => {
    // A and B are respectively the Nord-Ouest and South-East corner.
    const A = { lat: null, lgt: null };
    const B = { lat: null, lgt: null };

    // We will compare coords children
    if (children) {
      children.forEach((child) => {
        if (child && child.props.position) {
          // Marker should have a position property where the firs value of the array is the latitude and the second value of the array is the longitutde.
          let C = child.props.position[0]; //lat
          let D = child.props.position[1]; //lgt

          // A.lat should be the highest value
          A.lat = A.lat ? (A.lat > C ? A.lat : C) : C;
          // B.lat should be the lowest value
          B.lat = B.lat ? (B.lat < C ? B.lat : C) : C;
          // A.lgt should be the lowest value
          A.lgt = A.lgt ? (A.lgt < D ? A.lgt : D) : D;
          //B.lgt should be the higgest value
          B.lgt = B.lgt ? (B.lgt > D ? B.lgt : D) : D;
        }
      });
      //Create the Bounds Object
      setBounds(L.latLngBounds(L.latLng(A.lat, A.lgt), L.latLng(B.lat, B.lgt)));
    } else {
      setBounds(L.latLngBounds(L.latLng(90, -180), L.latLng(-90, 180)));
    }
  }, [children]);

  return (
    <div className={css.Container}>
      {fullscreen && (
        <div className={css.Target}>
          <Target />
        </div>
      )}
      {center && (
        <MapContainer className={css.Map}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {children}
          <Set
            bounds={bounds}
            ref={ref}
            update={update}
            fullscreen={fullscreen}
          />
        </MapContainer>
      )}
    </div>
  );
}); /**/

/* TRIGGER MAP UPDATE */

/* MapContainer props are immutable: changing them after they have been set a first time will have no effect on the Map instance or its container. The Leaflet Map instance created by the MapContainer element can be accessed by child components using one of the provided hooks or the MapConsumer component. The component is use to triger update on the map */

const Set = React.forwardRef((props, ref) => {
  const { bounds, update } = props;
  const map = useMap();

  if (ref) {
    ref.current = map;
  }

  /* Here, we setup all keyboard actions*/
  //First, we define the incremental int from the keyboard
  const i = 25;
  //Then, we define the onKeyDown function
  const onKeyDown = (evt) => {
    //Events related to map translate
    if (evt.key === "ArrowUp") {
      map.panBy([0, -i], { animate: false });
    } else if (evt.key === "ArrowDown") {
      map.panBy([0, i], { animate: false });
    } else if (evt.key === "ArrowLeft") {
      map.panBy([-i, 0], { animate: false });
    } else if (evt.key === "ArrowRight") {
      map.panBy([i, 0], { animate: false });
      //Events related to zooms
    } else if (evt.key === "1") {
      map.zoomIn();
    } else if (evt.key === "3") {
      map.zoomOut();
      //This last entry, trigger the onSubmit function and sent back the center of the map to the parent
    } else if (evt.key === "Enter") {
      //update
      let c = map.getCenter();
      if (update) {
        update({ target: "Results", coords: [c.lat, c.lng] });
      }
    } else {
      return;
    }
    //evt.preventDefault();
  };
  //Secondly,  We mount the onKeyDown when the app start
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // We adjust the bounds of the map. We can use fitBounds for no animation and flyToBounds for animation.
  useEffect(() => {
    map.fitBounds(bounds, {
      // I don't undertsand anything about the value of the padding.
      padding: [16, 16]
    });
  }, [bounds, map]);

  map.invalidateSize();

  return null;
});
