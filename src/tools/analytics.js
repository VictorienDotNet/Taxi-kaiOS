import amplitude from "amplitude-js";
const version = process.env.REACT_APP_V;

export const hit = (name, properties, id) => {
	if (!name) return false;

	if (process.env.NODE_ENV !== "production") {
		console.log(name, {
			version: version,
			...properties
		});
	}

	if (id) {
		amplitude.getInstance().init(process.env.REACT_APP_STATS_APIKEY, id);
	} else {
		amplitude.getInstance().init(process.env.REACT_APP_STATS_APIKEY);
	}

	amplitude.getInstance().logEvent(name, {
		version: version,
		...properties
	});
};
