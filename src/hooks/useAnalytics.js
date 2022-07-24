import { useState, useEffect } from "react";
import amplitude from "amplitude-js";
import { version } from "/package.json";

export const useAnalytics = ({ name, properties }) => {
	//Initialise the Amplitude Instance only once
	useEffect(() => {
		amplitude.getInstance().init(process.env.REACT_APP_STATS_APIKEY);
	}, []);

	//Sent an Event only if it's a new Event name
	useEffect(() => {
		amplitude.getInstance().logEvent(name, {
			version: version,
			...properties
		});
	}, [name]);

	return <></>;
};
