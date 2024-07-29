// import react and component from react library
import React, { Component } from "react";

// import react-dom to render the Link component
import { Link } from "react-router-dom";

// define Dictionary component as a class component
class Dictionary extends Component {
  // constructor to initialise state and bind methods
  constructor(props) {
    super(props);
    // initialise component state variables
    this.state = {
      // store user input for the word to define
      word: "",
      // store the word from the API response
      apiWord: "",
      // store error object if API request fails
      error: null,
      // indicate if data from API is loaded
      isLoaded: true,
      // store definitions fetched from dictionary API
      definitions: [],
      // store syllables fetched from dictionary API
      syllables: "",
      // store pronunciation fetched from dictionary API
      pronunciation: "",
      // store audio URL fetched from dictionary API
      audioUrl: "",
    };

    // bind methods to the current component instance
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // function to handle changes in the input field
  handleChange(event) {
    // update component's state with current value typed into input field
    this.setState({ word: event.target.value });
  }

  // function to handle form submission for word lookup
  handleSubmit(event) {
    // prevent default form submission behaviour
    event.preventDefault();

    // initiate data fetching based on the current state word
    this.fetchData(this.state.word);

    // move the search box to the top
    document.querySelector(".search-box").classList.add("top");
  }

  // function to fetch data from dictionary and thesaurus APIs
  fetchData(word) {
    // reset state before fetching data
    this.setState({ isLoaded: false, error: null });

    // fetch API keys from environment variables (.env file)
    const apiKeyDictionary = import.meta.env
      .VITE_MERRIAM_WEBSTER_API_KEY_DICTIONARY;
    const apiKeyThesaurus = import.meta.env
      .VITE_MERRIAM_WEBSTER_API_KEY_THESAURUS;

    // construct API URL for dictionary
    const apiUrlDictionary = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKeyDictionary}`;
    // construct API URL for thesaurus
    const apiUrlThesaurus = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${apiKeyThesaurus}`;

    // fetch data from both APIs concurrently (parallel fetch requests)
    Promise.all([fetch(apiUrlDictionary), fetch(apiUrlThesaurus)])

      // handle results from both APIs after fetching JSON data
      .then(([resDict, resThes]) =>
        // convert HTTP response objects to JSON format for further processing
        Promise.all([resDict.json(), resThes.json()])
      )

      // process dictionary results
      .then(([dictResults, thesResults]) => {
        // array to store processed dictionary definitions
        const definitions = this.processDictionaryResults(
          dictResults,
          thesResults
        );

        // update component state with fetched data
        this.setState({
          /** extract data from the first dictionary result using optional chaining;
           * default to an empty string if unavailable */

          // extract word without identifier suffix (e.g. ":1") from API response
          apiWord: dictResults[0]?.meta?.id?.split(":")[0] ?? "",
          definitions,
          // extract syllables
          syllables: dictResults[0]?.hwi?.hw ?? "",
          // extract pronunciation
          pronunciation: dictResults[0]?.hwi?.prs?.[0]?.mw ?? "",
          // extract audio URL
          audioUrl: dictResults[0]?.hwi?.prs?.[0]?.sound?.audio
            ? // audio reference URL : https://media.merriam-webster.com/audio/prons/[language_code]/[country_code]/[format]/[subdirectory]/[base filename].[format]
              `https://media.merriam-webster.com/audio/prons/en/us/wav/${dictResults[0].hwi.prs[0].sound.audio[0]}/${dictResults[0].hwi.prs[0].sound.audio}.wav`
            : "",
          // trigger a re-render of the component with the new data
          isLoaded: true,
        });

        // check if no definitions are found in the dictionary results
        if (!dictResults[0] || !dictResults[0].shortdef) {
          // handle error by throwing an exception to be caught for state reset
          throw new Error("Definition cannot be found");
        }
      })
      .catch((error) => {
        // handle errors during API fetch
        this.setState({
          error,
          // reset state variables to their initial values
          definitions: [],
          syllables: "",
          pronunciation: "",
          audioUrl: "",
          // trigger a re-render of the component
          isLoaded: true,
        });
      });
  }

