import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Softkey,
  Map,
  MyPosition,
  Rank,
  AdsButton,
  Card
} from "../../components";
import { useNavigation } from "../../hooks";

/* DEFINE APP VERSION */
// The import doesn't work with the build
//import { version } from "/package.json";
//We are force to define manualy for now

export function Results({ data, update }) {
  /* DATA TREE AND APP STATUS */
  // datasets will be used to store the data requested and downloaded
  const [datasets, setData] = useState(data);

  /* ARROW NAVIGATION */
  // Will be used to store the index of the selected result
  const [current, setNavigation] = useNavigation(0);

  /* LISTENER FOR KEY EVENT */
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasets]);

  const onKeyDown = (evt) => {
    if (evt.key === "ArrowLeft" || evt.key === "ArrowRight") {
      if (datasets.status !== "Map") {
        setNavigation(evt.key);
      }
    } else if (evt.key === "Backspace" && datasets.status === "Map") {
      setData((prev) => ({
        ...prev,
        status: "Success"
      }));
      evt.preventDefault();
    } else if (evt.key === "Backspace" && datasets.status !== "Map") {
      update({ target: "Onboarding", coords: null });
    } else {
      return;
    }
  };

  /* BEHAVIOUR REGARDING THE APP STATUS */

  // After we get the user's localisation,
  // we request taxi rank on his position.
  const getData = (coords) => {
    fetch(process.env.REACT_APP_API + "?lat=" + coords[0] + "&lng=" + coords[1])
      .then((res) => res.json())
      .then(
        (request) => {
          //Then, if we got results…
          if (request.results != null) {
            //We update the view
            setData((prev) => ({
              ...prev,
              status: "Success",
              ranks: request.results
            }));

            //if we didn't got result…
          } else {
            setData((prev) => ({
              ...prev,
              status: "NoResult"
            }));
          }
        },
        // if we cath any error…
        (error) => {
          setData((prev) => ({
            ...prev,
            status: "Error",
            error: error
          }));
        }
      );
  };

  /* DEFINE SOFKEYS EVENT */
  // We define actions depending on app stat
  // !!To Improve: We use a switch, but so case are similar. Usinf IFs should be more efficent

  const softactions = () => {
    let phone = datasets.ranks && datasets.ranks[current.index].phone;
    switch (datasets.status) {
      case "Success":
        return [
          {
            name: phone ? "Call" : "",
            fct: phone
              ? () => {
                  window.location = "tel:" + phone;
                  setData((prev) => ({
                    ...prev,
                    status: "Call"
                  }));
                }
              : false
          },
          {
            name: "Map",
            fct: () => {
              setData((prev) => ({
                ...prev,
                status: "Map"
              }));
            }
          }
        ];
      case "Call":
        return [
          {
            name: phone ? "Call" : "",
            fct: phone
              ? (phone) => {
                  window.location = "tel:" + phone;
                  setData((prev) => ({
                    ...prev,
                    status: "Call"
                  }));
                }
              : false
          },
          {
            name: "Map",
            fct: () => {
              setData((prev) => ({
                ...prev,
                status: "Map"
              }));
            }
          }
        ];

      case "NoResult":
        return [
          {
            name: "Change Position",
            fct: () => update({ target: "Onboarding", coords: null })
          }
        ];
      default:
        break;
    }
  };

  /* INITIALISATION */
  // We are requestings the user position.
  useEffect(() => {
    if (datasets.coords) {
      getData(datasets.coords);
    } else if (!datasets.status) {
      update({ target: "Onbaording" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <AdsButton />
      <Map center={datasets.coords} fullscreen={datasets.status === "Map"}>
        {datasets.coords && <MyPosition position={datasets.coords} />}
        {datasets.ranks && (
          <Rank
            position={[
              datasets.ranks[current.index].lat,
              datasets.ranks[current.index].lng
            ]}
          />
        )}
      </Map>
      <Card
        position={datasets.coords}
        content={datasets.ranks || datasets.status || "Init"}
        index={current.index}
        visibility={datasets.status !== "Map"}
      ></Card>

      {datasets.status === "Map" || <Softkey>{softactions()}</Softkey>}
    </>
  );
}

// Datasets used acrross the app
// =============================
//
// The _status_ Could be:
// Init: Requesting your location…
// Located: Searching taxi around…
// NotLocated: You didn't accept to share your location
// Error: Looks like there was a problem. Restart the app
// NoResult: We didn't find nearby taxi ranks.
// Successfull:

// Once we update `page`, we update also the Action's name and event, the textual description and the marker on map.

// Softkey: !datasets.sets.ranks[n].phone && "Disabled"
// Softkey: datasets.sets.ranks[n].phone ? "Call" : "No phone"
// Softkey: datasets.sets.ranks[n].phone && ()=>{}
// Card: datasets.sets.ranks || datasets.status
// Map: coords && <MaPosition />
// Map: datasets.data.ranks && <Rank />
