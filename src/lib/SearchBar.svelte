<script>
  import axios from "axios";
  import * as d3 from "d3";
  import {
    allCandidateData,
    addressCandidateData,
    coords,
    districts,
  } from "../lib/stores";
  import Spinner from "./Spinner.svelte";
  import { fade } from "svelte/transition";

  export let marketStates;

  /** This is the search bar component. It contains everything you first see when you open the tool (prompts and search bar).
   * When an address is entered in the search bar, we call the geocodio API to return that address' coordinaties, county,
   * state legislative districts and congressional district.
   */

  let statePlaceholder = "",
    resultsMessage = "",
    stateNames = Object.values(marketStates).join(" or "),
    searchPassed = false,
    loading = false;

  // Each market should have a local address for the placeholder in the search bar
  const placeholders = {
    IL: "1200 S Dusable Lake Shore Dr, Chicago, IL 60605",
    FL: "2396 Overseas Hwy, Marathon, FL 33050",
    MA: "1508 Tremont St, Boston, MA 02120",
    DC: "3001 Connecticut Ave NW, Washington, DC 20008",
    CA: "1101 Eucalyptus Dr, San Francisco, CA 94132",
  };

  // Get placeholder for specific market
  statePlaceholder = placeholders[Object.keys(marketStates)[0]];

  // Search function
  const search = (e) => {
    // Need to reset data at the start of every search
    addressCandidateData.set([]);
    coords.set([]);
    districts.set({});
    // Start loading spinner
    loading = true;
    // New address from search bar
    const address = e.target.value;
    // Call geocodio API
    axios
      .get(
        `https://api.geocod.io/v1.7/geocode?api_key=065ef0c6cfea5a6fa60f9fece9f9c6e6cefd5e0&q=${address.replace(/ /g, "+")}&fields=cd,census,stateleg`,
      )
      .then((response) => {
        // If the API call worked, stop loading spinner
        loading = false;
        const result = response["data"]["results"][0];
        // If the entered address is in a state affiliated with this market, load data
        if (
          Object.keys(marketStates).includes(
            result["address_components"]["state"],
          )
        ) {
          searchPassed = true;
          // Pull address information from API results
          const districtResults = result["fields"];
          const stateHouseDist =
            districtResults["state_legislative_districts"]["house"][0][
              "district_number"
            ];
          const stateSenDist =
            districtResults["state_legislative_districts"]["senate"][0][
              "district_number"
            ];
          const houseDist =
            districtResults["congressional_districts"][0]["district_number"];
          const fipsCode = districtResults["census"]["2023"]["county_fips"];
          const address = result["formatted_address"];

          let raceDistricts = {
            President: fipsCode,
            "U.S. Senate": fipsCode,
            "U.S. House": houseDist,
            "State Senate": stateSenDist,
            "State House": stateHouseDist,
          };

          // Senate and Presidential candidates are the same statewide, so we only need to filter
          // state house/senate and US house candidates by district
          const filterCandidates = (candidate) => {
            if (
              candidate["Office"] != "President" &&
              candidate["Office"] != "U.S. Senate"
            ) {
              return (
                raceDistricts[candidate["Office"]] == candidate["District"]
              );
            } else {
              return true;
            }
          };

          // Filter candidate data for candidates relevant to this address
          let candidateDataCopy = [];
          allCandidateData.subscribe((value) => {
            candidateDataCopy = value;
          });
          candidateDataCopy = candidateDataCopy.filter((candidate) =>
            filterCandidates(candidate),
          );

          // Need to set some global variables so they're accessible from other components
          coords.set(result["location"]);
          districts.set(raceDistricts);
          addressCandidateData.set(candidateDataCopy);

          // Show search results component
          d3.select("#search-results").style("display", "inline-block");

          resultsMessage = `Showing results for ${address}.`;
        }
        // If the entered address is not in a state affiliated with this market, display an error message
        else {
          searchPassed = false;
          resultsMessage = `Please enter a valid ${stateNames} address. You may need to type your full address to see results.`;
        }
      })
      .catch((e) => {
        // If the API returned an error, display an error message
        loading = false;
        searchPassed = false;
        resultsMessage = `Please enter a valid ${stateNames} address. You may need to type your full address to see results.`;
      });
  };
</script>

<main>
  <div id="search">
    <p id="instructions">
      Enter an address in {stateNames} to find candidates running for office in your
      area.
    </p>
    <div id="search-input">
      <input
        id="address-input"
        class="form-control"
        placeholder={statePlaceholder}
        on:change={search}
      />
      <button type="button" id="address-input-button" class="btn btn-primary"
        >Submit</button
      >
    </div>
    <p class={searchPassed ? "msg showing-results" : "msg error"}>
      {resultsMessage}
    </p>
    {#if loading}
      <div
        in:fade={{ delay: 10, duration: 50 }}
        out:fade={{ delay: 100, duration: 150 }}
        id="loader"
      >
        <Spinner />
      </div>
    {/if}
  </div>
</main>

<style>
  #search-input {
    display: flex;
  }

  #address-input {
    width: 725px;
    padding: 10px;
    font-size: 15px;
    border: #d3d3d3 solid 1px;
    border-radius: 2px;
  }

  #address-input-button {
    margin-left: 5px;
    background-color: #458ce0;
    border-radius: 2px;
    color: white;
    border: none;
  }

  .msg {
    font-size: 16px;
  }

  .showing-results {
    color: #838383;
  }

  .error {
    color: #e04b45;
  }

  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
  }
</style>
