<script>
    import {
        addressCandidateData,
        currentRace,
        districts,
        state,
    } from "./stores";
    import data from "../data/counties.json";

    export let market;
    export let esp;

    /** This component displays a list of candidates running for the current race (set by select component)
     * for the current address' districts (set by search bar component). It uses global variables to generate
     * a table of candidate names, with hyperlinks to their websites, and their parties.
     */

    let activeRace,
        raceData,
        allDistricts,
        regionName,
        countyName,
        incumbents,
        county,
        currentState,
        flNoteText = esp
            ? `Ve la clave de abreviaturas de los partidos en inglés <a target="_blank" href="https://dos.fl.gov/elections/candidates-committees/political-parties/">aquí</a>. WRI significa “por escrito”.`
            : `See party abbreviations key <a target="_blank" href="https://dos.fl.gov/elections/candidates-committees/political-parties/">here</a>. WRI denotes "write-in."`,
        caNoteText = esp
            ? `Los candidatos se están postulando tanto para el mandato parcial/no vencido que finaliza el 3 de enero de 2025, como para el mandato completo que le sigue`
            : `Candidates are running for both the partial/unexpired term ending on Jan. 3, 2025 and the full term that follows.`,
        maNoteText = esp
            ? `Según las reglas de la legislatura de Massachusetts, la compañera de fórmula de Jill Stein aparece como Gloria Caballero-Roca. Su compañero de fórmula real es Rudolph Ware. Lee más <a href="https://www.green-rainbow.org/#:~:text=NOTE%3A%20When%20you,the%20corporate%20duopoly!">aquí</a>.`
            : `Per Massachusetts Legislature rules, Jill Stein's running mate is listed as Gloria Caballero-Roca. Her actual running mate is Rudolph Ware. Read more <a href="https://www.green-rainbow.org/#:~:text=NOTE%3A%20When%20you,the%20corporate%20duopoly!">here</a>.`,
        noteText,
        colOneHed = esp ? "Candidato" : "Candidate",
        colTwoHed = esp ? "Partido" : "Party",
        candidateData = [];

    // Different markets list parties differently, so these are the colors for the major parties in each market
    const marketParties = {
        IL: {
            D: ["#2380cf"],
            R: ["#cf232a"],
            I: ["#cfab23"],
        },
        FL: {
            DEM: ["#2380cf"],
            REP: ["#cf232a"],
            GRE: ["#308e18"],
            LPF: ["#76188e"],
            IND: ["#cfab23"],
        },
        CA: {
            D: ["#2380cf"],
            R: ["#cf232a"],
            I: ["#cfab23"],
            G: ["#308e18"],
            L: ["#76188e"],
        },
        MA: {
            D: ["#2380cf"],
            R: ["#cf232a"],
            I: ["#cfab23"],
            G: ["#308e18"],
            L: ["#76188e"],
        },
    };

    // Get background color for given party
    const partyColor = (party) => {
        party = party.trim();
        const thisMarketParties = marketParties[market];
        if (Object.keys(thisMarketParties).includes(party)) {
            return thisMarketParties[party];
        } else {
            return "#838383";
        }
    };

    // Pull candidate information from global variable
    addressCandidateData.subscribe((value) => {
        candidateData = value;
    });

    // Pull county and district information for specific address, from global variables
    districts.subscribe((value) => {
        allDistricts = value;
        county = value["President"];
    });

    // Pull state from global variable
    state.subscribe((value) => {
        currentState = value;
    });

    // Get county name from county data, since search results only yield FIPS code
    const counties = data["features"];
    const thisCounty = counties.filter(
        (c) => c["properties"]["DISTRICT"].toString() == county.toString(),
    )[0];
    const thisCountyName = thisCounty["properties"]["NAME"];
    countyName = esp ? `Condado ${thisCountyName}` : `${thisCountyName} County`;

    // Get region (district or county) name to display above candidate list
    currentRace.subscribe((value) => {
        activeRace = value;
        if (value === "President" || value === "U.S. Senate") {
            regionName = countyName;
        } else {
            let districtName =
                currentState === "NH" && value === "State House"
                    ? allDistricts[value]
                          .toLowerCase()
                          .split(" ")
                          .map(
                              (s) => s.charAt(0).toUpperCase() + s.substring(1),
                          )
                          .join(" ")
                    : allDistricts[value];
            regionName = esp
                ? `Distrito ${districtName}`
                : `District ${districtName}`;
        }
    });

    const sortCandidates = (a, b) => {
        const partyA = a["Party"].trim();
        const partyB = b["Party"].trim();
        const parties = Object.keys(marketParties[market]);
        if (
            a["Incumbent"] === "Yes" ||
            (parties.includes(partyA) && !parties.includes(partyB))
        ) {
            return -1;
        } else if (parties.includes(partyB) && !parties.includes(partyA)) {
            return 1;
        } else {
            return 0;
        }
    };

    // Filter candidate data for specific race. Will change as current race changes
    $: raceData = candidateData
        .filter((candidate) => candidate["Office"] === activeRace)
        .sort((a, b) => sortCandidates(a, b));

    // Add note if needed (only needed for certain markets/ races)
    $: noteText =
        market === "FL"
            ? flNoteText
            : market === "CA" && activeRace === "U.S. Senate"
              ? caNoteText
              : currentState === "MA" && activeRace === "President"
                ? maNoteText
                : "";

    // Determine whether any candidates are incumbent
    $: incumbents = raceData.some(
        (candidate) => candidate["Incumbent"] === "Yes",
    );
