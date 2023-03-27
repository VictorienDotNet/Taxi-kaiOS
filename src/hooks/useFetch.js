import { useState, useEffect } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    window
      .fetch(url)
      .then((res) => res.json())
      .then(
        (request) => {
          setIsLoading(false);
          setData(request);
        },
        (error) => {
          setIsLoading(false);
          setHasError(true);
          setErrorMessage(error);
        }
      );
  }, []);

  return { data, isLoading, hasError, errorMessage };
};
