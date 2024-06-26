import React, { useEffect, useMemo } from "react";
import css from "./Onboarding.module.scss";
import { getCurrentPosition, normalizeCoords, openSettings } from "../../tools";
import { useNavigation } from "../../hooks";
import { GetPositionButton, Button } from "../../components";

export function Onboarding(props) {
  const { data, routeTo } = props;

  /* ARROW NAVIGATION */
  // Will be used to store the index of the selected result
  useNavigation();

  /**
   * STATE MANAGEMENT
   * We have four states : Initial, Loading, Denied and Error
   */

  //We don't allow the app to start on an Error and Denied Location screens.
  useMemo(() => {
    if (
      data.currentView === "Handle Location Error" ||
      data.currentView === "Handle Denied Location"
    ) {
      data.currentView = "Choose Location";
    }
  }, []);

  switch (data.currentView) {
    case "Choose Location":
      return (
        <Wrapper>
          <p>Where do you want to find taxis?</p>
          <Button onClick={() => routeTo("Waiting Location")}>Near Me</Button>
          <Button onClick={() => routeTo("Choose On Map")}>
            Choose On Map
          </Button>
        </Wrapper>
      );
    case "Waiting Location":
      getCurrentPosition(
        (res) => {
          routeTo({
            currentView: "Got Location",
            coords: normalizeCoords(res.coords, "GPS"),
          });
        },
        () => routeTo("Handle Denied Location"),
        () => routeTo("Handle Location Error")
      );

      return (
        <Wrapper>
          <p>We're searching for your position…</p>
          <Button disabled>Near Me</Button>
          <Button disabled>Choose On Map</Button>
        </Wrapper>
      );
    case "Got Location":
      setTimeout(() => {
        routeTo("Waiting Results");
      }, 1000);
      return (
        <Wrapper>
          <p>We found you.</p>
          <Button disabled>Near Me</Button>
          <Button disabled>Choose On Map</Button>
        </Wrapper>
      );
    case "Handle Denied Location":
      return (
        <Wrapper>
          <p>
            You denied the geolocation permission. If you want share your
            location, grant access through the settings.
          </p>
          <Button onClick={openSettings}>Settings</Button>
          <Button onClick={() => routeTo("Choose On Map")}>
            Choose On Map
          </Button>
          <Button onClick={() => routeTo("Waiting Location")}>Retry</Button>
        </Wrapper>
      );
    case "Handle Location Error":
      return (
        <Wrapper>
          <p>We didn't success to retrieve your location.</p>
          <Button onClick={() => routeTo("Choose On Map")}>
            Choose On Map
          </Button>
          <Button onClick={() => routeTo("Waiting Location")}>Retry</Button>
        </Wrapper>
      );
    default:
      break;
  }
}

const Wrapper = ({ children, props }) => {
  return (
    <div className={css.onboarding}>
      <div className={css.SolarSystem}>
        <div data-flag="flag"></div>
        <GetPositionButton />
      </div>
      {children}
    </div>
  );
};
