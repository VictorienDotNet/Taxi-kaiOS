import React from "react";
import { useEffect } from "react";
import { Map, Marker, Card } from "../../components";
import { useNavigation } from "../../hooks";

import css from "./Results.module.scss";

export function Results({ data, routeTo }) {
  let { coords, currentView } = data;

  useNavigation();

  /* LISTENER FOR KEY EVENT */

  useEffect(() => {
    const onKeyDown = (evt) => {
      if (evt.key === "Backspace") {
        routeTo("Choose Location");

        evt.preventDefault();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [data, routeTo]);
  /**/

  /* DEFINE SOFKEYS EVENT */
  // We define actions depending on the currentView
  const onSoftKeyCenter = () => {
    routeTo("Choose Location");
  };
  /**/

  /* FETCH THE RESULT FROM TRANSIT API */
  //To fake the navigation, I use a timeout which setup the result
  useEffect(() => {
    //feetch hooks here
  }, [coords, routeTo]);

  return (
    <div className={css.container}>
      <Map>
        <Marker name="my-position" position={coords} boundable />
      </Map>

      <Card className={css.card} data={data} />

      {/* Below the bloc for loading state */}
      {currentView === "Waiting Results" && <></>}
    </div>
  );
}
