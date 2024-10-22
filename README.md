# "Who's On Your Ballot?" Tool
This tool allows markets to search an address in one of their market states and see who will be on the ballot for that address in the 2024 election.

The tool provides candidate information for presidential, U.S. legislature and state legislature races. Some markets requested additional races/ 
ballot measures that are also shown.

The tool currently works for these markets: IL, FL and CA.

## Framework
This tool was built using [Svelte](https://svelte.dev/docs/introduction), as it was easier to dynamically build and reuse components across markets
with Svelte than with vanilla JS. Instructions for building a Svelte project are [here](https://docs.google.com/document/d/1a_Af9feHj_i9jnVzKkIgyufn9PhOcnAcRX-7IIzoIuE/edit?usp=sharing). 

## Project structure
Each part of this tool is managed by one of the `.svelte` files in `src/lib`. The components are named intuitively, and `SelectRace.svelte` isn't used in the current version of the tool. All global variables are managed in `src/lib/stores.js`.

The parent component for this tool is `src/App.svelte`, the parent css file is `src/app.css` and the HTML template is `index.html`. Data files are stored in `src/data` and fonts are stored in `src/fonts`.

To make changes to any part of the tool, find that tool's component and make changes in that file. Note that any `export let` variables are passed from a parent component and should not be changed. Each file has three parts: the JS script at the top, then the HTML that will be displayed for that component, followed by local styling if needed. 

## Run this project

To run this project locally, clone the git repository and run `npm install` (you only need to do this once), followed by `npm run dev` whenever you
want to develop locally. The project should then display at [http://localhost:5173/whos-on-your-ballot/](http://localhost:5173/whos-on-your-ballot/).

NOTE: if you see an error like this: `Uncaught TypeError: Cannot convert undefined or null to object`, double check that you have URL params specifying
at least market (market=IL, market=FL or market=CA), and also whether or not the tool should be in Spanish (esp=y or esp=n). 

## Host this project

To build this project and host it on a server, run `npm run build`. Vite will bundle the project. You can find the bundled html, css and js files in the
dist folder. Those are the files you should upload to Akamai, or whichever serve you'd like.

### Github Pages

Hosting this project on Github pages requires some reconfiguring, which are explained in the [instructions](https://docs.google.com/document/d/1a_Af9feHj_i9jnVzKkIgyufn9PhOcnAcRX-7IIzoIuE/edit?usp=sharing) mentioned above.

If you run into problems with running the commands from the instructions, you can run `npm run build` in your main branch, then copy the `dist` folder onto your computer. Then go to your gh-pages branch and replace everything there with the contents of your new `dist` folder. Commit and push these changes.

### Akamai

To upload to Akamai, you'll have to follow a few steps. 
1. Save, commit and push all your changes.
2. Go to `vits.config.js` and comment out the line that reads `base: '/whos-on-your-ballot-v4/',`
2. Run `npm run build` and save changes.
3. Somewhere on your computer, make a copy of the `dist` folder from this repo.
4. Copy `counties.json`, `congressional-districts.json`, `state-senate-districts.json` and `state-house-districts.json` from `src/data` 
in this repo to `dist/assets` on your computer.
9. Navigate to the js file inside the `assets` folder.
10. In the js file, search for "`src/data/`" and replace with "`assets/`"
11. Save all changes.
12. FTP the copied `dist` file, with your new changes, to Akamai.
