<script>
    import { addressCandidateData } from "./stores";

    export let esp;

    let ballotMeasures;
    addressCandidateData.subscribe(
        (value) =>
            (ballotMeasures = value.filter(
                (race) => race["Office"] == "Ballot Measures",
            )),
    );
</script>

<main>
    <ul>
        {#each ballotMeasures as ballotMeasure}
            <li>
                <h2>{ballotMeasure["Measure Name"]}</h2>
                <p>{ballotMeasure["Measure Question"]}</p>
            </li>
        {/each}
    </ul>
</main>

<style>
    ul {
        list-style-type: none;
        padding-left: 0;
    }

    h2 {
        font-family: "ArtHouseCondensedBold";
        font-size: 22px;
        margin-bottom: 0px;
    }

    li {
        margin-bottom: 35px;
    }

    main {
        max-width: 800px;
    }
</style>
