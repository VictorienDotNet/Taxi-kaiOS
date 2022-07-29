const version = process.env.REACT_APP_V;

export function fetch(coords, onCompleted, onError) {
	if (!coords) return false;
	//Let's put together all pieces of the request
	//We start with the domain name. It could the one from production or devellopements
	let src = process.env.REACT_APP_API;
	//We add the latitude and longtitude. Essential piece of the request to get the ranks nearby to these coordinates
	src += "?lat=" + coords[0];
	src += "&lng=" + coords[1];
	//We add the version in case of specific version need different data format
	src += "&version=" + version;

	window
		.fetch(src)
		.then((res) => res.json())
		.then(
			(request) => {
				if (request.results != null) {
					//If we got results, we sent back the result
					//We update the view
					if (typeof onCompleted === "function") onCompleted(request.results);
				} else {
					//if the request is a success, but we don't have a result, we sent back an empty array
					if (typeof onCompleted === "function") onCompleted(false);
				}
			},
			(error) => {
				// if the request is a fail, we sent back the error object
				if (typeof onError === "function") onError(error);
			}
		);
}