  // function to process dictionary results
  processDictionaryResults(dictResults, thesResults) {
    // prepare an empty array to store processed dictionary definitions
    const definitions = [];

    // check if dictResults is an array and has items
    if (Array.isArray(dictResults) && dictResults.length > 0) {
      // iterate through each result in dictResults
      dictResults.forEach((result) => {
        // check if result has short definitions
        if (result.shortdef) {
          // push processed data into definitions array
          definitions.push({
            // unique identifier from meta data
            id: result.meta?.id ?? "",
            // part of speech
            partOfSpeech: result.fl ?? "",
            // short definitions
            shortdef: result.shortdef ?? [],
            // extract and store examples
            examples: this.extractExamples(result),
            // initialise synonyms array
            synonyms: [],
            // initialise antonyms array
            antonyms: [],
          });
        }
      });
    }

    // check if thesaurus results exist and are valid
    if (Array.isArray(thesResults) && thesResults.length > 0) {
      // iterate through results
      thesResults.forEach((thesResult) => {
        // search through the dictionary definitions
        const matchingDefinition = definitions.find(
          /**  find the dictionary definition corresponding to the current thesaurus result
           * if meta data (id) exists in thesaurus API */
          (def) => def.id === thesResult.meta?.id
        );

        // if dictionary definition has a corresponding thesaurus result
        if (matchingDefinition) {
          // assign synonyms and antonyms from thesaurus to corresponding dictionary definition
          matchingDefinition.synonyms = thesResult.meta.syns.flat();
          matchingDefinition.antonyms = thesResult.meta.ants.flat();
        }
      });
    }

    // array storing processed dictionary definitions
    return definitions;
  }

  // function to extract example usage(s) from dictionary API response
  extractExamples(result) {
    // initialise empty array to store example usages
    let examples = [];
    // destructure word from component state
    const { word } = this.state;

    // check if result has 'def' property, 'def' has an item and item has 'sseq' property
    if (result.def && result.def[0] && result.def[0].sseq) {
      // iterate through each 'sense' in the first item of 'sseq'
      result.def[0].sseq.forEach((sense) => {
        // iterate through each 'item' in 'sense'
        sense.forEach((item) => {
          // check if 'item' type is 'sense'
          if (item[0] === "sense") {
            // extract dt from item[1]
            const definitionText = item[1].dt;

            // check if 'definitionText' is an array
            if (definitionText && Array.isArray(definitionText)) {
              // iterate through each dt item in array
              definitionText.forEach((dtItem) => {
                // check if 'dtItem' type is 'vis' and 'dtItem[1]' is an array
                if (dtItem[0] === "vis" && Array.isArray(dtItem[1])) {
                  // iterate through each example item in array
                  dtItem[1].forEach((exampleItem) => {
                    // check if 'exampleItem' has 't' property
                    if (exampleItem.t) {
                      // remove placeholders and formatting markers - content within curly braces
                      let exampleText = exampleItem.t.replace(/{[^}]*}/g, "");
                      // case-insensitive match of standalone word with optional suffixes
                      const wordRegex = new RegExp(`\\b(${word}\\w*)\\b`, "gi");
                      // italicise occurrences of word looked up in example usages
                      exampleText = exampleText.replaceAll(
                        wordRegex,
                        "<i>$1</i>"
                      );
                      // add formatted example to array that stores example usages
                      examples.push(exampleText);
                    }
                  });
                }
              });
            }
          }
        });
      });
    }

