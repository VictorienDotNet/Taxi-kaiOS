const version = process.env.REACT_APP_V;

export function fetch(src, onCompleted, onError) {
  if (!src) return false;

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
