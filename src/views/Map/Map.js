import React, { useEffect, useRef } from "react";
import css from "./Map.module.css";
import { Map as MapTiles, Marker, Softkey, Icon } from "../../components";
import { normalizeCoords } from "../../tools";

//export function Map({ center, children, zoom }) {
export const Map = (props) => {
  const { data, routeTo } = props;
  const { currentView, coords, ranks, index } = data;
  const i = 25; //map increment for arrow navigation

  const map = useRef();

  const onSoftKeyCenter = () => {
    routeTo({
      currentView: "Waiting Results",
      coords: normalizeCoords(map.current.getCenter(), "map"),
    });
  };

  const onSoftKeyLeft = () => {
    map.current.zoomOut();
  };

  const onSoftKeyRight = () => {
    map.current.zoomIn();
  };

  /* DEFINE KEYBOARD NAVIGATION */
  useEffect(() => {
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
        if (currentView === "Choose On Map") {
          routeTo("Choose Location");
        } else if (currentView === "Display On Map") {
          routeTo("View Results");
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [routeTo]);

  return (
    <div className={css.Container}>
      <div className={css.Target}>
        <Icon name="target" />
      </div>

      <MapTiles ref={map}>
        {coords && <Marker name="my-position" position={coords} boundable />}
        {currentView === "Display On Map" && (
          <Marker
            name="rank"
            position={[ranks[index].lat, ranks[index].lng]}
            boundable
          />
        )}
      </MapTiles>

      <Softkey>
        {[
          { fct: onSoftKeyLeft, name: "Zoom Out" },
          { fct: onSoftKeyCenter, name: "Select" },
          { fct: onSoftKeyRight, name: "Zoom In" },
        ]}
      </Softkey>
    </div>
  );
}; /**/
