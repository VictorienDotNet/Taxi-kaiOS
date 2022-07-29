import React from "react";
import css from "./Onboarding.module.scss";
import { ReactComponent as Disabled } from "./LocationDisabled.svg";

/* MARKERS */

/* We use a set of compoments to setup specificities for our two markers: Our Current Position and the Taxi ranks */

// MyPosition: Display a blue dot on the user's position.
export function GetPositionButton(props) {
	return (
		<div className={css.GetPositionButton}>
			<Disabled />
		</div>
	);
} /**/
