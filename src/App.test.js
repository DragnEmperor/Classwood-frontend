import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import App from "./App";
import store from "./store/store";

test("renders the landing page", () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(screen.getAllByRole("heading", { name: /integrated school platform/i }).length).toBeGreaterThan(0);
});
