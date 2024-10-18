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
    <ul id="tabs">
        {#each races as race}
            <button
                class={race === activeRace ? "active" : ""}
                on:click={() => handleClick(race)}>{race}</button
            >
        {/each}
    </ul>
</main>

<style>
    .active {
        background-color: #a9a9a9;
    }

    ul {
        display: flex;
        flex-wrap: wrap;
        padding-left: 0;
        margin-bottom: 0;
        list-style: none;
    }
</style>
