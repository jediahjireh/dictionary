# Dictionary Application: Grammar Police HQ

## Table of Contents

- [What?](#what)
  - [Screenshots](#screenshots)
- [Why?](#why)
- [How?](#how)
  - [Features](#features)
- [Where?](#where)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuring Merriam-Webster API Keys](#configuring-merriam-webster-api-keys)
    - [Running the Application](#running-the-application)
  - [Deployment](#deployment)
- [Who?](#who)
  - [Credits](#credits)

## What?

**Grammar Police HQ** is a dictionary application built with React, offering comprehensive information about a word from the Merriam-Webster dictionary and thesaurus APIs. Users can look up words to see their meanings, syllables, antonyms, synonyms, pronunciations and example usages.

### Screenshots

Screenshots showcasing the application's key features::

- [Landing Page](/docs/screenshots/landing-page.png)
- [Word Search Results](/docs/screenshots/search-results.png)
- [Word Description](/docs/screenshots/word-description.png)
- [Definition Not Found](/docs/screenshots/definition-not-found.png)

## Why?

This project has been designed with readers (such as myself) in mind. As we perpetually encounter new words, knowing the correct pronunciations is as essential as knowing their spellings and understanding their meanings, in order for us to live up to our "walking dictionary" titles. If ~~your~~ you're\* a bit like me and incessantly get accused of being the "grammar police", then you'll empathise with the importance of this application in daily life. It aims to help users improve their vocabulary and understanding of the English language, as well as to clarify all confusion surrounding word pronunciation. It's particularly useful for students, writers and language fanatics who want quick access to reliable dictionary data. Undoubtedly a scrabble enthusiast's favourite bookmarked item.

## How?

The application is built using the following technologies:

- **React**: For building the user interface and managing state.
- **Merriam-Webster API**: To fetch dictionary and thesaurus data.
- **Vite**: For fast and efficient development.
- **Custom CSS**: For styling the application.

### Features

- Search for word definitions, pronunciation, syllables and synonyms.
- Displays audio pronunciation of words.
- Uses Merriam-Webster's APIs for accurate and up-to-date information.

## Where?

### Getting Started

#### Prerequisites

- Node.js and npm installed on your machine.

#### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/jediahjireh/dictionary.git
   ```

2. Navigate to the project directory:

   ```sh
   cd dictionary
   ```

3. Install the dependencies:

   ```sh
   npm install
   ```

4. Test with Jest:

   ```sh
   npm test
   ```

#### Configuring Merriam-Webster API Keys

##### 1. **Obtain API Keys**

1. **Visit the Merriam-Webster API Website**:

   - Go to [Merriam-Webster's API Products](https://dictionaryapi.com/products/index).

2. **Sign Up or Log In**:

   - Create an account or log in to your existing account.

3. **Select the API Products**:

   - Choose the Collegiate® Dictionary and Thesaurus APIs.

4. **Get Your API Keys**:
   - Follow the instructions to generate and obtain your API keys. You'll need these keys to access the APIs.

##### 2. **Configure Environment Variables**

1. **Create a `.env` File**:

   - In the root directory of your project, create a file named `.env` if it does not already exist.

2. **Add Your API Key to the `.env` File**:

   - Open the `.env` file and add the following lines, replacing `YOUR_API_KEY` with your actual API key:
     `plaintext
VITE_MERRIAM_WEBSTER_API_KEY_DICTIONARY=YOUR_API_KEY
VITE_MERRIAM_WEBSTER_API_KEY_THESAURUS=YOUR_API_KEY
`

3. **Application Code**:

   - The application uses the environment variables to access the API keys. The API keys are fetched like this (in [Dictionary.jsx](/src/Dictionary.jsx)):

     ```javascript
     // construct API URL for dictionary
     const apiUrlDictionary = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKeyDictionary}`;
     // construct API URL for thesaurus
     const apiUrlThesaurus = `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${apiKeyThesaurus}`;
     ```

#### Running the Application

1. Start the development server:
   ```sh
   npm run dev
   ```
2. Open your browser and go to the port specified to view the application. [localhost:5173](http://localhost:5173/) is currently the default port.

### Deployment

To deploy the application, you can use platforms like Vercel or Netlify. Ensure that you configure your environment variables for the Merriam-Webster API keys.

## Who?

The application was developed by [Jediah Jireh Naicker (myself)](mailto:jediahnaicker@gmail.com) as a project to enhance vocabulary and language learning tools. Contributions and feedback are welcome!

### Credits

- This application uses APIs by [Merriam-Webster](https://dictionaryapi.com/products/index) to fetch the word data, more specifically:

  - [Merriam-Webster's Collegiate® Dictionary with Audio](https://dictionaryapi.com/products/api-collegiate-dictionary) for the IDs, definitions, syllables, example usages and written and auditorial pronunciations of the words looked up.
  - [Merriam-Webster's Collegiate® Thesaurus](https://dictionaryapi.com/products/api-collegiate-thesaurus) for the synonyms and antonyms of the words looked up.

- The audio from "Sound of da Police" by KRS-One, downloaded from [Internet Archive](https://ia600902.us.archive.org/10/items/sdsasdds/KRS-One%20-%20Sound%20of%20da%20Police.mp3), has been trimmed to the first 30 seconds for use within this application. This modification is made solely for functional purposes and is in no way intended to discredit the song, its message, nor the artist's original intent.

- The background image is a "white-and-black-police-car-on-road-during-daytime" photo by [Jack Lucas Smith](https://unsplash.com/@jacklucassmith?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash) on [Unsplash](https://unsplash.com/photos/white-and-black-police-car-on-road-during-daytime-UqvSeGmFYBs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash).

Happy coding!
