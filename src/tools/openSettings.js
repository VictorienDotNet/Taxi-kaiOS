export const openSettings = () => {
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
