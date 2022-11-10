import React, { useEffect, useState } from "react";
import { openWhatsApp } from "../../tools";
import css from "./Feedback.module.css";

export const Feedback = () => {
	const [state, setState] = useState("ready");

	//Setup the keyboard event
	function handleKeyDown(evt) {
		if (evt.key === "2") {
			if (typeof openWhatsApp === "function") {
				setState("loading");
				openWhatsApp();
			} else {
				setState("error");
			}
		}
	}

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={css.button}>
			{state === "loading" ? (
				<>Loading…</>
			) : (
				<>
					<span>2</span> Contact us
				</>
			)}
		</div>
	);
};
