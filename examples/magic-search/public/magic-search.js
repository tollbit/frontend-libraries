const SEARCH_INPUT = "searchInput";
const ARTICLES = "articles";
const PAST_MESSAGES = "pastMessages";
const SHOW_MAGIC_SEARCH = "showMagicSearch";
const LOADING = "loading";
const PROMPTS = "prompts";
const MAGIC_SEARCH_ID = "magic-search";
const ARTICLES_ID = "magic-search-articles";
const PROMPTS_ID = "magic-search-prompts";
const CHAT_ID = "magic-search-chat";
const HEADER_ID = "magic-search-header";
const SEARCH_INPUT_ID = "magic-search-input";
const CHAT_INPUT_ID = "magic-search-chat-input";
const SEARCH_TITLE_ID = "magic-search-results-title";
const SUGGESTIONS_TITLE_ID = "magic-search-suggestions-title";
const CLOSE_BUTTON_ID = "magic-search-close";
const BOT_ROLE = "assistant";
const USER_ROLE = "user";

function MagicSearch({ publicKey, id, direction = "left" }) {
  const searchBar = document.getElementById(id);
  if (!searchBar) {
    console.error("Magic Search: Element with id " + id + " not found");
    return;
  }

  const state = new Proxy(
    {
      [PAST_MESSAGES]: [],
      [ARTICLES]: [],
      [SEARCH_INPUT]: "",
      [LOADING]: false,
      [SHOW_MAGIC_SEARCH]: false,
      [PROMPTS]: [],
    },
    {
      set: async function (obj, prop, value) {
        obj[prop] = value;
        if (prop === ARTICLES) {
          renderArticles(state[ARTICLES], state[SEARCH_INPUT]);
          return true;
        }
        if (prop === PROMPTS) {
          renderPrompts(value, (message) => {
            state[PAST_MESSAGES] = [
              ...state[PAST_MESSAGES],
              { role: USER_ROLE, content: message },
            ];
          });
          return true;
        }
        if (prop === LOADING) {
          // renderLoading();
          return true;
        }
        if (prop === SEARCH_INPUT) {
          state[PAST_MESSAGES] = [
            ...state[PAST_MESSAGES],
            { role: USER_ROLE, content: value },
          ];
          // Fetch articles from the server
          const articles = await (
            await fetcher("/content/v1/search/articles", publicKey, {
              query: value,
            })
          ).json();
          // If we have a successful query for articles, set those into state and switch loading to false
          if (articles?.length && articles[0]?.results?.length) {
            state[ARTICLES] = articles[0].results;
            state[LOADING] = false;
          }
          return true;
        }
        if (prop === SHOW_MAGIC_SEARCH) {
          if (value) {
            showMagicSearch();
          } else {
            hideMagicSearch();
          }
          // Check if we've already queried for prompts or not
          if (!state[PROMPTS].length) {
            // Query for prompts if we havent already
            const prompts = await (
              await fetcher("/content/v1/search/questions", publicKey, {
                content: document.getElementsByTagName("body")[0]?.innerText,
              })
            ).json();
            state[PROMPTS] = prompts;
          }
          return true;
        }
        if (prop === PAST_MESSAGES) {
          renderChat(
            state[PAST_MESSAGES],
            state[ARTICLES],
            // Sets bot chat responses into state, because this only sets bot responses, this should make sure we don't infinitely recurse
            (message) => {
              state[PAST_MESSAGES] = [
                ...state[PAST_MESSAGES],
                {
                  role: BOT_ROLE,
                  content: message,
                },
              ];
            },
            publicKey,
          );
          return true;
        }
      },
    },
  );

  const sendUserMessage = (message) => {
    state[PAST_MESSAGES] = [
      ...state[PAST_MESSAGES],
      {
        role: USER_ROLE,
        content: message,
      },
    ];
  };

  const setIsDrawerOpen = (isDrawerOpen) => {
    state[SHOW_MAGIC_SEARCH] = isDrawerOpen;
  };

  const executeSearch = (search) => (state[SEARCH_INPUT] = search);

  // Instantiate the HTML for magic search
  window.addEventListener("DOMContentLoaded", async () => {
    instantiateMagicSearch(
      sendUserMessage,
      setIsDrawerOpen,
      executeSearch,
      direction,
    );
  });

  // Listen for keydown events, if the user hits enter while the search bar is focused, submit the search
  document.addEventListener("keydown", async function (event) {
    if (searchBar === document.activeElement) {
      if (event.key === "Enter") {
        state[SEARCH_INPUT] = searchBar.value;
        state[LOADING] = true;
      }
    }
  });

  // Configure search bar click listener
  searchBar.addEventListener("click", () => {
    state[SHOW_MAGIC_SEARCH] = !state[SHOW_MAGIC_SEARCH];
  });
}

