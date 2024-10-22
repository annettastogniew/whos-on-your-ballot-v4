<script>
  import data from "./data/candidates.json";
  import SearchResults from "./lib/SearchResults.svelte";
  import SearchBar from "./lib/SearchBar.svelte";
  import { allCandidateData, mobile } from "./lib/stores";

  /** This is the main body component of the tool. Here, we set the market from the URL params and filter our data to that market.
   * We then pass that data to our search bar and search results components.
   */

  let market,
    marketData,
    esp,
    marketStates,
    hedText;

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

  // get market from url 
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  market = urlParams.get("market");

  // get url param for spanish or english
  esp = urlParams.get("esp") === "y" ? true : false;
  // headline text depending on language
  hedText = esp ? "Encuentra a tus candidatos" : "Find your candidates";

  // filter data for specified market
  marketData = data.filter((row) => row["Market"] === market);
  allCandidateData.set(marketData);

  // filter state info for specified market
  marketStates = states[market];
</script>

<main>
  <h2 class="headline">{hedText}</h2>
  <SearchBar {marketStates} {esp}/>
  <SearchResults {market} {esp}/>
</main>
