import React, { useEffect } from "react";
import css from "./Call.module.scss";
import { useNavigation } from "../../hooks";
import { Softkey, Icon } from "../../components";

export function Call(props) {
  let { data, routeTo } = props;
  let { action, ranks, index } = data;
  let phone = data.ranks[data.index].phone;

  useNavigation();

  const onKeyDown = (evt) => {
    if (evt.key === "Backspace") {
      routeTo("View Results");
      evt.preventDefault();
    }
  };

  const close = () => {
    routeTo("View Results");
  };

  const satisfy = () => {
    routeTo("Satisfy With Taxi Service");
  };

  const unsatisfy = () => {
    routeTo("Unsatisfy With Taxi Service");
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
        routeTo("Review Taxi Service");
      }, 1650);
      return (
        <div className={css.main}>
          <div>
            <Icon name="calling" />
            <p>Preparing Call…</p>
          </div>
        </div>
      );
    case "Review Taxi Service":
      return (
        <div className={css.main}>
          <div>
            <Icon name="review" />
            <p>
              Are you satisfy with your call with <b>{ranks[index].name}</b>?
            </p>
          </div>
          <Softkey>
            {[
              { name: "Yes", fct: satisfy },
              { name: "Skip", fct: close },
              { name: "No", fct: unsatisfy },
            ]}
          </Softkey>
        </div>
      );
    case "Satisfy With Taxi Service":
      return (
        <div className={css.main}>
          <div>
            <Icon name="review-positive" />
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
            <Icon name="review-negative" />
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