function instantiateMagicSearch(
  sendUserMessage,
  setIsDrawerOpen,
  executeSearch,
  direction,
) {
  const main = document.getElementsByTagName("main")[0];
  main.insertAdjacentHTML(
    "afterend",
    `<div id="${MAGIC_SEARCH_ID}" class="${MAGIC_SEARCH_ID} ${direction === "left" ? `${MAGIC_SEARCH_ID}-left` : `${MAGIC_SEARCH_ID}-right`}">
      <div class="magic-search-content">
        <div id="${HEADER_ID}" class="${HEADER_ID}">
          <button id="${CLOSE_BUTTON_ID}" class="${CLOSE_BUTTON_ID} ${direction === "left" ? `${CLOSE_BUTTON_ID}-left` : `${CLOSE_BUTTON_ID}-right`}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        <div class="magic-search-input-container">
          <input id="${SEARCH_INPUT_ID}" class="${SEARCH_INPUT_ID}" placeholder="Search"/>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#343434" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <div id="${ARTICLES_ID}" class="${ARTICLES_ID}"></div>
        <div id="${PROMPTS_ID}" class="${PROMPTS_ID}"></div>
        <div id="${CHAT_ID}" class="${CHAT_ID}">
          <div class="magic-search-chat-input-container">
            <input id="${CHAT_INPUT_ID}" class="${CHAT_INPUT_ID}" placeholder="Ask something"/>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#343434" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
          </div>
        </div>
      </div>
      <div class="magic-search-tab ${direction === "left" ? "magic-search-tab-left" : "magic-search-tab-right"}"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div>
    </div>`,
  );
  // Instantiate chat and search listener
  const chatInput = document.getElementById(CHAT_INPUT_ID);
  const searchInput = document.getElementById(SEARCH_INPUT_ID);
  document.addEventListener("keydown", async function (event) {
    if (chatInput === document.activeElement) {
      if (event.key === "Enter") {
        sendUserMessage(chatInput.value);
        chatInput.value = "";
      }
    }
    if (searchInput === document.activeElement) {
      if (event.key === "Enter") {
        executeSearch(searchInput.value);
        searchInput.value = "";
      }
    }
  });
  // Instantiate close button listener
  const closeButton = document.getElementById(CLOSE_BUTTON_ID);
  closeButton.addEventListener("click", () => setIsDrawerOpen(false));
  // Instantiate tab listener
  const tab = document.getElementsByClassName("magic-search-tab")[0];
  tab.addEventListener("click", () => {
    // Focus the user into the search bar and open the drawer
    searchInput.focus();
    setIsDrawerOpen(true);
  });
}

