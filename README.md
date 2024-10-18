# "Who's On Your Ballot?" Tool
This tool allows markets to search an address in one of their market states and see who will be on the ballot for that address in the 2024 election.

The tool provides candidate information for presidential, U.S. legislature and state legislature races. Some markets requested additional races/ 
ballot measures that are also shown.

## Framework
This tool was built using (Svelte)[https://svelte.dev/docs/introduction], as it was easier to dynamically build and reuse components across markets
with Svelte than with vanilla JS. Instructions for building a Svelte project are (here)[https://docs.google.com/document/d/1a_Af9feHj_i9jnVzKkIgyufn9PhOcnAcRX-7IIzoIuE/edit?usp=sharing]. 

## Run this project

To run this project locally, clone the git repository and run `npm install` (you only need to do this once), followed by `npm run dev` whenever you
want to develop locally. The project should then display at [http://localhost:5173/](http://localhost:5173/).

## Host this project

To build this project and host it on a server, run `npm run build`. Vite will bundle the project. You can find the bundled html, css and js files in the
dist folder. Those are the files you should upload to Akamai, or whichever serve you'd like.

Hosting this project on Github pages requires some reconfiguring, which are explained in the (instructions)[https://docs.google.com/document/d/1a_Af9feHj_i9jnVzKkIgyufn9PhOcnAcRX-7IIzoIuE/edit?usp=sharing] mentioned above.