</script>

<main>
    <h3 class="region-name">{regionName}</h3>
    <div class="table-container">
        <table id="candidate-list" cellspacing="0" cellpadding="0">
            <thead id="table-header">
                <tr>
                    <th>{colOneHed}</th>
                    <th>{colTwoHed}</th>
                </tr>
            </thead>
            <tbody>
                {#each raceData as candidate}
                    <tr>
                        {#if candidate["Incumbent"] === "Yes"}
                            {#if candidate["Website"]}
                                <td
                                    ><a
                                        target="”_blank”"
                                        href={candidate["Website"]}
                                        >{candidate["Candidate Name"]}</a
                                    >*</td
                                >
                            {:else}
                                <td>{candidate["Candidate Name"]}*</td>
                            {/if}
                        {:else if candidate["Website"]}
                            <td
                                ><a
                                    target="”_blank”"
                                    href={candidate["Website"]}
                                    >{candidate["Candidate Name"]}</a
                                ></td
                            >
                        {:else}
                            <td>{candidate["Candidate Name"]}</td>
                        {/if}
                        <td>
                            <div
                                class={market === "FL"
                                    ? "party-block fl"
                                    : "party-block"}
                                style={`background-color: ${partyColor(candidate["Party"])}`}
                            >
                                {candidate["Party"]}
                            </div>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    {#if incumbents}
        <p class="note">{esp ? "*Incumbido" : "*Incumbent"}</p>
    {/if}
    <p class="note">{@html noteText}</p>
</main>

<style>
    main {
        max-width: 350px;
    }

    #candidate-list {
        padding: 0;
        width: 100%;
    }

    .table-container {
        max-height: 250px;
        min-width: 350px;
        overflow: auto;
        border-radius: 2px;
        border: #ededed 1px solid;
    }

    .region-name {
        font-family: "ArtHouseCondensedBold", sans-serif;
        font-size: 20px;
    }

    .party-block.fl {
        border-radius: 3px;
        width: 40px;
    }

    .party-block {
        border-radius: 3px;
        color: #ffffff;
        padding: 2px;
        text-align: center;
        align-items: center;
        max-width: 30px;
        height: 20px;
    }

    .note {
        font-size: 15px;
        color: #838383;
    }

    thead {
        background-color: #ededed;
        color: #838383;
        display: table-header-group;
        position: sticky;
        top: 0;
        z-index: 1;
    }

    td,
    th {
        padding: 10px 5px;
        text-align: start;
    }

    td {
        background-color: #ffffff;
        border-bottom: 1px solid #ededed;
    }

    @media screen and (max-width: 700px) {
        main {
            max-width: none;
        }
    }
</style>
