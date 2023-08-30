import React from "react";
import css from "./Card.module.scss";

export const Card = (props) => {
  const { currentView, ranks, index, coords } = props.data;
  const { className, children } = props;

  let selectedChildren;
  if (typeof children === "string") {
    selectedChildren = <p>{children}</p>;
  } else if (Array.isArray(children)) {
    selectedChildren = children[index];
  } else {
    selectedChildren = children;
  }

  /* DISPLAY AND DEFINE VARIANTS */
  //Based on the childrne, we display the dots

  //First, we define boolean value to switch on-off components and content
  const hasChildrens = Array.isArray(children);

  //Secondly, we define the JSX
  return (
    <div className={`${css.Card} ${className}`}>
      {hasChildrens && <Dots current={index} max={children.length}></Dots>}
      {selectedChildren}
    </div>
  );
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
