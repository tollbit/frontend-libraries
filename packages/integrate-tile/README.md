# @tollbit/integrate-tile

The purpose of this library is to enable developers to integrate TollBit Tiles into their Chatbot to enable rich data backed experiences.

This documentation assumes you have already [created a TollBit developer account](), [registered your user agent for your Chatbot](), and [obtained your TollBit API Key]()

For a full integration example, check out our [Integration Recipe](#integration-recipe) section

## Tools

This library exposes the following utilities and React components to enable easy integration with various Chatbots.

### fetchTiles

This function is the entrypoint to the TollBit Tile ecosystem. When this function is called, it will return a Promise that when resolved, returns all of the Tiles that are enabled for your specific user agent. This should not need to be called on every message and should be either at page load or called and cached elsewhere.

Parameters:
| Parameter | Type | Description |
| --- | --- | --- |
| apiKey | `string` | Your TollBit API Key |
| userAgent | `string` | The user agent that corresponds to your Chatbot. This will be registered through your TollBit developer account |

Returns:
`TileResponse[]`

```ts
export interface TileResponse {
  cuid: string;
  name: string;
  description: string;
  inputParams: InputParamsResponse[] | null;
  furtherTopics: string;
  priceMicros: number;
  currency: string;
  embedUrl?: string;
}

export interface InputParamsResponse {
  cuid: string;
  name: string;
  description: string;
  type: string;
  required: string;
  enums: string[] | null;
}
```

Note: the `embedUrl` field will _not_ be populated through this endpoint. That url is generated when you decide to show a specific Tile so we can accurately bill for usage.

Usage:

```jsx
import fetchTiles from "@tollbit/integrate-tiles/fetchTiles";

// Fetch tiles on start up
const RootPage = async () => {
  const tiles = await fetchTiles({
    apiKey: process.env.TOLLBIT_API_KEY,
    userAgent: "MyChatBot",
  });

  return <Chatbot tiles={tiles} />;
};
```

### fetchTile

Once your model is aware of all the Tiles that exist it will need to know which Tile to show based on the user's prompt. We are not perscriptive on how this decision should be made. Once your model knows what Tile to render, you should call this function to load the Tile. This function will return the embed URL that will be displayed within your Chatbot UI.

Parameters:
| Parameter | Type | Description |
| --- | --- | --- |
| cuid | `string` | The `cuid` for the Tile you'd like to display. Obtained from [`fetchTiles()`](#fetchtiles) |
| apiKey | `string` | Your TollBit API Key |
| userAgent | `string` | The user agent that corresponds to your Chatbot. This will be registered through your TollBit developer account |

Returns:
`TileResponse`

```ts
export interface TileResponse {
  cuid: string;
  name: string;
  description: string;
  inputParams: InputParamsResponse[] | null;
  furtherTopics: string;
  priceMicros: number;
  currency: string;
  embedUrl?: string;
}

export interface InputParamsResponse {
  cuid: string;
  name: string;
  description: string;
  type: string;
  required: string;
  enums: string[] | null;
}
```

### formatTilesToTools

Should you choose to load TollBit tiles into your model as functions or tools, we expose a helper function to handle formatting the data into the OpenAI tool format.

```js
import { formatTilesToTools } from "@tollbit/integrate-tiles/formatter";

const tools = formatTilesToTools(tiles);
```

This will still require you to properly identify when tool has been called and to route that tool call to the [`TollbitTile`](#tollbittile) component on the frontend.

## Components

The following UI components are exposed to afford different levels of control to developers looking to display Tiles in their Chatbot.

For full control over the data fetching and visual experience we recommend simply using the [`Tile`](#tile) component. For a more black box solution that takes care of a lot of logic for you, take a look at the [`TollbitTile`](#tollbittile) component.

### Tile

The `<Tile>` component is our base level component. For full control over the visual presentation of the Tile and it's loading state, we recommend directly using this component.

Props:
| Prop | Type | Description |
| --- | --- | --- |
| src | `string` | The embed URL for the given tile. This will be fetched through the [`fetchTile`](#fetchtile) function or by directly hitting the TollBit API |
| parameters | `object` | An optional object of URL params that the tile needs to function. This should be passed from the model to the tile so the tile can fetch its data |

Usage:
The following example uses components Vercel's AI SDK

```tsx
"use client";

import { ToolInvocation } from "ai";
import { Message, useChat } from "ai/react";
import { Tile } from "@tollbit/integrate-tile";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat();

  return (
    <div>
      {messages?.map((m: Message) => (
        <div key={m.id}>
          {m.content}
          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
            const toolCallId = toolInvocation.toolCallId;
            const addResult = (result: string) =>
              addToolResult({ toolCallId, result });

            // This example assumes you've done the work of mapping Tiles to Tools and can pass the proper data to the <Tile> component
            if (toolInvocation.toolName === "TollBitTile") {
              return (
                // The embedUrl should come from the `fetchTile` function call
                <Tile embedUrl={embedUrl} parameters={toolInvocation.args} />
              );
            }

            // other tools:
            return "result" in toolInvocation ? (
              <div key={toolCallId}>
                Tool call {`${toolInvocation.toolName}: `}
                {toolInvocation.result}
              </div>
            ) : (
              <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>
            );
          })}
          <br />
        </div>
      ))}
    </div>
  );
}
```

### TollbitTile

This component comes with more functionality out of the box, including loading placeholders, self contained data fetching, and automatic rendering of follow up prompts.

###
