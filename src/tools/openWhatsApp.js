export const openWhatsApp = () => {
	if (typeof MozActivity === "function") {
		const phoneNumber = "+33767805435";
		const urlEncodedMessage = "SentFromKaios";
		// eslint-disable-next-line
		let activity = new MozActivity({
			name: "whatsapp_open",
			data: {
				type: "url",
				url: `https://wa.me/${phoneNumber}?text=${urlEncodedMessage}`
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
