export const getCurrentPosition = (success, denied, error) => {
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
			maximumAge: 7 * 24 * 60 * 60 * 1000 // 7 days in millisecond
		}
	);
	// Will Stop the Watch once the job is done
	const stop = () => {
		navigator.geolocation.clearWatch(IDWatch);
	};
};
