import React, { useRef, useEffect, useState } from "react";
//Exclude Mapbox of transpilation create a bug on kaiOS
import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"; // eslint-disable-line import/no-webpack-loader-syntax

import css from "./Map.module.css";

mapboxgl.accessToken =
	"pk.eyJ1IjoiYnZpY3RvcmllbiIsImEiOiJja3RycWNhYmMwNGQ2MnVtaTNnMGNwMTJwIn0.HirDPOdiEpC0myYa1x45RA";

export function Map(props) {
	const coords = {
		longitude: 14.419289183894561,
		latitude: 50.08572091535505
	};

	const mapContainer = useRef(null);
	const map = useRef(null);
	const [zoom, setZoom] = useState(14);
	//We don't use these variable yet
	//const [lng, setLng] = useState(null);
	//const [lat, setLat] = useState(null);

	useEffect(() => {
		if (map.current || !coords) return; // initialize map only once

		// Wire up loaded worker to be used instead of the default
		mapboxgl.workerClass = MapboxWorker;
		//Create the MapboxGL Object
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [coords.longitude, coords.latitude],
			zoom: zoom
		});

		// Once the map is loaded we will display the user position
		map.current.on("load", () => {
			// We use a marker with mapbox CSS
			const dot = document.createElement("div");
			dot.className = "mapboxgl-user-location-dot";
			// We Display the marker on the map
			new mapboxgl.Marker(dot)
				.setLngLat([coords.longitude, coords.latitude])
				.addTo(map.current);
		});
	});

	useEffect(() => {
		if (!map.current || !coords) return; // wait for map to initialize
		map.current.on("move", () => {
			setZoom(map.current.getZoom().toFixed(2));
			//We don't use these variable yet
			//setLng(map.current.getCenter().lng.toFixed(4));
			//setLat(map.current.getCenter().lat.toFixed(4));
		});
	});

	return <div ref={mapContainer} className={css.Map} />;
}
