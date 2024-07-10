# @tollbit/create-tile

The purpose of this library is to enable developers to build rich integrations to be licensed to Chatbots.

## Usage

### Setup

React:

If you are developing with React, we expose a single `TileWrapper` component to wrap your content with. This enables the content of your Tile to resize itself when a Chatbot renders the content.

```tsx
import TileWrapper from "@/lib/TileWrapper";

export default async function MyTile({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const response = await fetchMyData();

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return (
    <TileWrapper>
      <MyTileContent {...data} />
    </TileWrapper>
  );
}
```

Other:

If you are using a UI framework other than React, you can simply interact directly with the `@tollbit/create-tile/resizer` module.

```js
import init from "@tollbit/create-tile/resizer";

// Get the HTML Element for your page that will be
const page = document.getElementById("my-page");
init(page);
```

### Send messages

In order for Tiles to interact back with the model, we expose a utility to send messages up from the Tile back to the Chatbot itself. It is up to the developer of the Chatbot what to do with these messages as they are sent. The use of this utility does not guarantee an effect on the model that is implementing your Tile

To send a message, use the `@tollbit/create-tile/sendMessage`

```jsx
import sendMessage from "@tollbit/create-tile/sendMessage";

export const MyAction = ({ suggestion }) => (
  <Button onClick={() => sendMessage(suggestion)}>{suggestion}</Button>
);
```
