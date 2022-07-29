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
		let { status, ranks, index, coords } = data;
		let a = status;
		let b = previousData && previousData.status;
		let properties = {};

		//avoid double event and back navigation tracking
		if (a === b || (b === "Map" && a === "Success")) return false;

		//configure properties based on the event
		if (a === "Call")
			properties = {
				phone: ranks[index].phone,
				name: ranks[index].name
			};

		if (a === "Success" || a === "NoResult")
			properties = {
				quantity: ranks ? ranks.length : 0,
				latitude: coords.lat,
				longitude: coords.lng
			};

		//We update the status name into event name
		a = a === "Success" || a === "NoResult" ? "Service Request" : a;

		//We remove block usell event to avoid to many hits

		//!\\ Need to manage new event name
		//!\\ Need to verify property event

		hit(a, properties);
	}, [data, previousData]);

	/* Render */
	//What view to render is written in the offline datasets as target. We apply strickly the rules here

	if (!data) {
		return <div></div>;
	} else if (data.target === "Onboarding") {
		return <Onboarding update={update} />;
	} else if (data.target === "Map") {
		return <Map update={update} />;
	} else if (data.target === "Results") {
		return <Results data={data} update={update} />;
	} else {
		return <div>There is an error.</div>;
	}
}
