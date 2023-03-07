import React from "react";
import css from "./Onboarding.module.scss";
import { getCurrentPosition, normalizeCoords, openSettings } from "../../tools";
import { useNavigation } from "../../hooks";
import { Earth } from "./Earth";
import { ReactComponent as Sign } from "./sign.svg";

export function Onboarding(props) {
	const { data, to } = props;

	/* ARROW NAVIGATION */
	// Will be used to store the index of the selected result
	useNavigation();

	/**
	 * STATE MANAGEMENT
	 * We have four states : Initial, Loading, Denied and Error
	 */

	switch (data.action) {
		case "Learn Basics":
			return (
				<div className={css.onboarding}>
					<div className={css.SolarSystem}>
						<Sign />
					</div>
					<p>Find easily taxi stand around.</p>
					<button onClick={() => to("Choose Location")}>Continue</button>
				</div>
			);
		case "Choose Location":
			return (
				<Wrapper>
					<p>Where do you want to find taxis?</p>
					<button onClick={() => to("Waiting Location")}>Near Me</button>
					<button onClick={() => to("Choose On Map")}>Choose On Map</button>
				</Wrapper>
			);
		case "Waiting Location":
			getCurrentPosition(
				(res) => {
					to({
						action: "Got Location",
						coords: normalizeCoords(res.coords, "GPS")
					});
				},
				() => to("Handle Denied Location"),
				() => to("Handle Location Error")
			);

			return (
				<Wrapper>
					<p>We're searching for your position…</p>
					<button disabled>Near Me</button>
					<button disabled>Choose On Map</button>
				</Wrapper>
			);
		case "Got Location":
			setTimeout(() => {
				to("Waiting Results");
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
					<button onClick={() => to("Choose On Map")}>Choose On Map</button>
				</Wrapper>
			);
		case "Handle Location Error":
			return (
				<Wrapper>
					<p>We didn't success to retrieve your location.</p>
					<button onClick={() => to("Choose On Map")}>Choose On Map</button>
				</Wrapper>
			);
		default:
			break;
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
