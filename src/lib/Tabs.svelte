<script>
    import { addressCandidateData, currentRace } from "./stores";

    let races = [];
    addressCandidateData.subscribe((value) => {
        value.map(
            (candidate) =>
                !races.includes(candidate["Office"]) &&
                races.push(candidate["Office"]),
        );
    });

    let activeRace = "President";
    currentRace.set(activeRace);

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
