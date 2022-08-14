import { useState, useEffect } from "react";
import { set, get } from "idb-keyval";
import { compare } from "compare-versions";
import { hit } from "../tools";
import { v4 as uuidv4 } from "uuid";
const version = process.env.REACT_APP_V;
//import useAnalytics from "./useAnalytics";

export const useStorage = () => {
	let [datasets, setDatasets] = useState(false);

	useEffect(() => {
		get("taxi")
			.then((data) => {
				//Depending on the browser, a successfull request could be an empty object {}. To be sure that's the first openning of the app. We will need to check if the object contain any data. We use the creation date and the version to make the difference between an opening, an update or an installation
				if (!data.created) {
					//if we don't have a creation date, it's an installation
					install();
				} else if (compare(data.version, version, "<") || !data.version) {
					//if we have a lower version number or no version number, it's an update
					update(data);
				} else if (process.env.NODE_ENV !== "production") {
					//During the developement, we always update the datasets to be sure we always follow the latest Data Model. That's simplify our developer life and void bug.
					update(data);
				} else {
					//Otherwie, it's a simple opening. We sent back the datasets
					open(data);
				}
			})
			.catch((err) => {
				//if it's fail, it's an installation,
				install();
			});
	}, []);

	//During an installation, we create the object from craft.
	const install = () => {
		//The Datasets that we will store
		const newDatasets = {
			version: version,
			createdAt: Date.now(),
			id: uuidv4(),
			datasets: {
				//Global resume of the situation
				action: "Choose Location",
				//Store User's position
				coords: null,
				//Store data from Taxi API
				ranks: null,
				//Store the index of ranks
				index: 0
			}
		};
		//We store offline the Datasets through the set function
		set("taxi", newDatasets)
			.then(() => {
				//Successfull installation
				//We sent back the datasets to the app
				setDatasets(newDatasets.datasets);
				//We push an event for analytics
				hit("Install App", null, newDatasets.id);
			})
			.catch((err) => {
				//Unsuccessfull installation
			});
	};

	//During an update, we push the previous data in the template except for the app version. This way, we have a new version number. Moreover, we clean the datasets: we remove unecessary data and update to the new data model.
	const update = (data) => {
		//The Datasets that we will store
		const newDatasets = {
			version: version,
			createdAt: data.createdAt,
			id: data.id,
			datasets: {
				//Global resume of the situation
				action: data.datasets.action ? data.datasets.action : "Choose Location",
				//Store User's position
				coords: data.datasets.coords ? data.datasets.coords : null,
				//Store data from Taxi API
				ranks: data.datasets.ranks ? data.datasets.ranks : null,
				//Store the index of ranks
				index: data.datasets.index ? data.datasets.index : 0
			}
		};

		set("taxi", newDatasets)
			.then(() => {
				//Successfull installation
				setDatasets(newDatasets.datasets);
				hit("Open App", { type: "update" }, newDatasets.id);
			})
			.catch((err) => {
				//Unsuccessfull installation
			});
	};

	// We open the app without performing any change on the offline data. Moreover, we push an event for the records.
	const open = (data) => {
		hit("Open App", {}, data.id);
		setDatasets(data.datasets);
	};

	//The App have access only to the data and not the metadata (version and the creation date). We use the updateDatasets to update the data outside of the hooks
	const updateDatasets = (datasets) => {
		get("taxi").then((metadata) => {
			const newData = {
				...metadata,
				datasets: {
					//We keep previous data to avoid data deletion by mistake
					...metadata.datasets,
					//We replace the values if we have some
					...datasets
				}
			};
			//We updating the database
			set("taxi", newData);
			//We sent back the datasets
			setDatasets(newData.datasets);
		});
	};

	return [datasets, updateDatasets];
};

/*DEV FUNCTIONS*/
//The function below is just use for devellopement purpose to re-install the datasets or look into it during devellopement

window.dev = {
	//Clear the database to perform a installation
	clear: () => {
		set("taxi", {});
		document.location.reload();
	},
	get: () => {
		get("taxi").then((data) => {
			console.log(data);
		});
	}
};
