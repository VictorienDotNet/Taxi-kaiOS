import React from "react";
import { useEffect } from "react";
import { Softkey, Map, MyPosition, Rank, Card } from "../../components";

import { fetch } from "../../tools";

export function Results({ data, to }) {
  let { coords, action, ranks, index } = data;

  /* LISTENER FOR KEY EVENT */
  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const onKeyDown = (evt) => {
    if (evt.key === "ArrowLeft" && action !== "Display Map") {
      let i = index - 1 < 0 ? 0 : index - 1;
      to({ index: i });
    } else if (evt.key === "ArrowRight" && action !== "Display Map") {
      let max = ranks.length - 1;
      let i = index + 1 > max ? max : index + 1;
      to({ index: i });
    } else if (evt.key === "Backspace" && action === "Display Map") {
      to("View Results");
    } else if (evt.key === "Backspace" && action !== "Display Map") {
      to("Choose Location");
    } else {
      return;
    }
    evt.preventDefault();
  };
  /**/

  //Feetch Data if the coords change
  useEffect(() => {
    //Stop the update in case that we have already offline datas.

    if (action === "Waiting Results") {
      fetch(
        coords,
        function (result) {
          to({ ranks: result });
        },
        function (error) {
          //How to Handle error?
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  /* DEFINE SOFKEYS EVENT */
  // We define actions depending on app stat
  // !!To Improve: We use a switch, but so case are similar. Usinf IFs should be more efficent

  const softactions = () => {
    if (action === "View Results" || action === "Call Taxi Service") {
      let phone = ranks && (index || index === 0) && ranks[index].phone;
      return [
        {
          name: phone ? "Call" : "",
          fct: phone
            ? () => {
                to("Call Taxi Service");
              }
            : false,
        },
        {
          name: "Map",
          fct: () => {
            to("Display Map");
          },
        },
      ];
    } else if (action === "View Any Result") {
      return [
        {
          name: "Change Position",
          fct: () => to("Choose Location"),
        },
      ];
    }
  };
  /**/

  //Will desactivate card when the map will show up
  let isMap = action === "Display Map" ? true : false;
  let isRanks = ranks && ranks.length > 0 ? true : false;

  return (
    <>
      <Map center={coords} keyboard={isMap}>
        {coords && <MyPosition position={coords} boundable />}
        {isRanks && ranks[index].type !== "phone" && (
          <Rank
            position={[ranks[index].lat, ranks[index].lng]}
            boundable
            zoomable
          />
        )}
      </Map>
      {!isMap && (
        <>
          <Card data={data}></Card>
          <Softkey>{softactions()}</Softkey>
        </>
      )}
    </>
  );
}
