<script>
    import Candidates from "./Candidates.svelte";
    import SelectRace from "./SelectRace.svelte";
    import BallotMeasures from "./BallotMeasures.svelte";
    import Map from "./Map.svelte";
    import { addressCandidateData, currentRace } from "./stores";
    import Tabs from "./Tabs.svelte";

    export let market;
    export let esp;

    /** This component displays search results for a given address. It is basically just a container for the
     * race select, candidate list and map components.
     */

    // Pull candidate data from global variable (to passed to other components)
    let candidateData = [];
    addressCandidateData.subscribe((value) => {
        candidateData = value;
    });

    // Need to subscribe to current race so we can display race results or ballot measures
    let activeRace = "President";
    currentRace.set(activeRace);
    currentRace.subscribe((value) => {
        activeRace = value;
    });

    // Need a list of unique races from the data, each race will have a tab button
    let races = [];
    addressCandidateData.subscribe((value) => {
        value.map((candidate) =>
            market === "FL" && esp
                ? candidate["Office"] !== "Ballot Measures" &&
                  !races.includes(candidate["Office"]) &&
                  races.push(candidate["Office"])
                : !races.includes(candidate["Office"]) &&
                  races.push(candidate["Office"]),
        );
    });
</script>

<main>
    <div id="search-results">
        {#if candidateData.length > 0}
            <!--<div id="select-race">
                <p id="see-candidates">See candidates running for</p>
                <SelectRace />
            </div>-->
            <Tabs {esp} {races} />
            <div id="results-container">
                {#if activeRace === "Ballot Measures"}
                    <BallotMeasures {esp} />
                {:else}
                    <Candidates {market} {esp} />
                    <Map {market} {races} />
                {/if}
            </div>
        {/if}
    </div>
</main>

<style>
    #search-results {
        display: none;
        width: 100% !important;
    }

    #results-container {
        display: flex;
    }

    @media screen and (max-width: 700px) {
        #results-container {
            flex-direction: column-reverse;
        }
    }
</style>
