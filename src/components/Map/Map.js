import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import css from "./Map.module.css";
import img from "./images/marker.svg";
import "./Leaflet.1.7.1.css";

//export function Map({ center, children, zoom }) {
export const Map = React.forwardRef((props, ref) => {
	const { center, children } = props;
	/* SETUP REF */
	// This ref is use to update map parameters */

	let [bounds, setBounds] = useState([]);
	/* DEFINE THE BOUNDS */

	/* We will define the higest and lowest bound's lattitudes and longitudes. By definition, latitude go from Nord to South with a scale of 90 to -90 and longitude go from West to Est with a scale of -180 to 180. If `A` is the Nord-Ouest corner, A.lgt should be the lowest value and A.lat should be the highest value. If `B` is the South-East corner, B.lgt should be the higgest value and B.lat should be the lowest value. */
	//N.B.: I could do it more simple https://stackoverflow.com/questions/27451152/fitbounds-of-markers-with-leaflet

	useEffect(() => {
		// A and B are respectively the Nord-Ouest and South-East corner.
		const A = { lat: null, lgt: null };
		const B = { lat: null, lgt: null };

		// We will compare coords children

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
	}, [children]);

	return (
		<div className={css.Container}>
			{center && (
				<MapContainer className={css.Map}>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
					{children}
					<Set bounds={bounds} ref={ref} />
				</MapContainer>
			)}
		</div>
	);
}); /**/

/* TRIGGER MAP UPDATE */

/* MapContainer props are immutable: changing them after they have been set a first time will have no effect on the Map instance or its container. The Leaflet Map instance created by the MapContainer element can be accessed by child components using one of the provided hooks or the MapConsumer component. The component is use to triger update on the map */

const Set = React.forwardRef((props, ref) => {
	const { bounds } = props;
	const map = useMap();

	if (ref) {
		ref.current = map;
	}

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
