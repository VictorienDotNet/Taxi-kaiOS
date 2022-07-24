import { useState, useEffect } from "react";
import { set, get } from "idb-keyval";
import { version } from "/package.json";
import { compare } from "compare-versions";
//import useAnalytics from "./useAnalytics";

export const useStorage = () => {
	let [datasets, setDatasets] = useState(null);

	useEffect(() => {
		get("taxi")
			.then((data) => {
				//Depending on the browser, a successfull request could be an empty object {}. To be sure that's the first openning of the app. We will need to check if the object contain any data. We use the app version to make the difference between an opening, an update or an installation
				if (!data.version && data.created) {
					//if we don't have a version number, but a created date, it's a historical database from version 1.0.2 and 1.0.3. It's an special update
					migrating(data);
				} else if (!data.version) {
					//if we don't have a version number, it's an installation
					install();
				} else if (compare(data.version, version, "<")) {
					//if we have a lower version number, it's an update
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

	//During an installation, we creating the object from craft. The object will be the template of the datas stored offline
	const install = () => {
		//The Datasets that we will store
		const newDatasets = {
			version: version,
			createdAt: Date.now(),
			datasets: {
				//Which view to target
				target: "Onboarding",
				//Global resume of the situation
				status: null,
				//Store User's position
				coords: null,
				//Store data from Taxi API
				ranks: null
			}
		};
		//We are storing offline the Datasets through the set function
		set("taxi", newDatasets)
			.then(() => {
				//Successfull installation
				//We sent back the datasets to the app
				setDatasets(newDatasets.datasets);
			})
			.catch((err) => {
				//Unsuccessfull installation
			});
	};

	//During an update, we taking the exact datas, but we update the app version number in the object
	const update = (data) => {
		//The Datasets that we will store
		const updatedDatasets = {
			...data,
			version: version
		};

		set("taxi", updatedDatasets)
			.then(() => {
				//Successfull installation
				setDatasets(updatedDatasets.datasets);
			})
			.catch((err) => {
				//Unsuccessfull installation
			});
	};

	//During an migrating, we update the whole database and reformate according to the new scheme
	// In the specific case of v1.0.2 and v1.0.3, the previous database had only the value "created" which store the date of the databse creation
	const migrating = (data) => {
		//The Datasets that we will store
		const updatedDatasets = {
			createdAt: data.created,
			version: version,
			datasets: {
				//Which view to target
				target: "Onboarding",
				//Global resume of the situation
				status: null,
				//Store User's position
				coords: null,
				//Store data from Taxi API
				ranks: null
			}
		};

		set("taxi", updatedDatasets)
			.then(() => {
				//Successfull installation
				setDatasets(updatedDatasets.datasets);
			})
			.catch((err) => {
				//Unsuccessfull installation
			});
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

	// We open the app without performing any change on the offline data. However, in the special case that the user will not complete the onboarding, we reset the "target" on Onboarding.
	const open = (data) => {
		let d = data.datasets;
		setDatasets({
			...d,
			target: d.coords ? d.target : "Onboarding"
		});
	};
	//Clear it's only use in case of maintenance
	const clear = () => {
		set("taxi", {});
	};

	return [datasets, updateDatasets, clear];
};
