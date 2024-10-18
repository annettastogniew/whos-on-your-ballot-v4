<script>
    import { addressCandidateData, currentRace, districts } from "./stores";
    import data from "../data/counties.json";

    export let market;

    /** This component displays a list of candidates running for the current race (set by select component)
     * for the current address' districts (set by search bar component). It uses global variables to generate
     * a table of candidate names, with hyperlinks to their websites, and their parties.
     */

    let activeRace,
        raceData,
        allDistricts,
        regionName,
        countyName,
        county,
        candidateData = [];

    // Different markets list parties differently, so these are the colors for the major parties in each market
    const marketParties = {
        IL: {
            DEM: ["#2380cf"],
            GOP: ["#cf232a"],
            IND: ["#cfab23"],
        },
        FL: {
            DEM: ["#2380cf"],
            REP: ["#cf232a"],
            GRE: ["#308e18"],
            LPF: ["#76188e"],
            IND: ["#cfab23"],
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

    // Get county name from county data, since search results only yield FIPS code
    const counties = data["features"];
    const thisCounty = counties.filter(
        (c) => c["properties"]["DISTRICT"].toString() == county.toString(),
    )[0];
    const thisCountyName = thisCounty["properties"]["NAME"];
    countyName = `${thisCountyName} County`;

    // Get region (district or county) name to display above candidate list
    currentRace.subscribe((value) => {
        activeRace = value;
        if (value === "President" || value === "U.S. Senate") {
            regionName = countyName;
        } else {
            regionName = `District ${allDistricts[value]}`;
        }
    });

    // Filter candidate data for specific race. Will change as current race changes
    $: raceData = candidateData.filter(
        (candidate) => candidate["Office"] === activeRace,
    );
</script>

<main>
    <h3 class="region-name">{regionName}</h3>
    <div class="table-container">
        <table id="candidate-list" cellspacing="0" cellpadding="0">
            <thead id="table-header">
                <tr>
                    <th>Candidate</th>
                    <th>Party</th>
                </tr>
            </thead>
            <tbody>
                {#each raceData as candidate}
                    <tr>
                        {#if candidate["Website"]}
                            <td
                                ><a href={candidate["Website"]}
                                    >{candidate["Candidate Name"]}</a
                                ></td
                            >
                        {:else}
                            <td>{candidate["Candidate Name"]}</td>
                        {/if}
                        <td>
                            <div
                                class="party-block"
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
    {#if market === "FL"}
        <p class="party-note">
            See party abbreviations key <a
                href="https://dos.fl.gov/elections/candidates-committees/political-parties/"
                >here</a
            >. WRI denotes "write-in."
        </p>
    {/if}
</main>

<style>
    #candidate-list {
        padding: 0;
        width: 100%;
    }

    .table-container {
        max-height: 300px;
        min-width: 350px;
        overflow: auto;
        border-radius: 2px;
        border: #ededed 1px solid;
    }

    .region-name {
        font-family: "ArtHouseCondensedBold", sans-serif;
        font-size: 20px;
    }

    .party-block {
        border-radius: 3px;
        color: #ffffff;
        padding: 2px;
        text-align: center;
        max-width: 40px;
        /*font-family: "ArtHouseBold", sans-serif;*/
    }

    .party-note {
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
</style>
