// import from react library
import React, { useEffect, useState } from "react";

// component that fetches data and displays it
function DataFetcher() {
  // state to hold fetched data and error messages
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // effect hook to fetch data when component mounts
  useEffect(
    () => {
      // function to fetch data using Free Dictionary API (https://dictionaryapi.dev)
      const fetchData = () => {
        fetch("https://api.dictionaryapi.dev/api/v2/entries/en/grace")
          .then((response) => {
            // check if response is successful
            if (!response.ok) {
              throw new Error("Failed to fetch data");
            }
            // parse response as JSON
            return response.json();
          })
          .then((json) => {
            // update state with fetched data
            setData(json);
          })
          .catch((error) => {
            // handle errors and update error state
            setError(error.message);
          });
      };

      // call fetchData function
      fetchData();
    },
    // an empty dependency array ensures effect runs once on mount
    []
  );

  // render loading message while data is fetching
  if (!data) {
    return <div>Loading...</div>;
  }

  // render error message if fetch encountered an error
  if (error) {
    return <div>Error: {error}</div>;
  }

  // render fetched data
  return (
    <div>
      {/* trigger to verify presence of specific text from fetched data in rendered component */}
      <h1>Data Fetched Successfully</h1>
      {/* display parsed string */}
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}

// export component
export default DataFetcher;
