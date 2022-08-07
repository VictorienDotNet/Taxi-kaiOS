import React from "react";
import css from "./Card.module.css";
import { getDistance } from "../../tools/geometry.js";

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
		case "Choose On Map":
			return <p>Searching available options around…</p>;
		case "NotLocated":
			return (
				<p>
					<i>Taxis</i> needs your geolocation permission to find you on the map.
					Please grant access.
				</p>
			);
		case "NoResult":
			return <p>We didn't find any taxi rank around.</p>;
		case "Error":
			return <p>Internet seems to be off. Check your connection and retry.</p>;
		default:
			return <p>Looks like there was a problem. Restart the app.</p>;
	}
};

const Item = ({ content, position, index = 0 }) => {
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

	if (content[index].type === "phone") {
		return (
			<div>
				<div className={css.pagging}>{dots}</div>
				<div className={css.service}>
					<span className={css.subheader}>{content[index].vicinity}</span>
					<h2>{content[index].name}</h2>
					<p>{/*(content[index].vicinity*/}</p>
				</div>
			</div>
		);
	} else {
		return (
			<div>
				<div className={css.pagging}>{dots}</div>
				<div className={css.rank}>
					<span className={css.subheader}>
						{getDistance(
							position[1],
							position[0],
							content[index].lng,
							content[index].lat
						)}
					</span>
					<h2>{content[index].name}</h2>
					<p>{/*(content[index].vicinity*/}</p>
				</div>
			</div>
		);
	}
};
