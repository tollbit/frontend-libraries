import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MagicSearch from "../components/MagicSearch";
import { fetcher } from "../utils/index";

jest.mock("../utils/index");
const mockedUtils = jest.mocked(fetcher);

const mockMessages = [
  { role: "user", content: "Message 1" },
  { role: "assistant", content: "Response 1" },
  { role: "user", content: "Message 2" },
  { role: "assistant", content: "Response 2" },
];
const mockArticles = { 0: [], 2: [] };
const mockPrompts: any = [];
const mockConfiguration = { classes: {}, copy: {} };

beforeEach(() => {
  mockedUtils.mockImplementation(
    (path: string, key: string, body: object): Promise<Response> => {
      if (path.includes("/content/v1/search/questions")) {
        // @ts-ignore
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPrompts),
        });
      }
      if (path.includes("/content/v1/search/articles")) {
        // @ts-ignore
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockArticles),
        });
      }
      if (path.includes("/content/v1/search/summary")) {
        // @ts-ignore
        return Promise.resolve({
          ok: true,
          body: {
            getReader: () => ({
              read: () =>
                Promise.resolve({
                  done: true,
                  value: new TextEncoder().encode("Summary response"),
                }),
            }),
          },
        });
      }
      // @ts-ignore
      return Promise.resolve({ ok: false });
    },
  );
});

const magicSearchRenderer = (props = {}) =>
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
    magicSearchRenderer();
    const magicSearchElement = screen.getByText(
      "I can help you find what you're looking for",
    );
    expect(magicSearchElement).toBeInTheDocument();
  });
  test("renders MagicSearch component", () => {
    magicSearchRenderer();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  test("fetches prompts on mount", async () => {
    magicSearchRenderer();
    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledWith(
        expect.stringContaining("/content/v1/search/questions"),
      );
    });
  });

  test("fetches articles on mount", async () => {
    magicSearchRenderer();
    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledWith(
        expect.stringContaining("/content/v1/search/articles"),
      );
    });
  });

  test("fetches summary on mount", async () => {
    magicSearchRenderer();
    await waitFor(() => {
      expect(fetcher).toHaveBeenCalledWith(
        expect.stringContaining("/content/v1/search/summary"),
      );
    });
  });

  test("disables forward button when at the last page", async () => {
    magicSearchRenderer({
      messages: mockMessages,
      articles: mockArticles,
      prompts: mockPrompts,
    });

    // Initially, the forward button should be enabled
    const forwardButton = screen.getByRole("button", { name: /forward/i });
    expect(forwardButton).not.toBeDisabled();

    // Click forward button to go to the next page
    fireEvent.click(forwardButton);

    // Now, the forward button should be disabled
    await waitFor(() => expect(forwardButton).toBeDisabled());
  });

  test("disables backward button when at the first page", async () => {
    magicSearchRenderer();

    // Initially, the backward button should be disabled
    const backwardButton = screen.getByRole("button", { name: /backward/i });
    expect(backwardButton).toBeDisabled();

    // Click forward button to go to the next page
    const forwardButton = screen.getByRole("button", { name: /forward/i });
    fireEvent.click(forwardButton);

    // Now, the backward button should be enabled
    await waitFor(() => expect(backwardButton).not.toBeDisabled());
  });

  test("renders Home component on the first page", async () => {
    magicSearchRenderer();

    // Home component should be visible on the first page
    expect(
      screen.getByText(/I can help you find what you're looking for/i),
    ).toBeInTheDocument();
  });

  test("renders Results component based on page number", async () => {
    magicSearchRenderer();

    // Initially, the first Results component should be visible
    expect(screen.getByText(/Response 1/i)).toBeInTheDocument();

    // Click forward button to go to the next page
    const forwardButton = screen.getByRole("button", { name: /forward/i });
    fireEvent.click(forwardButton);

    // Now, the second Results component should be visible
    await waitFor(() =>
      expect(screen.getByText(/Response 2/i)).toBeInTheDocument(),
    );
  });

  test("submitSearch function adds a new message", async () => {
    magicSearchRenderer();

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "New search term" } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/New search term/i)).toBeInTheDocument();
    });
  });
});
