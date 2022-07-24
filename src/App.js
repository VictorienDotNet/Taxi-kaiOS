import React from "react";
import { Onboarding, Map, Results } from "./components";
import { useEffect } from "react";
import { useStorage } from "./hooks";

export default function App() {
	let [data, update, clear] = useStorage();

	useEffect(() => {
		window.clear = () => {
			clear();
			document.location.reload();
		};
	}, [clear]);

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
