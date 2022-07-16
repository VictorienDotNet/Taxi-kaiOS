import React, { useState } from "react";

export function Onboarding({ children }) {
	const [current, next] = useState("Initial");
	/**
	 * STATE MANAGEMENT
	 * We have four states : Initial, Loading, Denied and Error
	 */

	if (current === "Retrieving") {
		/*
		getCurrentPosition(
			() => next("Success"),
			() => next("Denied"),
			() => next("Error")
		);
		*/
	}

	switch (current) {
		case "Initial":
			return (
				<Wrapper>
					<p>Where do you want to find taxis?</p>
					<button onClick={() => next("Retrieving")}>Near Me</button>
					<button onClick={() => {}}>Choose On Map</button>
				</Wrapper>
			);
		case "Retrieving":
			return (
				<Wrapper>
					<p>We are retrieving location…</p>
					<button disabled>Near Me</button>
					<button disabled>Choose On Map</button>
				</Wrapper>
			);
		case "Success":
			return <p>We found you.</p>;
		case "Denied":
			return (
				<Wrapper>
					<p>
						You denied the geolocation permission. If you want share your
						location, grant access through the settings.
					</p>
					<button onClick={() => {}}>Settings</button>
					<button onClick={() => {}}>Choose On Map</button>
				</Wrapper>
			);
		default:
			return (
				<Wrapper>
					<p>We didn't success to retrieve your location.</p>
					<button onClick={() => {}}>Choose On Map</button>
				</Wrapper>
			);
	}
}

const Wrapper = ({ props }) => {
	return (
		<div>
			<Onboarding {...props} />
		</div>
	);
};

/* FOR LATER 
const getToSettings = () => {
	if (typeof MozActivity === "function") {
		// eslint-disable-next-line
		let activity = new MozActivity({
			name: "configure",
			data: {
				target: "device",
				section: "appPermissions"
			}
		});
		activity.onsuccess = function () {
			//success
		};
		activity.onerror = function () {
			//error
		};
	}
};

const getCurrentPosition = (success, denied, error) => {
	//We will store the amount of fail into failcount,
	//We will use later to determinate when to give up.
	let failcount = 0;
	const IDWatch = navigator.geolocation.watchPosition(
		function (position) {
			// IF IT'S A SUCCESS
			//We callback the function related to success
			success();
			//We Stop to watch the position
			stop();
		},
		function (err) {
			// IF IT'S A FAIL
			//We don't give up after only one fail,
			//We continue until couple of fails or if the user denied
			failcount++;

			if (err.code === err.PERMISSION_DENIED) {
				stop();
				denied();
			} else if (failcount > 6) {
				stop();
				error();
			}
		},
		{
			//We setup a Timeout in case of an unfinishable retrieving
			enableHighAccuracy: true,
			timeout: 2500,
			maximumAge: 60000
		}
	);
	// Will Stop the Watch once the job is done
	const stop = () => {
		navigator.geolocation.clearWatch(IDWatch);
	};
};

/**/
