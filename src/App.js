import React from "react";
import { useState, useEffect, useRef } from "react";
import { Softkey, Map, MyPosition, Rank, AdsButton, Card } from "./components";
import amplitude from "amplitude-js";
import { useNavigation } from "./hooks";

export default function App() {
	/* DATA TREE AND APP STATUS */
	// datasets will be used to store the data requested and downloaded
	const [datasets, setData] = useState({
		//Global resume of the situation
		status: "Init",
		//Store User's position
		coords: null,
		//Store data from Taxi API
		ranks: null
	});

	/* MAP STATUS */
	const map = useRef();

	/* ARROW NAVIGATION */
	// Will be used to store the index of the selected result
	const [current, setNavigation] = useNavigation(0);

	/* TRACKING STATES */
	// We are using amplitude to store user events.
	useEffect(() => {
		switch (datasets.status) {
			case "Init":
				// At start, we are initializing Amplitude,
				amplitude.getInstance().init(process.env.REACT_APP_STATS_APIKEY);
				amplitude.getInstance().logEvent("Open App");
				//console.log("Open App");
				break;
			case "Located":
				//We don't trigger event once the user is located to save events
				break;
			case "Success":
				//console.log("Service Request");

				break;
			case "NoResult":
				amplitude.getInstance().logEvent("Service Request", {
					Quantity: 0,
					Latitude: datasets.coords[0],
					Longitude: datasets.coords[1]
				});
				//console.log("Service Request");
				break;
			case "NotLocated":
				amplitude.getInstance().logEvent("Error");
				//console.log("Error");
				break;
			case "Error":
				amplitude.getInstance().logEvent("Error", {
					Latitude: datasets.coords[0],
					Longitude: datasets.coords[1]
				});
				//console.log("Error");
				break;
			case "Map":
				amplitude.getInstance().logEvent("Map", {
					Latitude: datasets.coords[0],
					Longitude: datasets.coords[1]
				});
				//console.log("Error");
				break;
			case "Call":
				amplitude.getInstance().logEvent("Call", {
					Latitude: datasets.coords[0],
					Longitude: datasets.coords[1]
				});
				//console.log("Error");
				break;
			default:
				break;
		}
	}, [datasets]);

	/* LISTENER FOR KEY EVENT */
	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);

		return () => document.removeEventListener("keydown", onKeyDown);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [datasets]);

	const onKeyDown = (evt) => {
		if (evt.key === "ArrowUp" && datasets.status === "Map") {
			map.current.panBy([0, -30], { animate: false });
		} else if (evt.key === "ArrowDown" && datasets.status === "Map") {
			map.current.panBy([0, 30], { animate: false });
		} else if (evt.key === "ArrowLeft") {
			if (datasets.status !== "Map") {
				setNavigation(evt.key);
			} else {
				map.current.panBy([-30, 0], { animate: false });
			}
		} else if (evt.key === "ArrowRight") {
			if (datasets.status !== "Map") {
				setNavigation(evt.key);
			} else {
				map.current.panBy([30, 0], { animate: false });
			}
		} else if (evt.key === "Backspace") {
			if (datasets.status === "Map") {
				setData((prev) => ({
					...prev,
					status: "Success"
				}));
				evt.preventDefault();
			} else {
				return;
			}
		} else if (evt.key === "1") {
			map.current.zoomIn && map.current.zoomIn();
		} else if (evt.key === "3") {
			map.current.zoomIn && map.current.zoomOut();
		} else {
			return;
		}
	};

	/* BEHAVIOUR REGARDING THE APP STATUS */

	// Once we will know if the user gave his geolocation,
	// we will catch it with getCurrentPosition.
	const getCurrentPosition = () => {
		console.log("Get Position");
		navigator.geolocation.getCurrentPosition(
			function (position) {
				//Store The Data
				setData((prev) => ({
					...prev,
					status: "Located",
					coords: [position.coords.latitude, position.coords.longitude]
				}));

				//Get the taxi Ranks dataset
				getData(position.coords);
			},
			function (error) {
				if (error.code === error.PERMISSION_DENIED) {
					setData((prev) => ({
						...prev,
						status: "NotLocated"
					}));
				}
			}
		);
	};

	// After we get the user's localisation,
	// we request taxi rank on his position.
	const getData = (coords) => {
		fetch(
			process.env.REACT_APP_API +
				"?lat=" +
				coords.latitude +
				"&lng=" +
				coords.longitude
		)
			.then((res) => res.json())
			.then(
				(request) => {
					//Then, if we got results…
					if (request.results != null) {
						console.log("Service Request");
						//We Track the Request
						amplitude.getInstance().logEvent("Service Request", {
							Quantity: request.results.length,
							Latitude: coords.latitude,
							Longitude: coords.longitude
						});
						//We update the view
						setData((prev) => ({
							...prev,
							status: "Success",
							ranks: request.results
						}));

						//if we didn't got result…
					} else {
						setData((prev) => ({
							...prev,
							status: "NoResult"
						}));
					}
				},
				// if we cath any error…
				(error) => {
					setData((prev) => ({
						...prev,
						status: "Error",
						error: error
					}));
				}
			);
	};

	/* DEFINE SOFKEYS EVENT */
	// We define actions depending on app stat
	// !!To Improve: We use a switch, but so case are similar. Usinf IFs should be more efficent

	const softactions = () => {
		let phone = datasets.ranks && datasets.ranks[current.index].phone;
		switch (datasets.status) {
			case "Init" || "Located":
				//Any actions
				break;
			case "Success":
				return [
					{
						name: phone ? "Call" : "",
						fct: phone
							? () => {
									console.log("tel:" + phone);
									window.location = "tel:" + phone;
									setData((prev) => ({
										...prev,
										status: "Call"
									}));
							  }
							: false
					},
					{
						name: "Map",
						fct: () => {
							setData((prev) => ({
								...prev,
								status: "Map"
							}));
						}
					}
				];
			case "Call":
				return [
					{
						name: phone ? "Call" : "",
						fct: phone
							? (phone) => {
									window.location = "tel:" + phone;
									setData((prev) => ({
										...prev,
										status: "Call"
									}));
							  }
							: false
					},
					{
						name: "Map",
						fct: () => {
							setData((prev) => ({
								...prev,
								status: "Map"
							}));
						}
					}
				];
			case "NotLocated":
				return [
					{
						name: "Open Settings",
						fct: () => {
							if (typeof MozActivity === "function") {
								// eslint-disable-next-line
								let activity = new MozActivity({
									name: "configure",
									data: {
										target: "device",
										section: "appPermissions"
									}
								});
								activity.onsuccess = function () {
									console.log("successfully");
								};
								activity.onerror = function () {
									console.log("The activity encounter en error: " + this.error);
								};
							}
						}
					}
				];

			case "Error":
				return [
					{
						name: "Retry",
						fct: () => {
							setData((prev) => ({
								...prev,
								status: "Init"
							}));
						}
					}
				];

			case "Map":
				return [
					{ name: "Zoom In", fct: () => map.current.zoomIn() },
					{ name: "Zoom Out", fct: () => map.current.zoomOut() }
				];
			default:
				break;
		}
	};

	/* INITIALISATION */
	// We are requestings the user position.
	useEffect(() => {
		if (datasets.status === "Init" || datasets.status === "Retry") {
			getCurrentPosition();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [datasets.status]);

	return (
		<>
			<AdsButton />

			<Map center={datasets.coords} ref={map}>
				{datasets.coords && <MyPosition position={datasets.coords} />}
				{datasets.ranks && (
					<Rank
						position={[
							datasets.ranks[current.index].lat,
							datasets.ranks[current.index].lng
						]}
					/>
				)}
			</Map>
			<Card
				position={datasets.coords}
				content={datasets.ranks || datasets.status}
				index={current.index}
				visibility={datasets.status !== "Map"}
			></Card>

			<Softkey>{softactions()}</Softkey>
		</>
	);
}

// Datasets used acrross the app
// =============================
//
// The _status_ Could be:
// Init: Requesting your location…
// Located: Searching taxi around…
// NotLocated: You didn't accept to share your location
// Error: Looks like there was a problem. Restart the app
// NoResult: We didn't find nearby taxi ranks.
// Successfull:

// Once we update `page`, we update also the Action's name and event, the textual description and the marker on map.

// Softkey: !datasets.sets.ranks[n].phone && "Disabled"
// Softkey: datasets.sets.ranks[n].phone ? "Call" : "No phone"
// Softkey: datasets.sets.ranks[n].phone && ()=>{}
// Card: datasets.sets.ranks || datasets.status
// Map: coords && <MaPosition />
// Map: datasets.data.ranks && <Rank />
