import React from "react";
import { useEffect } from "react";
import {
	Softkey,
	Map,
	MyPosition,
	Rank,
	AdsButton,
	Card
} from "../../components";

import { fetch } from "../../tools";

export function Results({ data, update }) {
	let { coords, status, ranks, index } = data;

	/* LISTENER FOR KEY EVENT */
	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);

		return () => document.removeEventListener("keydown", onKeyDown);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	const onKeyDown = (evt) => {
		if (evt.key === "ArrowLeft" && status !== "Map") {
			let i = index - 1 < 0 ? 0 : index - 1;
			update({ index: i });
		} else if (evt.key === "ArrowRight" && status !== "Map") {
			let max = ranks.length - 1;
			let i = index + 1 > max ? max : index + 1;
			update({ index: i });
		} else if (evt.key === "Backspace" && status === "Map") {
			update({ status: "Success" });
		} else if (evt.key === "Backspace" && status !== "Map") {
			update({ target: "Onboarding", status: null });
		} else {
			return;
		}
		evt.preventDefault();
	};
	/**/

	//Feetch Data if the coords change
	useEffect(() => {
		if (ranks && ranks.length !== 0) return false;

		fetch(
			coords,
			function (result) {
				update({ ranks: result, status: result ? "Success" : "NoResult" });
			},
			function (error) {
				update({ status: "Error" });
			}
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* DEFINE SOFKEYS EVENT */
	// We define actions depending on app stat
	// !!To Improve: We use a switch, but so case are similar. Usinf IFs should be more efficent

	const softactions = () => {
		let phone = ranks && ranks[index].phone;

		if (status === "Success" || status === "Call") {
			return [
				{
					name: phone ? "Call" : "",
					fct: phone
						? () => {
								window.location = "tel:" + phone;
								update({ status: "Call" });
						  }
						: false
				},
				{
					name: "Map",
					fct: () => {
						update({ status: "Map" });
					}
				}
			];
		} else if (status === "NoResult") {
			return [
				{
					name: "Change Position",
					fct: () => update({ target: "Onboarding", coords: null })
				}
			];
		}
	};
	/**/

	return (
		<>
			{status !== "Map" && <AdsButton />}
			<Map center={coords} keyboard={status === "Map"}>
				{coords && <MyPosition position={coords} />}
				{ranks && <Rank position={[ranks[index].lat, ranks[index].lng]} />}
			</Map>
			<Card
				position={coords}
				content={ranks || status || "Located"}
				index={index}
				visibility={status !== "Map"}
			></Card>

			{status !== "Map" && <Softkey>{softactions()}</Softkey>}
		</>
	);
}
