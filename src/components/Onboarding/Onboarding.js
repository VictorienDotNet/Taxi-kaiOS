import React, { useState } from "react";
import css from "./Onboarding.module.scss";
import { getCurrentPosition } from "../../services/getCurrentPosition";
import { openSettings } from "../../services/openSettings";
import { useNavigation } from "../../hooks/useNewNavigation";

export function Onboarding(props) {
	const [current, next] = useState("Initial");
	const { children, update } = props;

	/* ARROW NAVIGATION */
	// Will be used to store the index of the selected result
	const [nav, setNavigation] = useNavigation(0);

	/**
	 * STATE MANAGEMENT
	 * We have four states : Initial, Loading, Denied and Error
	 */

	if (current === "Retrieving") {
		getCurrentPosition(
			(position) => {
				update({
					coords: [position.coords.latitude, position.coords.longitude]
				});
				next("Success");
			},
			() => next("Denied"),
			() => next("Error")
		);
	}

	const GoToMap = () => {
		console.log("We are going to Map view.");
		update({ target: "Map" });
	};

	const GoToResults = () => {
		console.log("We are going to Results view.");
		update({ target: "Results" });
	};

	switch (current) {
		case "Initial":
			return (
				<Wrapper>
					<p>Welcome! Where do you want to find taxis?</p>
					<button onClick={() => next("Retrieving")}>Near Me</button>
					<button onClick={GoToMap}>Choose On Map</button>
				</Wrapper>
			);
		case "Retrieving":
			return (
				<Wrapper>
					<p>We are retrieving location…</p>
					<button disabled>Near Me</button>
					<button disabled>Choose On Map</button>
				</Wrapper>
			);
		case "Success":
			setTimeout(() => {
				GoToResults();
			}, 1000);
			return (
				<Wrapper>
					<p>We found you.</p>
				</Wrapper>
			);
		case "Denied":
			return (
				<Wrapper>
					<p>
						You denied the geolocation permission. If you want share your
						location, grant access through the settings.
					</p>
					<button onClick={openSettings}>Settings</button>
					<button onClick={GoToMap}>Choose On Map</button>
				</Wrapper>
			);
		default:
			return (
				<Wrapper>
					<p>We didn't success to retrieve your location.</p>
					<button onClick={GoToMap}>Choose On Map</button>
				</Wrapper>
			);
	}
}

const Wrapper = ({ children, props }) => {
	return <div className={css.onboarding}>{children}</div>;
};
