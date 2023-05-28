///////////////////////////////////////////////////////////////////////////////
// Ce fichier contient le code lié à l'interface usager du site Web. Le code
// concernant l'état et le comportement du site se trouve dans la classe `App`.

import App from "./modules/App.js";
import data from "./data/ghibli.js";

// On passe en argument l'élément dans lequel afficher le jeu de données
// afin de respecter la séparation des responsabilités. De cette façon,
// `App` n'a pas besoin de connaître le balisage pour bien fonctionner.
const mainEL = document.querySelector("main");
const app = new App(data, mainEL);

app.displayMovies();

////////////////////////////////////////////////////////////////////////////
// VUES
//
// Configure la vue par défaut, et attache écouteur d'évènements qui appelle le
// mutateur `setView` lorsque la valeur de l'un des contrôles change.

const defaultView = document.querySelector("#display input:checked").value;
app.setView(defaultView);

const viewInputEls = document.querySelectorAll("#display input");
viewInputEls.forEach((viewInputEl) => {
	viewInputEl.addEventListener("change", () => {
		app.setView(viewInputEl.value);
	});
});

////////////////////////////////////////////////////////////////////////////
// RECHERCHE
//
// Attache un écouteur d'évènement au contrôle de recherche. La valeur du
// contrôle est transmise à la méthode `searchMovies` lorsque le bouton
// associée au contrôle est cliqué.

const searchInput = document.querySelector("#search input");
const searchButton = document.querySelector("#search button[type='submit']");
const resetSearchButton = document.querySelector(
	"#search button[type='reset']"
);

searchButton.addEventListener("click", (element) => {
	// Prévient la soumission.
	element.preventDefault();

	const searchString = searchInput.value;
	app.searchMovies(searchString);
});

resetSearchButton.addEventListener("click", () => {
	app.searchMovies("");
});

////////////////////////////////////////////////////////////////////////////
// TRIAGE
//
// Attache au contrôle du tri un écouteur d'évènement qui transmet sa
// valeur et effectue le tri lorsque celle-ci change.

const sortSelect = document.querySelector("select[name='sort']");
const defaultSort = sortSelect.value;

app.sortMovies(defaultSort);

sortSelect.addEventListener("change", () => {
	app.sortMovies(sortSelect.value);
});

////////////////////////////////////////////////////////////////////////////
// FILTRES
//
// Instancie deux filtres, un pour les réalisateurs et un pour les
// producteurs, et insère ceux-ci dans le formulaire approprié.

const filterFormEl = document.querySelector("#filter");
const directorFilter = app.createFilter("director");
const producerFilter = app.createFilter("producer");

filterFormEl.appendChild(directorFilter);
filterFormEl.appendChild(producerFilter);
