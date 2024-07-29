// import react from react library to use JSX syntax and components
import React from "react";

// import function to render components in tests
import { render } from "@testing-library/react";

// import from react-router-dom for routing components
import { Link, MemoryRouter } from "react-router-dom";

// define a test case for the Link component
test("Link renders correctly.", () => {
  // tree variable created when the component being testing is rendered
  const tree = render(
    // simulate routing context in memory
    <MemoryRouter>
      {/* create Link component */}
      <Link to="https://dictionaryapi.com/products/index">
        APIs by Merriam-Webster
      </Link>
    </MemoryRouter>
  );

  /** Jest's snapshot testing: capture the rendered output and verify
   * that it matches the stored snapshot */
  expect(tree).toMatchSnapshot();
});
