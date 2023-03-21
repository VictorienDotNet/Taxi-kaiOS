import React from "react";
import L from "leaflet";
import { Marker } from "react-leaflet";
import css from "./Map.module.css";
import img from "./images/marker.svg";

/* MARKERS */

/* We use a set of compoments to setup specificities for our two markers: Our Current Position and the Taxi ranks */

// MyPosition: Display a blue dot on the user's position.
export function MyPosition(props) {
	const { position } = props;

	const settings = new L.divIcon({
		iconSize: new L.Point(15, 15),
		className: css.here
	});

	if (position) {
		return <Marker position={position} icon={settings} />;
	} else {
		return false;
	}
} /**/

// Taxi Rank : Display a marker where the station rank is.
export function Rank(props) {
	const { position } = props;

	const settings = new L.Icon({
		iconUrl: img,
		iconAnchor: null,
		popupAnchor: null,
		shadowUrl: null,
		shadowSize: null,
		shadowAnchor: null,
		iconSize: new L.Point(24, 32)
	});

	return <Marker position={position} icon={settings} />;
} /**/
