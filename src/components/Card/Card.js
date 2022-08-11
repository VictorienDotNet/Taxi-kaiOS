import React from "react";
import css from "./Card.module.css";
import { getDistance } from "../../tools/geometry.js";

export const Card = ({ data }) => {
	const { action, ranks, index, coords } = data;
	/*
	var dots =
		ranks &&
		index &&
		ranks.map((e, i) => {
			return (
				<div
					key={i}
					nav-index={i}
					nav-selectable="true"
					nav-selected={i === index ? "true" : "false"}
				/>
			);
		});
		*/

	switch (action) {
		case "Waiting Results":
			return (
				<Wrapper>
					<p>Searching available options around…</p>
				</Wrapper>
			);
		case "View Any Result":
			return (
				<Wrapper>
					<p>We didn't find any taxi rank around.</p>
				</Wrapper>
			);
		case "View Results":
			let item = ranks[index];

			if (item.type === "phone") {
				return (
					<Wrapper>
						<Dots current={index} max={ranks.length} />
						<Phone>
							<span className={css.subheader}>{item.vicinity}</span>
							<h2>{item.name}</h2>
						</Phone>
					</Wrapper>
				);
			} else {
				let dist = getDistance(coords[1], coords[0], item.lng, item.lat);

				return (
					<Wrapper>
						<Dots current={index} max={ranks.length} />
						<Rank>
							<span className={css.subheader}>{dist}</span>
							<h2>{item.name}</h2>
						</Rank>
					</Wrapper>
				);
			}

		default:
			return (
				<Wrapper>
					<p>Looks like there was a problem. Restart the app.</p>
				</Wrapper>
			);
	}
};

const Dots = ({ current, max }) => {
	let dots = [];
	for (var i = 0; i < max; i++) {
		dots.push(
			<div
				key={i}
				nav-index={i}
				nav-selectable="true"
				nav-selected={i === current ? "true" : "false"}
			/>
		);
	}

	return <div className={css.pagging}>{dots}</div>;
};

const Rank = ({ children }) => {
	return <div className={css.rank}>{children}</div>;
};

const Phone = ({ children }) => {
	return <div className={css.service}>{children}</div>;
};

const Wrapper = ({ children }) => {
	return <div className={css.Card}>{children}</div>;
};
