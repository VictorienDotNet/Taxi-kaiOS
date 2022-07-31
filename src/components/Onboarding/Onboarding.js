import React, { useState } from "react";
import css from "./Onboarding.module.scss";
import { getCurrentPosition, normalizeCoords, openSettings } from "../../tools";
import { useNavigation } from "../../hooks";
import { Earth } from "./Earth";

export function Onboarding(props) {
	const [current, next] = useState("Choose Location");
	const { update } = props;

	/* ARROW NAVIGATION */
	// Will be used to store the index of the selected result
	useNavigation();

	/**
	 * STATE MANAGEMENT
	 * We have four states : Initial, Loading, Denied and Error
	 */

	if (current === "Waiting Location") {
		getCurrentPosition(
			(position) => {
				update({
					coords: normalizeCoords(position.coords, "GPS"),
					status: "Located",
					ranks: null,
					index: 0
				});
				next("Got Location");
			},
			() => next("Handle Denied Location"),
			() => next("Handle Location Error")
		);
	}

	const GoToMap = () => {
		update({ target: "Map", status: "Choose On Map" });
	};

	const GoToResults = () => {
		update({ target: "Results" });
	};

	switch (current) {
		case "Learn Basic":
			return (
				<Wrapper>
					<p>Find easily taxi stand around.</p>
					<button onClick={() => next("Choose Location")}>Continue</button>
				</Wrapper>
			);
		case "Choose Location":
			return (
				<Wrapper>
					<p>Where do you want to find taxis?</p>
					<button onClick={() => next("Waiting Location")}>Near Me</button>
					<button onClick={GoToMap}>Choose On Map</button>
				</Wrapper>
			);
		case "Waiting Location":
			return (
				<Wrapper>
					<p>Searching the stars for your location…</p>
					<button disabled>Near Me</button>
					<button disabled>Choose On Map</button>
				</Wrapper>
			);
		case "Got Location":
			setTimeout(() => {
				GoToResults();
			}, 1000);
			return (
				<Wrapper>
					<p>We found you.</p>
					<button disabled>Near Me</button>
					<button disabled>Choose On Map</button>
				</Wrapper>
			);
		case "Handle Denied Location":
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
	return (
		<div className={css.onboarding}>
			<Earth />
			{children}
		</div>
	);
};
