<script>
    import { addressCandidateData, currentRace } from "./stores";

    /** This component allows users to switch between races by clicking on different tab buttons.
     * When a button is clicked, the current race global variable is set to that race.
    */

    // Need a list of unique races from the data, each race will have a tab button
    let races = [];
    addressCandidateData.subscribe((value) => {
        value.map(
            (candidate) =>
                !races.includes(candidate["Office"]) &&
                races.push(candidate["Office"]),
        );
    });

    // Need to know the current active race
    let activeRace;
    currentRace.subscribe(value => {
        activeRace = value;
    });

    // When a tab button is clicked, change the current active race
    const handleClick = (tabValue) => {
        activeRace = tabValue;
        currentRace.set(activeRace);
    };
</script>

<main>
    <div id="tabs">
        {#each races as race}
            <button
                class={race === activeRace ? "active" : ""}
                on:click={() => handleClick(race)}>{race}</button
            >
        {/each}
    </div>
</main>

<style>
    .active {
        background-color: #838383;
    }

    button {
        color: #ffffff;
        background-color: #d3d3d3;
        margin-right: 10px;
        border-radius: 3px;
        box-shadow: none;
        border: none;
        padding: 5px 10px;
    }

    main {
        margin-top: 10px;
        margin-bottom: 35px;
    }
</style>
