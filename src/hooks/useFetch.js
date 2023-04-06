import { useEffect, useState } from "react";

// Hook
export function useFetch(url) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    window
      .fetch(url)
      .then((data) => data.json())
      .then(
        (request) => {
          setResult(request.results);
        },
        (error) => {
          setResult(false);
          setError(error);
        }
      );
  }, [url]);

  return [result, error];
}

/*

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

    */
