import React from "react";
import css from "./Card.module.css";
import { getDistance } from "../../services/geometry.js";

export const Card = ({ content, position, index, visibility }) => {
	return (
		<div className={css.Card} style={{ display: visibility ? false : "none" }}>
			{typeof content === "string" ? (
				<Text status={content} />
			) : (
				<Item content={content} position={position} index={index} />
			)}
		</div>
	);
};

const Text = ({ status }) => {
	switch (status) {
		//Retry
		case "Init":
			return <p>Requesting your position…</p>;
		case "Located":
			return <p>Searching available options around…</p>;
		case "NotLocated":
			return (
				<p>To find you on the map, we need permission to use your location.</p>
			);
		case "NoResult":
			return <p>Unfortunately, we found any options around.</p>;
		case "Error":
			return <p>Internet is off. Check your connection and retry.</p>;
		default:
			return <p>Looks like there was a problem. Restart the app.</p>;
	}
};

const Item = ({ content, position, index }) => {
	var dots = content.map((e, i) => {
		return (
			<div
				key={i}
				nav-index={i}
				nav-selectable="true"
				nav-selected={i === index ? "true" : "false"}
			/>
		);
	});

	return (
		<div>
			<div className={css.pagging}>{dots}</div>
			<span className={css.subheader}>
				{getDistance(
					position[1],
					position[0],
					content[index].lng,
					content[index].lat
				)}
			</span>
			<h2>{content[index].name}</h2>
			<p>{content[index].vicinity}</p>
		</div>
	);
};
