import { writable } from 'svelte/store';

/** Svelte allows you to store global variables in the store.js file. 
 * They can be accessed and updated in different components. */

// Global variable to track which race is currently selected
export const currentRace = writable("");

// Global variable to determine whether the tool is being used on mobile
export const mobile = writable(false);

// Global variable for searched address coordinates
export const coords = writable({});

// Global variable for districts relevant to searched address
export const districts = writable({});

// Global variable for market's candidate data
export const allCandidateData = writable([]);

// Global variable for searched address' candidate data
export const addressCandidateData = writable([]);
