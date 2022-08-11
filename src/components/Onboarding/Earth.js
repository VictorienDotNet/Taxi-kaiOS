import React, { useEffect, useState } from "react";
import css from "./Onboarding.module.scss";
import { GetPositionButton } from "./GetPositionButton";

/* MARKERS */

/* We use a set of compoments to setup specificities for our two markers: Our Current Position and the Taxi ranks */

// MyPosition: Display a blue dot on the user's position.
export function Earth(props) {
	return (
		<div className={css.SolarSystem}>
			<div data-flag="flag"></div>
			<GetPositionButton />
		</div>
	);
} /**/
