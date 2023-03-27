import React from "react";
import { useEffect } from "react";
import { Map, Marker, Card, Item, Softkey } from "../../components";
import { useFetch } from "usehooks-ts";
import css from "./Results.module.scss";

export function Results({ routeTo, data }) {
  let { coords, currentView, ranks, index } = data;

  /* FETCH RESULTS FROM THE API */
  //We use `useFetch.ts` hook to get data from a specific endpoint

  //First, we define the URL paramertes
  const endpoint = process.env.REACT_APP_API_ENDPOINT;
  const version = process.env.REACT_APP_V;
  const lat = coords[0];
  const lng = coords[1];

  //Secondly, we feetch the data from API
  let res = useFetch(
    `https://${endpoint}/?version=${version}&lat=${lat}&lng=${lng}`
  );

  //Thirdly, we update the app once we get on the result
  useEffect(() => {
    if (!res.data) return;

    if (res.data.results)
      routeTo({
        currentView: "View Results",
        ranks: res.data.results,
      });
    else if (!res.data.results)
      routeTo({
        currentView: "View Any Result",
      });
  }, [res]);
  /**/

  /* DEFINE THE BACK EVENT */
  //If the user press return, ze will be back to the Onboarding

  useEffect(() => {
    const onKeyDown = (evt) => {
      if (evt.key === "Backspace") {
        routeTo("Choose Location");
        evt.preventDefault();
      } else if (evt.key === "ArrowLeft") {
        let i = index - 1 < 0 ? 0 : index - 1;
        routeTo({ index: i });
      } else if (evt.key === "ArrowRight") {
        let max = ranks.length - 1;
        let i = index + 1 > max ? max : index + 1;
        routeTo({ index: i });
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [routeTo]);
  /**/

  /* DISPLAY AND DEFINE VARIANTS */
  //Based on the CurrentView selected, we display different variants. Each variants use different content for the card and different actions for the softkeys

  const item = ranks && ranks[index];
  const isPhone = item && item.type === "phone";

  return (
    <div className={css.container}>
      <Map>
        {coords && (
          <Marker name="my-position" position={coords} boundable={true} />
        )}
        {item && !isPhone && (
          <Marker name="rank" position={[item.lat, item.lng]} boundable />
        )}
      </Map>

      <Card className={css.card} data={data} routeTo={routeTo}>
        {
          // We display content based on the currentView
          currentView === "Waiting Results" ? (
            "Searching available options around…"
          ) : //
          currentView === "View Any Result" ? (
            <p>We didn't find any taxi rank around.</p>
          ) : //
          currentView === "View Results" && ranks ? (
            <Item item={ranks[index]} coords={coords} />
          ) : //
          null
        }
      </Card>

      <Softkey>
        {
          // We display content based on the currentView
          currentView === "View Any Result"
            ? [
                {
                  fct: () => routeTo("Choose Location"),
                  name: "Change Location",
                },
              ]
            : //
            currentView === "View Results" && ranks
            ? [
                isPhone && {
                  fct: () => routeTo("Call Taxi Services"),
                  name: "Call",
                },
                { fct: () => routeTo("Display On Map"), name: "Map" },
              ]
            : //
              null
        }
      </Softkey>
    </div>
  );
}