async function renderChat(pastMessages, articles, appendBotMessage, publicKey) {
  // If the most recent message was from a bot, don't re-render, we already streamed the respons
  if (
    pastMessages.length &&
    pastMessages[pastMessages.length - 1].role === BOT_ROLE
  ) {
    return;
  }
  const chatContainer = document.getElementById(CHAT_ID);
  // Insert the latest message from the user
  chatContainer.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="magic-search-user-message">
    ${pastMessages[pastMessages.length - 1].content}
    </div>
    `,
  );
  const response = await fetcher("/content/v1/search/summary", publicKey, {
    articles,
    pastMessages,
    maxOutputTokens: 100,
  });
  // Insert the empty node for the streamed bot message
  chatContainer.insertAdjacentHTML(
    "afterbegin",
    `<div class="magic-search-bot-message"></div`,
  );
  // Find the most recently added bot message
  const chatNodes = chatContainer.getElementsByClassName(
    "magic-search-bot-message",
  );
  const chatNode = chatNodes[chatNodes.length - 1];
  // Declare a separate variable to save the stream as a string
  let chatString = "";
  for await (const chunk of response.body) {
    // Do something with each "chunk"
    const chunkString = new TextDecoder().decode(chunk);
    chatNode.append(chunkString);
    chatString = chatString + chunkString;
  }
  appendBotMessage(chatString);
}

function renderArticles(articles, searchInput) {
  const magicSearchArticles = document.getElementById(ARTICLES_ID);
  const magicSearchHeader = document.getElementById(HEADER_ID);
  insertOnce(
    SEARCH_TITLE_ID,
    magicSearchHeader,
    `
    <div class="magic-search-results-title-container">
      <div class="magic-search-subtitle">Showing Results for</div>
      <h3 id="${SEARCH_TITLE_ID}" class="${SEARCH_TITLE_ID} magic-search-title">${searchInput}</h3>
    </div>  
    `,
    "afterbegin",
  );
  magicSearchArticles.innerHTML = "";
  articles.forEach((article) => {
    // @TODO We dont have domains showing in the articles anymore but maybe we'll want that back
    // const urlObj = new URL(article.url);
    // const domain = urlObj.hostname;
    // Convert the article date to how long ago it was published
    const publishedDate = new Date(article.publishedDate);
    const dateNow = new Date();
    const timeDifference = dateNow - publishedDate;

    const millisecondsInHour = 1000 * 60 * 60;
    const millisecondsInDay = millisecondsInHour * 24;
    const millisecondsInWeek = millisecondsInDay * 7;
    const millisecondsInMonth = millisecondsInDay * 30;
    const millisecondsInYear = millisecondsInDay * 365;

    let timeSincePublished;
    if (timeDifference < millisecondsInHour) {
      timeSincePublished = "less than an hour ago";
    } else if (timeDifference < millisecondsInDay) {
      const hours = Math.floor(timeDifference / millisecondsInHour);
      timeSincePublished = `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (timeDifference < millisecondsInWeek) {
      const days = Math.floor(timeDifference / millisecondsInDay);
      timeSincePublished = `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (timeDifference < millisecondsInMonth) {
      const weeks = Math.floor(timeDifference / millisecondsInWeek);
      timeSincePublished = `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else if (timeDifference < millisecondsInYear) {
      const months = Math.floor(timeDifference / millisecondsInMonth);
      timeSincePublished = `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(timeDifference / millisecondsInYear);
      timeSincePublished = `${years} year${years > 1 ? "s" : ""} ago`;
    }
    magicSearchArticles.insertAdjacentHTML(
      "afterbegin",
      `
        <a class="magic-search-article" href="${article.url}">
          <h4 class="magic-search-article-title">${article.title}</h4>

          <p class="magic-search-article-author">${timeSincePublished} - By ${article.author || "Unknown Author"}</p>
        </a>
      `,
    );
  });
}

function renderPrompts(prompts, sendMessage) {
  const magicSearchPrompts = document.getElementById(PROMPTS_ID);
  insertOnce(
    SUGGESTIONS_TITLE_ID,
    magicSearchPrompts,
    `<h3 id="${SUGGESTIONS_TITLE_ID}" class="${SUGGESTIONS_TITLE_ID} magic-search-title">Suggestions</h3>`,
    "beforebegin",
  );
  magicSearchPrompts.innerHTML = "";
  prompts.forEach((prompt) => {
    magicSearchPrompts.insertAdjacentHTML(
      "afterbegin",
      `
        <button class="prompt">
          ${prompt.question}
        </buton>
      `,
    );
  });

  const promptNodes = document.getElementsByClassName("prompt");
  for (let i = 0; i < promptNodes.length; i++) {
    promptNodes[i].addEventListener("click", (e) => {
      sendMessage(e.target.innerText);
    });
  }
}

function renderLoading() {
  document
    .getElementById(ARTICLES_ID)
    .insertAdjacentHTML("beforebegin", `<span class="loader"></span>`);
}

function showMagicSearch() {
  document.getElementById(MAGIC_SEARCH_ID).style.transform = "translateX(0%)";
  document.getElementsByTagName("main")[0].style.marginLeft = "320px";
}

function hideMagicSearch() {
  document.getElementById(MAGIC_SEARCH_ID).style.transform = "translateX(-98%)";
  document.getElementsByTagName("main")[0].style.marginLeft = "0";
}

const fetcher = async (path, key, body) =>
  fetch(`http://localhost:8000${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      TollbitPublicKey: key,
    },
    body: JSON.stringify(body),
  });

// Helper function to insert an element into the DOM if it doesn't already exist
const insertOnce = (id, parent, html, position) => {
  const element = document.getElementById(id);
  if (element) {
    return;
  }
  parent.insertAdjacentHTML(position, html);
};
