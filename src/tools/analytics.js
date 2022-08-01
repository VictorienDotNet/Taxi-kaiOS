import amplitude from "amplitude-js";
const version = process.env.REACT_APP_V;

export const hit = (name, properties) => {
	if (!name) return false;

	console.log(process.env.NODE_ENV);

	if (process.env.NODE_ENV !== "production") {
		console.log(name, {
			version: version,
			...properties
		});
	}

	amplitude.getInstance().init(process.env.REACT_APP_STATS_APIKEY);

	amplitude.getInstance().logEvent(name, {
		version: version,
		...properties
	});
};
