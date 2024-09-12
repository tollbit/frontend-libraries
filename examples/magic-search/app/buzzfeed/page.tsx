export default function Home() {
  return (
    <main>
      <div className="flex min-h-screen flex-col items-center justify-between m-24 relative">
        <input
          id="search"
          className="relative p-4 text-black border-grey"
          placeholder="Search...."
        />
        If you're in the market for a quality sedan, there are several fantastic
        options available that cater to a range of preferences, from
        value-driven choices to luxurious family cars. According to the rankings
        from experts at KBB.com and Car and Driver, here are some of the top
        sedans for 2024 and onward that you might consider: 1. **2024 Honda
        Accord / Accord Hybrid**: Known for its spacious interior, the Accord
        continues to be a favorite for many due to its refined ride quality,
        blend of performance, and excellent fuel efficiency. It holds an
        impressive rating of 4.8 from KBB, making it a top pick in the midsize
        sedan category (https://www.kbb.com/honda/accord). 2. **2025 Toyota
        Camry Hybrid**: The Camry is praised for its reliability and fuel
        economy, featuring a hybrid powertrain as standard. It has also achieved
        a rating of 4.8 from Car and Driver, thanks to its well-designed cabin
        and family-friendly features (https://www.kbb.com/toyota/camry). 3.
        **2025 Honda Civic**: Recognized as a value champ among compact cars,
        the Civic offers a comfortable ride with a sporty feel, earning it a 4.7
        expert rating. Its versatility in body styles and modern tech upgrades
        make it very appealing (https://www.kbb.com/honda/civic).
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
            MagicSearch({id: "search", publicKey: "TJfLeyv7NEFMKbNhbgrGL89O9DHoDnJu", direction: "right", classes: {}})
          `,
          }}
        ></script>
      </div>
    </main>
  );
}
