import React from "react";
import { Onboarding, Map, Results, Call } from "./components";
import { useEffect } from "react";
import { useStorage, usePrevious } from "./hooks";
import { hit } from "./tools";

export default function App() {
	/*** Use Storage is an offline database ***/
	// Once we trigger it, the function will fecth the data available on the device. During the process, the function will figure out if it's an app openning, an update or installation
	let [data, update] = useStorage();
	let previousData = usePrevious(data);

	/*** Analytics ***/
	//All analytics is trigger from here except for openning, installation and update which is trigger in the useStorage hook.
	//We look into the previous state of data to not track twice an event and avoid back navigation tracking
	useEffect(() => {
		let { action, ranks, index, coords } = data;
		let a = action;
		let b = previousData && previousData.action;
		let properties = {};

		//avoid double event and back navigation tracking
		if (a === b) return false;
		if (a === "View Results") {
			if (
				b === "Display Map" ||
				b === "Review Taxi Service" ||
				b === "Satisfy With Taxi Service" ||
				b === "Unsatisfy With Taxi Service"
			)
				return false;
		}

		//configure properties based on the event
		if (
			a === "Call Taxi Service" ||
			a === "Satisfy With Taxi Service" ||
			a === "Unsatisfy With Taxi Service"
		)
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

		hit(a, properties);
	}, [data, previousData]);

	/*** State Manager ***/
	// The "to" function handle the states management. Triggered by the compomeents, "to" apply the correct data (e.g. : reseting coords) and redirect to the corresponding view according to the action.

	const to = (input) => {
		let output;
		let { coords, ranks, action } = input;

		//Most of the time, the input it's just a string with the state where to go. However, sometime we receive an object to push into the datatsets
		if (typeof input === "string") {
			//We have only a string, it's an action (state)
			output = { action: input };
		} else {
			//It's object, we push the input into the datasets. However, somes rules apply to avoid bugs and crashs.

			//If we reset the coord or the ranks. We reset the index too. Otherwise, it could target a childrien which doesn't exist.
			if (ranks || coords) {
				input.index = 0;
				//If we have only coords, we reset the ranks which was associated to the previous coords.
				input.ranks = ranks ? ranks : null;
			}

			//If we don't have "action", we guess it according to the input
			if (!action && coords) {
				//New coords, we need to wait for the results again.
				input.action = "Waiting Results";
			} else if (!action && ranks) {
				//New results, we need to display it
				input.action = ranks.length === 0 ? "View Any Result" : "View Results";
			}

			//Once we applied the rules, the ouput is ready.
			output = input;
		}

		//We update the datasets
		update({ ...data, ...output });
	};

	/*** Render ***/
	//What view to render is written in the offline datasets as target. We apply strickly the rules here

	//A path to display Results when we have "Call Taxi Service" stored as action
	/*
	if (data.action === "Call Taxi Service") {
		data.action = data.ranks.length === 0 ? "View Any Result" : "View Results";
		hit("Call Taxi Service", {
			phone: data.ranks[data.index].phone,
			name: data.ranks[data.index].name
		});
	}/**/

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
	} else if (
		data.action === "Call Taxi Service" ||
		data.action === "Review Taxi Service" ||
		data.action === "Unsatisfy With Taxi Service" ||
		data.action === "Satisfy With Taxi Service"
	) {
		return <Call data={data} to={to} hit={hit} />;
	} else {
		return <div>There is an error.</div>;
	}
}
