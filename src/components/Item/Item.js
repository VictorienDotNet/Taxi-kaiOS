import React from "react";
import css from "./Item.module.scss";
import { Icon } from "../";
import { getDistance } from "../../tools";

export const Item = ({ coords, item }) => {
  const { name, type, vicinity, phone, lat, lng } = item;

  const variants = {
    phone: {
      style: false,
      subheader: true,
    },
    rank: {
      style: false,
      subheader: true,
    },
  };

  let style, icon, subheader;

  if (type === "phone") {
    subheader = vicinity;
    style = css.phone;
    icon = "phone";
  } else if (type === "stand") {
    subheader = getDistance(coords[1], coords[0], lng, lat);
    style = css.rank;
    icon = "rank";
  }

  return (
    <div className={`${css.main} ${style}`}>
      <Icon name={icon} />
      <span>{subheader}</span>
      <h2>{name}</h2>
    </div>
  );
};
