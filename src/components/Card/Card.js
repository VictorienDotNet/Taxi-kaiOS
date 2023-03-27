import React from "react";
import css from "./Card.module.scss";
import { getDistance } from "../../tools/geometry.js";
import { Icon } from "../";

export const Card = (props) => {
  const { action, ranks, index, coords } = props.data;
  const { className, children } = props;
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

  return <Wrapper className={className}>{children}</Wrapper>;
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
  return (
    <div className={css.rank}>
      <Icon name="rank" />
      {children}
    </div>
  );
};

const Phone = ({ children }) => {
  return (
    <div className={css.phone}>
      <Icon name="phone" />
      {children}
    </div>
  );
};

const Wrapper = ({ children, className }) => {
  return <div className={`${css.Card} ${className}`}>{children}</div>;
};
