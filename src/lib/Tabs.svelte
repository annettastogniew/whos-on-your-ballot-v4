<script>
    import { currentRace } from "./stores";

    export let esp;
    export let races;

    /** This component allows users to switch between races by clicking on different tab buttons.
     * When a button is clicked, the current race global variable is set to that race.
     */

    // Spanish tab labels
    let spanishRaces = {
        "President": "Presidente",
        "U.S. House": "Cámara de Representantes de EEUU",
        "U.S. Senate": "Senado de EEUU",
        "State Senate": "Senado Estatal",
        "State House": "Cámara de Representantes Estatal",
        "Ballot Measures": "Medidas en la boleta",
    };

    // Need to know the current active race
    let activeRace;
    currentRace.subscribe((value) => {
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
                on:click={() => handleClick(race)}
                >{esp ? spanishRaces[race] : race}</button
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

    button {
        margin-bottom: 10px;
    }
</style>
