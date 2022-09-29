import React, { useEffect } from "react";
import css from "./Call.module.scss";
import { Button } from "../../components";
import { useNavigation } from "../../hooks";
import { Graphic } from "./icon-calling.js";
import { ReactComponent as IconPositiveAnswer } from "./icon-review-positive-answer.svg";
import { ReactComponent as IconNegativeAnswer } from "./icon-review-negative-answer.svg";
import { ReactComponent as IconQuestion } from "./icon-review-question.svg";
import { Softkey } from "../../components";

export function Call(props) {
	let { data, to } = props;
	let { action, ranks, index } = data;
	let phone = data.ranks[data.index].phone;

	useNavigation();

	const onKeyDown = (evt) => {
		if (evt.key === "Backspace") {
			to("View Results");
			evt.preventDefault();
		}
	};

	const close = () => {
		to("View Results");
	};

	const satisfy = () => {
		to("Satisfy With Taxi Service");
	};

	const unsatisfy = () => {
		to("Unsatisfy With Taxi Service");
	};

	/* LISTENER FOR KEY EVENT */
	useEffect(() => {
		document.addEventListener("keydown", onKeyDown);

		return () => document.removeEventListener("keydown", onKeyDown);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	useEffect(() => {}, []);

	switch (action) {
		case "Call Taxi Service":
			//Display Call Prompt
			setTimeout(() => {
				window.location = "tel:" + phone;
			}, 500);
			//Go to the Feedback Prompt
			setTimeout(() => {
				to("Review Taxi Service");
			}, 1650);
			return (
				<div className={css.main}>
					<div>
						<Graphic />
						<p>Preparing Call…</p>
					</div>
				</div>
			);
		case "Review Taxi Service":
			return (
				<div className={css.main}>
					<div>
						<IconQuestion />
						<p>
							Are you satisfy with your call with <b>{ranks[index].name}</b>?
						</p>
					</div>
					<Softkey>
						{[
							{ name: "Yes", fct: satisfy },
							{ name: "Skip", fct: close },
							{ name: "No", fct: unsatisfy }
						]}
					</Softkey>
				</div>
			);
		case "Satisfy With Taxi Service":
			return (
				<div className={css.main}>
					<div>
						<IconPositiveAnswer />
						<h1>Thanks for your feedback</h1>
						<p>It will help us to improve our application</p>
					</div>
					<Softkey>{[{ name: "Close", fct: close }]}</Softkey>
				</div>
			);

		case "Unsatisfy With Taxi Service":
			return (
				<div className={css.main}>
					<div>
						<IconNegativeAnswer />
						<h1>Sorry to hear that</h1>
						<p>Your feedback will help us to improve that</p>
					</div>
					<Softkey>{[{ name: "Close", fct: close }]}</Softkey>
				</div>
			);
		default:
			return false;
	}
}
