import React from "react";
import css from "./Button.module.scss";

export function Button(props) {
	const { children, disabled, onClick } = props;

	return (
		<button className={css.main} disabled={disabled} onClick={onClick}>
			{children}
		</button>
	);
}
