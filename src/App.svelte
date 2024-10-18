<script>
  import data from "./assets/data/all-data.json";
  import SearchResults from "./lib/SearchResults.svelte";
  import SearchBar from "./lib/SearchBar.svelte";
  import { allCandidateData, mobile } from "./lib/stores";

  /** This is the main body component of the tool. Here, we set the market from the URL params and filter our data to that market.
   * We then pass that data to our search bar and search results components.
   */

  let market,
    marketData,
    url = document.location.href,
    marketStates;

  // set mobile variable now, so we can just pull that info in all other components
  mobile.set(window.innerWidth < 700);
  window.addEventListener("resize", () => {
    mobile.set(window.innerWidth < 700);
  });

  // state information for participating markets
  const states = {
    IL: { IL: "Illinois" },
    FL: { FL: "Florida" },
    MA: { MA: "Massachusetts", NH: "New Hampshire" },
    CA: { CA: "California" },
    DC: { DC: "District of Columbia", MD: "Maryland", VA: "Virginia" },
  };

  // get market from url (or default for local development)
  if (url == "http://localhost:5173/") {
    market = "IL";
  } else {
    market = url.match(/index\.html\?market=(.*)/)[1];
  }

  // filter data for specified market
  marketData = data.filter((row) => row["Market"] === market);
  allCandidateData.set(marketData);

  // filter state info for specified market
  marketStates = states[market];
</script>

<main>
  <h2 class="headline">Find your candidates</h2>
  <SearchBar {marketStates} />
  <SearchResults {market} />
</main>
