import React from "react";
import { Onboarding, Map, Results } from "./components";
import { useEffect } from "react";
import { useStorage, usePrevious } from "./hooks";
import { hit } from "./tools";

export default function App() {
	/* Use Storage is an offline database */
	// Once we trigger it, the function will fecth the data available on the device. During the process, the function will figure out if it's an app openning, an update or installation
	let [data, update] = useStorage();
	let previousData = usePrevious(data);

	/* Analytics */
	//All analytics is trigger from here except for openning, installation and update which is trigger in the useStorage hook.
	//We look into the previous state of data to not track twice an event and avoid back navigation tracking
	useEffect(() => {
		let { action, ranks, index, coords } = data;
		let a = action;
		let b = previousData && previousData.action;
		let properties = {};

		//avoid double event and back navigation tracking
		if (a === b || (b === "Display Map" && a === "View Results")) return false;

		//configure properties based on the event
		if (a === "Call Taxi Service")
			properties = {
				phone: ranks[index].phone,
				name: ranks[index].name
			};

		if (a === "View Results" || a === "View Any Results")
			properties = {
				quantity: ranks ? ranks.length : 0,
				latitude: coords.lat,
				longitude: coords.lng
			};

		//We remove block usell event to avoid to many hits

		//!\\ Need to manage new event name
		//!\\ Need to verify property event

		hit(a, properties);
	}, [data, previousData]);

	/* State Manager */
	// The "to" function handle the states management. Triggered by the compomeents, "to" apply the correct data (e.g. : reseting coords) and redirect to the corresponding view according to the action.

	const to = (action, props) => {
		if (props && !action) {
			if (props.coords) {
				update({
					action: "Waiting Results",
					coords: props.coords,
					ranks: null,
					index: 0
				});
				return false;
			} else if (props.ranks) {
				update({
					action: props.ranks.length === 0 ? "View Any Result" : "View Results",
					ranks: props.ranks,
					index: 0
				});
				return false;
			}
		}

		switch (action) {
			case "Choose Location":
				update({ action: "Choose Location" });

				break;
			case "Waiting Location":
				update({ action: "Waiting Location" });

				break;
			case "Got Location":
				update({ action: "Got Location", ...props });

				break;
			case "Handle Denied Location":
				update({ action: "Handle Denied Location" });

				break;
			case "Handle Location Error":
				update({ action: "Handle Location Error" });
				break;
			case "Choose On Map":
				update({ action: "Choose On Map" });
				break;
			case "Waiting Results":
				update({
					action: "Waiting Results",
					...props
				});
				break;
			case "View Results":
				update({ action: "View Results", ...props });
				break;
			case "View Any Results":
				update({ action: "View Any Result" });
				break;
			case "Display Map":
				update({ action: "Display Map" });
				break;
			default:
				break;
		}
	};

	/* Render */
	//What view to render is written in the offline datasets as target. We apply strickly the rules here

	if (!data) {
		return <div></div>;
	} else if (
		data.action === "Learn Basics" ||
		data.action === "Choose Location" ||
		data.action === "Waiting Location" ||
		data.action === "Got Location" ||
		data.action === "Handle Denied Location" ||
		data.action === "Handle Location Error"
	) {
		return <Onboarding data={data} to={to} />;
	} else if (data.action === "Choose On Map") {
		return <Map to={to} />;
	} else if (
		data.action === "Waiting Results" ||
		data.action === "View Results" ||
		data.action === "View Any Result" ||
		data.action === "Display Map"
	) {
		return <Results data={data} to={to} />;
	} else {
		return <div>There is an error.</div>;
	}
}
