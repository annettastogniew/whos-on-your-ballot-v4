<script>
    import Candidates from "./Candidates.svelte";
    import SelectRace from "./SelectRace.svelte";
    import Map from "./Map.svelte";
    import { addressCandidateData } from "./stores";

    export let market;

    /** This component displays search results for a given address. It is basically just a container for the
     * race select, candidate list and map components.
     */

    // Pull candidate data from global variable (to passed to other components)
    let candidateData = [];
    addressCandidateData.subscribe((value) => {
        candidateData = value;
    });
</script>

<main>
    <div id="search-results">
        {#if candidateData.length > 0}
            <div id="select-race">
                <p id="see-candidates">See candidates running for</p>
                <SelectRace />
            </div>
            <div id="results-container">
                <Candidates {market}/>
                <Map {market} />
            </div>
        {/if}
    </div>
</main>

<style>
    #search-results {
        display: none;
        width: 100% !important;
    }

    #select-race {
        display: flex;
        align-items: center;
    }

    #see-candidates {
        margin-right: 5px;
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
