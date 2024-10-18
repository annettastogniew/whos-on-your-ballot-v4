import { writable } from 'svelte/store';

export const currentRace = writable("");

export const mobile = writable(false);

export const coords = writable({});

export const districts = writable({});

export const allCandidateData = writable([]);

export const addressCandidateData = writable([]);
