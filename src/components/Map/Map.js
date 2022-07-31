import React, { useEffect, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { normalizeCoords } from "../../tools/getCurrentPosition";
import css from "./Map.module.css";
import { ReactComponent as Target } from "./images/target.svg";
import "./Leaflet.1.7.1.css";

//export function Map({ center, children, zoom }) {
export const Map = React.forwardRef((props, ref) => {
	const { center = [0, 0], children, update, keyboard = true } = props;
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
			setBounds(L.latLngBounds(L.latLng(30, -60), L.latLng(-30, 60)));
		}
	}, [children]);

	var mapboxUrl =
		"https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}";
	var accessToken =
		"pk.eyJ1IjoiYnZpY3RvcmllbiIsImEiOiJja3RycWNhYmMwNGQ2MnVtaTNnMGNwMTJwIn0.HirDPOdiEpC0myYa1x45RA";
	var id = "light-v9";

	var classicTiles =
		"https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnZpY3RvcmllbiIsImEiOiJja3RycWNhYmMwNGQ2MnVtaTNnMGNwMTJwIn0.HirDPOdiEpC0myYa1x45RA";

	var MyTiles =
		"https://api.mapbox.com/styles/v1/bvictorien/cl668wlli001515rvn4aobdou/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYnZpY3RvcmllbiIsImEiOiJja3RycWNhYmMwNGQ2MnVtaTNnMGNwMTJwIn0.HirDPOdiEpC0myYa1x45RA";

	var osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

	return (
		<div
			className={css.Container}
			data-fullscreen={keyboard}
			data-update={update ? true : false}
		>
			{update && (
				<div className={css.Target}>
					<Target />
				</div>
			)}
			{center && (
				<MapContainer className={css.Map} keyboardPanDelta={0}>
					<TileLayer url={classicTiles} />
					{children}
					<Set bounds={bounds} ref={ref} update={update} keyboard={keyboard} />
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

/* MapContainer props are immutable: changing them after they have been set a first time will have no effect on the Map instance or its container. The Leaflet Map instance created by the MapContainer element can be accessed by child components using one of the provided hooks or the MapConsumer component. The component is use to triger update on the map */

const Set = React.forwardRef((props, ref) => {
	const { bounds, update, keyboard } = props;
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
			map.zoomOut();
		} else if (evt.key === "3") {
			map.zoomIn();
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
			//update
			if (update) {
				update({
					target: "Results",
					status: "Located",
					coords: normalizeCoords(map.getCenter(), "map"),
					ranks: null,
					index: 0
				});
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
	}, [keyboard]);

	// We adjust the bounds of the map. We can use fitBounds for no animation and flyToBounds for animation.
	useEffect(() => {
		map.fitBounds(bounds, {
			// I don't undertsand anything about the value of the padding.
			padding: [16, 16]
		});
	}, [bounds, map]);

	map.invalidateSize();

	//Suppose to disa
	//map.keyboard.disable();

	return null;
});
