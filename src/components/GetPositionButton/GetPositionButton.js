import React from "react";
import css from "./GetPositionButton.module.scss";
import { Icon } from "../";

/* MARKERS */

/* We use a set of compoments to setup specificities for our two markers: Our Current Position and the Taxi ranks */

// MyPosition: Display a blue dot on the user's position.
export function GetPositionButton(props) {
  return (
    <div className={css.main}>
      <Icon name="location-disabled" />
    </div>
  );
} /**/
