import React, { useEffect, useState } from "react";
import css from "./Onboarding.module.scss";
import { GetPositionButton } from "./GetPositionButton";

/* MARKERS */

/* We use a set of compoments to setup specificities for our two markers: Our Current Position and the Taxi ranks */

// MyPosition: Display a blue dot on the user's position.
export function Earth(props) {
	let [x, setX] = useState(0);

	/*
	useEffect(() => {
		setInterval(() => {
			setX((prev) => {
				return prev - 1;
			});
		}, 40);
	}, []);
	

	useEffect(() => {
		const timer = setTimeout(() => {
			setX(x - 1);
		}, 40);
		return () => clearTimeout(timer);
	}, [x]);
	*/

	return (
		<div className={css.SolarSystem}>
			<div data-flag="flag" style={{ backgroundPositionX: x }}></div>
			<GetPositionButton />
		</div>
	);
} /**/
