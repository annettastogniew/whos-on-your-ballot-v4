<script>
    import { addressCandidateData, currentRace } from "./stores";

    /** This component allows users to select for which race they'd like to see a candidate list. */

    // Pull races from global variable. Not all markets or districts have the same races, so we need to
    // pull the ones specific to the entered address
    let races = [];
    addressCandidateData.subscribe((value) => {
        value.map(
            (candidate) =>
                !races.includes(candidate["Office"]) &&
                races.push(candidate["Office"]),
        );
    });

    // Set the current race that is being shown. The default is president, because all markets and
    // districts have this race
    let activeRace = "President";
    currentRace.set(activeRace);

    // When the value of the select is changed, the race that is shown also changes
    const changeRace = (event) => {
        let tabValue = event.target.value;
        activeRace = tabValue;
        currentRace.set(activeRace);
    };
</script>

<main>
    <select bind:value={activeRace} on:change={(e) => changeRace(e)}>
        {#each races as race}
            <option value={race}>
                {race}
            </option>
        {/each}
    </select>
</main>

<style>
    select {
        font-family: "ArtHouse", sans-serif;
        font-size: 17px;
        color: #458ce0;
        font-weight: bold;
        border: none;
        border-bottom: #458ce0 solid 2px;
    }
</style>
