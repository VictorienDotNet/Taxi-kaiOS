import React from "react";
import ReactDOM from "react-dom";

import { Onboarding, Map, Results, Call } from "./views";
import { useEffect } from "react";
import { useStorage, usePrevious } from "./hooks";
import { hit } from "./tools";

import "./styles/index.css";

export default function App() {
  /*** Use Storage is an offline database ***/
  // Once we trigger it, the function will fecth the data available on the device. During the process, the function will figure out if it's an app openning, an update or installation
  let [data, update] = useStorage();
  let previousData = usePrevious(data);

  /*** Analytics ***/
  //All analytics is trigger from here except for openning, installation and update which is trigger in the useStorage hook.
  //We look into the previous state of data to not track twice an event and avoid back navigation tracking
  useEffect(() => {
    let { currentView, ranks, index, coords } = data;
    let a = currentView;
    let b = previousData && previousData.currentView;
    let properties = {};

    //avoid double event and back navigation tracking
    if (a === b) return false;
    if (a === "View Results") {
      if (
        b === "Display Map" ||
        b === "Review Taxi Service" ||
        b === "Satisfy With Taxi Service" ||
        b === "Unsatisfy With Taxi Service"
      )
        return false;
    }

    //configure properties based on the event
    if (
      a === "Call Taxi Service" ||
      a === "Satisfy With Taxi Service" ||
      a === "Unsatisfy With Taxi Service"
    )
      properties = {
        phone: ranks[index].phone,
        name: ranks[index].name,
      };

    if (a === "View Results" || a === "View Any Results")
      properties = {
        quantity: ranks ? ranks.length : 0,
        latitude: coords.lat,
        longitude: coords.lng,
      };

    hit(a, properties);
  }, [data, previousData]);

  /*** State Manager ***/
  // The "to" function handle the states management. Triggered by the compomeents, "to" apply the correct data (e.g. : reseting coords) and redirect to the corresponding view according to the action.

  const routeTo = (input) => {
    let output;
    let { coords, ranks, currentView } = input;

    //Most of the time, the input it's just a string with the state where to go. However, sometime we receive an object to push into the datatsets
    if (typeof input === "string") {
      //We have only a string, it's an currentView (state)
      output = { currentView: input };
    } else {
      //It's object, we push the input into the datasets. However, somes rules apply to avoid bugs and crashs.

      //If we reset the coord or the ranks. We reset the index too. Otherwise, it could target a childrien which doesn't exist.
      if (ranks || coords) {
        input.index = 0;
        //If we have only coords, we reset the ranks which was associated to the previous coords.
        input.ranks = ranks ? ranks : null;
      }

      //If we don't have "currentView", we guess it according to the input
      if (!currentView && coords) {
        //New coords, we need to wait for the results again.
        input.currentView = "Waiting Results";
      } else if (!currentView && ranks) {
        //New results, we need to display it
        input.currentView =
          ranks.length === 0 ? "View Any Result" : "View Results";
      }

      //Once we applied the rules, the ouput is ready.
      output = input;
    }

    //We update the datasets
    update({ ...data, ...output });
  };

  /*** Render ***/
  //What view to render is written in the offline datasets as target. We apply strickly the rules here

  //A path to display Results when we have "Call Taxi Service" stored as currentView
  /*
	if (data.currentView === "Call Taxi Service") {
		data.currentView = data.ranks.length === 0 ? "View Any Result" : "View Results";
		hit("Call Taxi Service", {
			phone: data.ranks[data.index].phone,
			name: data.ranks[data.index].name
		});
	}/**/

  if (!data) {
    return <div></div>;
  } else if (
    data.currentView === "Learn Basics" ||
    data.currentView === "Choose Location" ||
    data.currentView === "Waiting Location" ||
    data.currentView === "Got Location" ||
    data.currentView === "Handle Denied Location" ||
    data.currentView === "Handle Location Error"
  ) {
    return <Onboarding data={data} routeTo={routeTo} />;
  } else if (
    data.currentView === "Choose On Map" ||
    data.currentView === "Display Map"
  ) {
    return <Map data={data} routeTo={routeTo} />;
  } else if (
    data.currentView === "Waiting Results" ||
    data.currentView === "View Results" ||
    data.currentView === "View Any Result" ||
    data.currentView === "Display Map"
  ) {
    return <Results data={data} routeTo={routeTo} />;
  } else if (
    data.currentView === "Call Taxi Service" ||
    data.currentView === "Review Taxi Service" ||
    data.currentView === "Unsatisfy With Taxi Service" ||
    data.currentView === "Satisfy With Taxi Service"
  ) {
    return <Call data={data} routeTo={routeTo} hit={hit} />;
  } else {
    return <div>There is an error.</div>;
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
