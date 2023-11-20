import * as amplitude from "@amplitude/analytics-browser";
const version = process.env.REACT_APP_V;

export const hit = (name, properties, id) => {
  if (!name) return false;

  if (process.env.NODE_ENV !== "production") {
    console.log(name, {
      version: version,
      ...properties,
    });
  } else {
    if (id) {
      amplitude.init(process.env.REACT_APP_STATS_APIKEY, id);
    } else {
      amplitude.init(process.env.REACT_APP_STATS_APIKEY);
    }

    amplitude.track(name, {
      version: version,
      ...properties,
    });
  }
};
