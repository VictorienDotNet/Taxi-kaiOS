import React, { useEffect, useState } from "react";
import css from "./Button.module.css";

export const AdsButton = () => {
	const [state, setState] = useState("ready");

	//Setup the keyboard event
	function handleKeyDown(evt) {
		if (evt.key === "2") {
			if (typeof window.getKaiAd === "function") {
				setState("loading");
				window.getKaiAd({
					publisher: "36a8e3ea-afd1-4d19-8fa1-7d01fa86afa5",
					app: "Taxi",
					onerror: (err) => console.error("Custom catch:", err),
					onready: (ad) => {
						// Ad is ready to be displayed
						// calling 'display' will display the ad
						ad.call("display");
						setState(null);
					}
				});
			} else {
				setState("error");
			}
		}
	}

	useEffect(() => {
		document.addEventListener("keydown", handleKeyDown);

		setTimeout(() => {
			setState(null);
		}, 12000);

		return () => document.removeEventListener("keydown", handleKeyDown);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (!state) return false;

	return (
		<div className={css.button}>
			{state === "loading" ? (
				<>Loading…</>
			) : (
				<>
					<span>2</span> Support us
				</>
			)}
		</div>
	);
};
