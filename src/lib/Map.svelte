<script>
    import { currentRace, coords, districts, mobile } from "./stores";
    import * as d3 from "d3";
    import { draw } from "svelte/transition";
    import stateData from "../data/states.json";

    export let market;

    /** This component displays a state map, with the district for the specified address highlighted
     * and a point at the address' exact location.
     */

    let mapType,
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
    const marketFips = {
        MA: ["25", "33"],
        CA: ["06"],
        IL: ["17"],
        FL: ["12"],
        DC: ["11", "24", "51"],
    };

    // Filter stateData for market states
    marketStates = stateData["features"].filter((state) =>
        marketFips[market].includes(state["properties"]["STATEFP"]),
    );

    // Pull address coords from global variable
    coords.subscribe((value) => {
        coordinates = [value];
    });

    // Pull mobile information from global variable and restyle accordingly
    mobile.subscribe((value) => {
        if (value) {
            viewBox = "0 0 300 150";
            mapParams = {
                IL: { scale: 1500, translate: [55,110] },
                FL: { scale: 1300, translate: [-70, -150] },
            };
            circleDims = [3, 2, 1.5];
            strokeWidth = 0.35;
        } else {
            viewBox = "0 0 450 375";
            mapParams = {
                IL: { scale: 3800, translate: [-150, 275] },
                FL: { scale: 2500, translate: [-235, -250] },
            };
            circleDims = [6, 4, 3];
            strokeWidth = 0.75;
        }

        // Map projection for d3
        projection = d3
            .geoAlbersUsa()
            .scale(mapParams[market]["scale"])
            .translate(mapParams[market]["translate"]);
        path = d3.geoPath(projection);
        points = coordinates.map((p) => projection([p["lng"], p["lat"]]));
    });

    // Pull district info from global variables
    districts.subscribe((value) => {
        allDistricts = value;
    });

    // As selected race changes, change the map
    currentRace.subscribe((value) => {
        switch (value) {
            case "President":
            case "U.S. Senate":
                mapType = "counties";
                break;
            case "U.S. House":
                mapType = "congressional-districts";
                break;
            case "State House":
                mapType = "state-house-districts";
                break;
            case "State Senate":
                mapType = "state-senate-districts";
                break;
        }
        currentDistrict = allDistricts[value];
        regions = [];
        d3.json(`src/data/${mapType}.json`).then((data) => {
            regions = data.features;
            regions = regions.filter((region) =>
                marketFips[market].includes(
                    region["properties"]["STATEFP"].toString(),
                ),
            );
        });
    });
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
