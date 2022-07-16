import React from "react";
import { useState, useEffect, useRef } from "react";
import { Softkey, Map, MyPosition, Rank, AdsButton, Card } from "./components";
import amplitude from "amplitude-js";
import { useNavigation } from "./hooks";
import { set, get } from "idb-keyval";

/* DEFINE APP VERSION */
// The import doesn't work with the build
//import { version } from "/package.json";
//We are force to define manuallt for now
const version = "1.0.3";

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

	/* INSTALLATION and OPENNING */
	// At Launch, we are tracking new installion and openning
	useEffect(() => {
		amplitude.getInstance().init(process.env.REACT_APP_STATS_APIKEY);
		get("taxi")
			//if it's success, it's an openning
			.then((data) => {
				//but to be sure, we are checking if a creating date it's here
				if (data.created) {
					amplitude.getInstance().logEvent("Open App", { Version: version });
				} else {
					//We are seting up a database for the next openning
					set("taxi", { created: Date.now() })
						.then((data) => {
							amplitude.getInstance().logEvent("Install App", {
								Version: version,
								State: "Completed"
							});
						})
						.catch((err) => {
							amplitude.getInstance().logEvent("Install App", {
								Version: version,
								State: "Error",
								Error: err
							});
						});
				}
			})
			//if it's fail, it's an installation
			.catch((err) => {
				//We are seting up a database for the next openning
				set("taxi", { created: Date.now() })
					.then((data) => {
						amplitude.getInstance().logEvent("Install App", {
							Version: version,
							State: "Completed"
						});
					})
					.catch((err) => {
						amplitude.getInstance().logEvent("Install App", {
							Version: version,
							State: "Error",
							Error: err
						});
					});
			});
	}, []);

	/* TRACKING STATES */
	// We are using amplitude to store user events.
	useEffect(() => {
		switch (datasets.status) {
			case "Init":
				//We don't trigger event since it's same as Open App or Install App
				break;
			case "Located":
				//We don't trigger event once the user is located to save events
				break;
			case "Success":
				break;
			case "NoResult":
				amplitude.getInstance().logEvent("Service Request", {
					Quantity: 0,
					Latitude: datasets.coords[0],
					Longitude: datasets.coords[1],
					Version: version
				});

				break;
			case "NotLocated":
				amplitude.getInstance().logEvent("Error", { Version: version });

				break;
			case "Error":
				amplitude.getInstance().logEvent("Error", {
					Latitude: datasets.coords[0],
					Longitude: datasets.coords[1],
					Version: version
				});

				break;
			case "Map":
				amplitude.getInstance().logEvent("Map", {
					Latitude: datasets.coords[0],
					Longitude: datasets.coords[1],
					Version: version
				});

				break;
			case "Call":
				amplitude.getInstance().logEvent("Call", {
					Latitude: datasets.coords[0],
					Longitude: datasets.coords[1],
					Version: version
				});

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
		if (evt.key === "ArrowLeft" || evt.key === "ArrowRight") {
			if (datasets.status !== "Map") {
				setNavigation(evt.key);
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
		} else {
			return;
		}
	};

	/* BEHAVIOUR REGARDING THE APP STATUS */

	// Once we will know if the user gave his geolocation,
	// we will catch it with getCurrentPosition.
	const getCurrentPosition = () => {
		const IDWatch = navigator.geolocation.watchPosition(
			//if it's a success
			function (position) {
				//We Stop the Watch function
				navigator.geolocation.clearWatch(IDWatch);
				//We Store The Data and Trigger the next states
				setData((prev) => ({
					...prev,
					status: "Located",
					coords: [position.coords.latitude, position.coords.longitude]
				}));

				//We requesting taxi Ranks from the API
				getData(position.coords);
			},
			//if it's a fail
			function (error) {
				if (error.code === error.PERMISSION_DENIED) {
					setData((prev) => ({
						...prev,
						status: "NotLocated"
					}));
				}
			},
			//We setup a Timeout in case of an unlimited loop of searching position
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 60000
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
						name: "Settings",
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
									//success
								};
								activity.onerror = function () {
									//error
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
			<Map
				center={datasets.coords}
				ref={map}
				fullscreen={datasets.status === "Map"}
			>
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
