<script>
    import { currentRace, coords, districts, mobile, state } from "./stores";
    import * as d3 from "d3";
    import { draw } from "svelte/transition";
    import stateData from "../data/states.json";

    export let races;

    /** This component displays a state map, with the district for the specified address highlighted
     * and a point at the address' exact location.
     */

    let racesCopy = [...races],
        currentState,
        points,
        coordinates,
        projection,
        path,
        circleDims,
        viewBox,
        strokeWidth,
        mapParams = {},
        regions = [],
        allDistricts,
        currentDistrict,
        marketStates;

    // FIPS codes for each market's states, so we can pull just those states from the geojson files
    const stateFips = {
        MA: ["25"],
        NH: ["33"],
        CA: ["06"],
        IL: ["17"],
        FL: ["12"],
        DC: ["11", "24", "51"],
    };

    // Pull state from global variable
    state.subscribe(value => {
        currentState = value;
    });

    // file names for each race type
    const raceFiles = {
        "President": "counties",
        "U.S. Senate": "counties",
        "U.S. House": "congressional-districts",
        "State House":"state-house-districts",
        "State Senate":"state-senate-districts"
    };

    // Store data for each race so maps will load faster
    const raceData = {
        "President": [],
        "U.S. Senate": [],
        "U.S. House": [],
        "State House": [],
        "State Senate": []
    };

    // Filter stateData for market states
    marketStates = stateData["features"].filter((state) =>
        stateFips[currentState].includes(state["properties"]["STATEFP"]),
    );

    // No map for ballot measures, need to remove if in races
    if (racesCopy.includes("Ballot Measures")) {
        racesCopy.pop();
    };

    // Load shapefiles for each race type
    for (let i = 0; i < racesCopy.length; i++) {
        d3.json(`src/data/${raceFiles[racesCopy[i]]}.json`).then((data) => {
            let thisRaceData = data.features;
            raceData[racesCopy[i]] = thisRaceData.filter((region) =>
                stateFips[currentState].includes(
                    region["properties"]["STATEFP"].toString(),
                ),
            );
        });
    }

    // Pull address coords from global variable
    coords.subscribe((value) => {
        coordinates = [value];
    });

    // Pull mobile information from global variable and restyle accordingly
    mobile.subscribe((value) => {
        if (value) {
            viewBox = "0 0 300 150";
            mapParams = {
                IL: { scale: 1500, translate: [30, 110] },
                FL: { scale: 1300, translate: [-70, -150] },
                CA: { scale: 750, translate: [400, 90] },
                MA: { scale: 4500, translate: [-1250, 520] },
                NH: { scale: 3000, translate: [-735, 475] },
            };
            circleDims = [3, 2, 1.5];
            strokeWidth = 0.35;
        } else {
            viewBox = "0 0 450 375";
            mapParams = {
                IL: { scale: 3800, translate: [-150, 275] },
                FL: { scale: 2500, translate: [-235, -250] },
                CA: { scale: 1800, translate: [800, 210] },
                MA: { scale: 8000, translate: [-2300, 1000] },
                NH: { scale: 6500, translate: [-1800, 1010] },
            };
            circleDims = [6, 4, 3];
            strokeWidth = 0.75;
        }

        // Map projection for d3
        projection = d3
            .geoAlbersUsa()
            .scale(mapParams[currentState]["scale"])
            .translate(mapParams[currentState]["translate"]);
        path = d3.geoPath(projection);
        points = coordinates.map((p) => projection([p["lng"], p["lat"]]));
    });

    // Pull district info from global variables
    districts.subscribe((value) => {
        allDistricts = value;
    });

    // As selected race changes, change the map
    currentRace.subscribe((value) => {
        currentDistrict = allDistricts[value];
        // clear regions so map animation will restart
        regions = [];
        // load new regions (delay so animation will play)
        setTimeout(() => regions = raceData[value], 300);
    });

    // Set default race to President (need to delay to ensure d3 data has loaded)
    setTimeout(() => regions = raceData["President"], 500);
</script>

<main>
    <svg {viewBox} id="map">
        <g fill="white">
            {#each marketStates as state}
                <path fill={"#d3d3d3"} d={path(state)} class="region" />
            {/each}
            {#each regions as feature, i}
                <path
                    in:draw={{ delay: i * 10, duration: 500 }}
                    fill={feature["properties"]["DISTRICT"].toString() !==
                    currentDistrict.toString()
                        ? "none"
                        : "#838383"}
                    d={path(feature)}
                    class="region"
                    stroke-width={strokeWidth}
                    stroke="#ffffff"
                />
            {/each}
            {#each points as [cx, cy]}
                <circle {cx} {cy} r={circleDims[0]} fill="#e04b45" />
                <circle {cx} {cy} r={circleDims[1]} fill="white" />
                <circle {cx} {cy} r={circleDims[2]} fill="#e04b45" />
            {/each}
        </g>
    </svg>
</main>

<style>
    main {
        width: 450px;
    }

    #map {
        max-height: 375px;
    }

    @media screen and (max-width: 700px) {
        main {
            width: 350px;
        }
    }
</style>
