import React from "react";
import { render, screen } from "@testing-library/react";
import MagicSearch from "../components/MagicSearch";

const magicSearchRenderer = (props: any) =>
  render(
    <MagicSearch
      direction="left"
      publicKey="publicKey"
      configuration={{ classes: {}, copy: {} }}
      {...props}
    />,
  );

describe("MagicSearch", () => {
  it("renders the MagicSearch component", () => {
    magicSearchRenderer({});
    const magicSearchElement = screen.getByText(
      "I can help you find what you're looking for",
    );
    expect(magicSearchElement).toBeInTheDocument();
  });
});
