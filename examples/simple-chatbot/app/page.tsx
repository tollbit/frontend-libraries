import { Tollbit } from "@tollbit/client";
import Chat from "./chat";
import "./styles.css";
import "@tollbit/react-integrate-tile/styles.css";

export default async function Page() {
  const client = new Tollbit(
    process.env.TOLLBIT_API_KEY || "",
    "",
    process.env.CHAT_AGENT || "",
    process.env.NEXT_PUBLIC_TOLLBIT_BASE_URL,
  );
  const tiles = await client.getAllTiles();

  return (
    <main className="mainContent">
      <script
        src="https://cdn.jsdelivr.net/npm/@tollbit/core-integrate-tile@latest/dist/parent.min.js"
        type="text/javascript"
      ></script>
      <Chat tiles={tiles} />
    </main>
  );
}

export const dynamic = "force-dynamic";
