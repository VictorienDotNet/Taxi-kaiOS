import React from "react";
import { useEffect } from "react";
import { Map, Marker, Card, Item, Softkey, AdsButton } from "../../components";
//import { useFetch } from "usehooks-ts";
import { useFetch } from "../../hooks";
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
  let [result] = useFetch(
    `https://${endpoint}/?version=${version}&lat=${lat}&lng=${lng}`
  );

  //Thirdly, we update the app once we get the result
  useEffect(() => {
    //TODO: Add Error state
    //TODO: Update server
    if (result && result.length > 0) {
      routeTo({
        currentView: "View Results",
        ranks: result,
      });
    } else if (result && result.length === 0) {
      routeTo({
        currentView: "View Any Result",
      });
    }
  }, [result]);
  /**/

  /* DEFINE THE KEYBOARDS EVENT */
  //We define below the back navigation and the navigation bewteen stands

  useEffect(() => {
    const onKeyDown = (evt) => {
      if (evt.key === "Backspace") {
        //If the user press return, ze will be back to the Onboarding
        routeTo("Choose Location");
      } else if (evt.key === "ArrowLeft") {
        //If the user press the Left Arrow, we display the previous item
        let i = index - 1 < 0 ? 0 : index - 1;
        routeTo({ index: i });
      } else if (evt.key === "ArrowRight") {
        //If the user press the Left Arrow, we display the next item
        let max = ranks.length - 1;
        let i = index + 1 > max ? max : index + 1;
        routeTo({ index: i });
      }

      //We prevent default action to happen
      if (["ArrowLeft", "ArrowRight", "Backspace"].includes(evt.key))
        evt.preventDefault();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [routeTo]);
  /**/

  /* DISPLAY AND DEFINE VARIANTS */
  //Based on the CurrentView selected, we display different variants. Each variants use different content for the card and different actions for the softkeys

  //First, we define boolean value to switch on-off components and content
  const item = ranks && ranks[index];
  const isPhone = item && item.type === "phone";
  const hasPhone = (item && item.phone) || false;

  //Secondly, we define the JSX
  return (
    <div className={css.container}>
      <AdsButton />
      <Map>
        {coords && (
          <Marker name="my-position" position={coords} boundable={true} />
        )}
        {item && !isPhone && (
          <Marker name="rank" position={[item.lat, item.lng]} boundable />
        )}
      </Map>

      {
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
              ranks.map((e, i) => <Item key={i} item={e} coords={coords} />)
            ) : //
            null
          }
        </Card>
      }

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
            currentView === "View Results" && item
            ? [
                hasPhone && {
                  fct: () => routeTo("Call Taxi Service"),
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
