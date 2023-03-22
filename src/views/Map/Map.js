import React, { useEffect, useRef } from "react";
import css from "./Map.module.css";
import { ReactComponent as Target } from "./images/target.svg";
import { Map as MapTiles, Marker, Softkey } from "../../components";
import { normalizeCoords } from "../../tools";

//export function Map({ center, children, zoom }) {
export const Map = (props) => {
  const { data, to, i = 25 } = props;

  const map = useRef();

  let coords = {
    my: data.coords,
    rank: [data.ranks[data.index].lat, data.ranks[data.index].lng],
  };

  const onKeyDown = (evt) => {
    //Events related to zoom and pan
    if (evt.key === "ArrowUp") {
      map.current.panBy([0, -i], { animate: true });
    } else if (evt.key === "ArrowDown") {
      map.current.panBy([0, i], { animate: true });
    } else if (evt.key === "ArrowLeft") {
      map.current.panBy([-i, 0], { animate: true });
    } else if (evt.key === "ArrowRight") {
      map.current.panBy([i, 0], { animate: true });
    }

    //Events related to app routing
    if (evt.key === "Backspace") {
      to("Choose Location");
    }
  };

  const onSoftKeyCenter = () => {
    to({
      action: "Waiting Results",
      coords: normalizeCoords(map.current.getCenter(), "map"),
    });
  };

  const onSoftKeyLeft = () => {
    map.current.zoomOut();
  };

  const onSoftKeyRight = () => {
    map.current.zoomIn();
  };

  //We mount the onKeyDown when the app start
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className={css.Container}>
      <div className={css.Target}>
        <Target />
      </div>

      <MapTiles ref={map}>
        <Marker name="my-position" position={coords.my} boundable />
      </MapTiles>

      <div className={css.SoftkeyContainer}>
        <Softkey>
          {[
            { fct: onSoftKeyLeft, name: "Zoom Out" },
            { fct: onSoftKeyCenter, name: "Select" },
            { fct: onSoftKeyRight, name: "Zoom In" },
          ]}
        </Softkey>
      </div>
    </div>
  );
}; /**/
