import React, { useEffect } from "react";
import css from "./Softkey.module.css";

export const Softkey = ({ children }) => {
  /* DEFINE THE KEYDOWN EVENT */
  //UseEffect is use to define the keydown event depending on children
  useEffect(() => {
    const handleKeyDown = (evt) => {
      /* BLOCK USELESS KEYDOWN */
      if (
        evt.key !== "Enter" &&
        evt.key !== "SoftRight" &&
        evt.key !== "SoftLeft"
      )
        return;

      if (!children) return;

      /* GET ACTION INDEX */
      //Define the left, center and right action depending on the number of children
      let max = children.length;
      let center = max === 1 ? "0" : max === 3 ? 1 : false;
      let left = max === 2 || max === 3 ? "0" : false;
      let right = max === 2 || max === 3 ? max - 1 : false;

      /* TRIGGER ACTION */
      // Depending on the key we trigger the action

      if (evt.key === "SoftLeft" && left) {
        //Softleft is triggered
        typeof children[left].fct === "function" && children[left].fct();
      } else if (evt.key === "Enter" && center) {
        //Enter is triggered
        typeof children[center].fct === "function" && children[center].fct();
      } else if (evt.key === "SoftRight" && right) {
        //Softright is triggered
        typeof children[right].fct === "function" && children[right].fct();
      }
    };

    /* SETUP THE EVENT LISTERNER */
    //Mount the event
    document.addEventListener("keydown", handleKeyDown);
    //Unmount the event
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [children]);

  console.log(children);
  return (
    <div className={css.softkey}>
      {children &&
        children.map((child, i) => {
          let onClick = () => typeof child.fct === "function" && child.fct();
          return (
            <span key={i} onClick={onClick}>
              {child.name}
            </span>
          );
        })}
    </div>
  );
};