    // return array of formatted example usages
    return examples;
  }

  // function to pause background audio on pronunciation start and resume on pronunciation end
  componentDidUpdate(prevProps, prevState) {
    if (prevState.audioUrl !== this.state.audioUrl && this.state.audioUrl) {
      // get audio elements by id
      const backgroundAudio = document.getElementById("background-audio");
      const pronunciationAudio = document.getElementById("pronunciation-audio");

      if (backgroundAudio && pronunciationAudio) {
        // pause background audio when pronunciation audio starts
        pronunciationAudio.onplay = () => {
          backgroundAudio.pause();
        };

        // resume background audio when pronunciation audio ends
        pronunciationAudio.onended = () => {
          backgroundAudio.play();
        };
      }
    }
  }

  // render the Dictionary component
  render() {
    // destructure state variables for easier access
    const {
      word,
      apiWord,
      error,
      isLoaded,
      definitions,
      syllables,
      pronunciation,
      audioUrl,
    } = this.state;

    // render JSX content based on state
    return (
      // render the main dictionary application container
      <div className="dictionary-app">
        <header className="search-box">
          {/* render the main heading of the application */}
          <h1>Grammer Police HQ</h1>
          {/* form for user input to search for a word */}
          <form onSubmit={this.handleSubmit} id="define_word_form">
            {/* input field to enter the word */}
            <input
              type="text"
              id="word_inputted"
              value={word}
              onChange={this.handleChange}
              placeholder="Enter a word"
            />
            {/* button to submit the form */}
            <button type="submit">Search</button>
          </form>
        </header>
        {/* display fetched data when loaded */}
        {isLoaded && definitions.length > 0 && (
          <div>
            {/* main block for displaying word details */}
            <div className="block main">
              {/* display the word fetched from the API */}
              <p className="define-word">{apiWord}</p>

              {/* display audio, pronunciation and syllables if available */}
              {audioUrl && pronunciation && syllables && (
                <div className="block word-details">
                  <audio controls id="pronunciation-audio">
                    {/* provide the audio source URL */}
                    <source src={audioUrl} type="audio/wav" />
                    {/* notify user if audio element is not supported */}
                    Your browser does not support the audio element.
                  </audio>
                  {/* format written pronunciation and rhythm of word searched for */}
                  <p>
                    {pronunciation} • {syllables}
                  </p>
                </div>
              )}
            </div>

            {/* display results fetched from APIs */}
            <div className="block results">
              <h2>Results</h2>
              {/* map through each definition and display */}
              {definitions.map((def, index) => (
                <div key={index} className="block definition">
                  {/* display part of speech */}
                  <h3>{def.partOfSpeech}</h3>
                  <hr />
                  <ul>
                    {/* map through each short definition */}
                    {def.shortdef.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>

                  {/* display example usage if available */}
                  {def.examples.length > 0 && (
                    <div>
                      <h4>Example Usage</h4>
                      <ul>
                        {/* map through each example and render as HTML */}
                        {def.examples.map((example, i) => (
                          <li
                            key={i}
                            // inject HTML directly into the component
                            dangerouslySetInnerHTML={{ __html: example }}
                          />
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* display synonyms if available */}
                  {def.synonyms.length > 0 && (
                    <div className="block synonyms">
                      <h4>Synonym(s)</h4>
                      <p className="lexical">{def.synonyms.join(", ")}</p>
                    </div>
                  )}

                  {/* display antonyms if available */}
                  {def.antonyms.length > 0 && (
                    <div className="block antonyms">
                      <h4>Antonym(s)</h4>
                      <p className="lexical">{def.antonyms.join(", ")}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <footer>
              {/* link to APIs used */}
              <h6 style={{ textAlign: "center" }}>
                APIs by{" "}
                <Link to="https://dictionaryapi.com/products/index">
                  Merriam-Webster
                </Link>{" "}
                are used to fetch the word data.
              </h6>
            </footer>
          </div>
        )}
        {/* display loading message while fetching data */}
        {!isLoaded && <div>Loading...</div>}
        {/* display error message if an error occurs */}
        {error && (
          <div className="error">
            {/* check if error message is definition not found */}
            {error.message === "Definition cannot be found"
              ? // notify user of appropriate error
                "Definition cannot be found."
              : `Error: ${error.message}`}
          </div>
        )}
      </div>
    );
  }
}

// export Dictionary component as default
export default Dictionary;
