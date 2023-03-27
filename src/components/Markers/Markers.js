import React from "react";
import L from "leaflet";
import { Marker as LeafletMarker } from "react-leaflet";
import css from "./Markers.module.css";
import rank from "./marker-rank.svg";
import { normalizeCoords } from "../../tools";

/* MARKERS */
/* We use a set of compoments to setup specificities for our two markers: Our Current Position and the Taxi ranks */

export function Marker(props) {
  const { position, name } = props;

  let properties;

  //Setup the properties for my-position marker
  if (name === "my-position") {
    properties = new L.divIcon({
      iconSize: new L.Point(15, 15),
      className: css.here,
    });
  }

  //Setup the properties for rank marker
  if (name === "rank") {
    properties = new L.Icon({
      iconUrl: rank,
      iconAnchor: null,
      popupAnchor: null,
      shadowUrl: null,
      shadowSize: null,
      shadowAnchor: null,
      iconSize: new L.Point(24, 32),
    });
  }

  console.log(position);

  if (!position || !properties) return;
  return <LeafletMarker position={position} icon={properties} />;
}
