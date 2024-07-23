import { Tollbit } from "@tollbit/tollbit-node-sdk";
import Chat from "./chat";

export default async function Page() {
  const client = new Tollbit(
    process.env.TOLLBIT_API_KEY || "",
    "",
    process.env.CHAT_AGENT || "",
    process.env.NEXT_PUBLIC_TOLLBIT_BASE_URL
  );
  const tiles = await client.getAllTiles();
  // Get a random name of a user
  const names = [
    "Luke",
    "Toshit",
    "Olivia",
    "Martin",
    "Josh",
    "Garrison",
    "Harseet",
    "Anthony",
    "Anupama",
    "Greta",
  ];
  const randomName = names[Math.floor(Math.random() * names.length)];

  return (
    <main className="max-w-3xl mx-auto px-6">
      <script
        src="https://cdn.jsdelivr.net/npm/tile-resizer@0.1.1/dist/parent.min.js"
        type="text/javascript"
      ></script>
      <Chat tiles={tiles} name={randomName} />
    </main>
  );
}

export const dynamic = "force-dynamic";
