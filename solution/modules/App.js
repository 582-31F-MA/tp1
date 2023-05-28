import Movie from "./Movie.js";
import Filter from "./Filter.js";

export default class App {
	#data;
	#displayTarget;
	#filters;
	#currentView;

	/**
	 *
	 * @param {Array} data - Jeu de données à afficher.
	 * @param {HTMLElement} displayTarget - Élément dans lequel afficher le jeu
	 * de donnés.
	 */
	constructor(data, displayTarget) {
		this.#data = data;
		this.#displayTarget = displayTarget;
		this.#filters = {};
	}

	////////////////////////////////////////////////////////////////////////////
	// AFFICHAGE

	/**
	 * Instancie un nouvel object `Movie` pour chaque films du jeu des données,
	 * et ajoute ceux-ci dans l'élément désiré.
	 *
	 * @param {Array} movies - Tableau contenant les objects `Movie` à afficher.
	 */
	displayMovies(movies = this.#data) {
		const ul = document.createElement("ul");

		for (const movie of movies) {
			const movieObj = new Movie(movie);
			const movieArticleEl = movieObj.createArticleEl();

			const li = document.createElement("li");
			li.appendChild(movieArticleEl);

			ul.appendChild(movieArticleEl);
		}

		// Il est préférable de tout ajouter les `<article>` d'un coup plutôt
		// que un à un pour éviter de repeindre la page en boucle.
		this.#displayTarget.replaceChildren(ul);
	}

	////////////////////////////////////////////////////////////////////////////
	// VUES

	/**
	 * Supprime de l'élément où est affiché le jeu de données la classe associée
	 * à la vue courante, et ajoute la classe associée à la nouvelle vue
	 * désirée.
	 *
	 * @param {"grid" | "list"} newView - Nouvelle vue à appliquer à l'affichage
	 * des films.
	 */
	setView(newView) {
		this.#displayTarget.classList.remove(this.#currentView);
		this.#displayTarget.classList.add(newView);

		this.#currentView = newView;
	}

	////////////////////////////////////////////////////////////////////////////
	// RECHERCHE

	/**
	 * Filtre le tableau `#data` contenant les object `Movie` selon la chaîne
	 * reçue, et affiche le résultat. La chaîne reçue ainsi que la valeur des
	 * propriétés ciblées sont converties en bas de casse.
	 *
	 * @param {String} searchString - Chaîne selon laquelle filter les films
	 * affichés.
	 */
	searchMovies(searchString) {
		const formattedSearchString = searchString.toLowerCase().trim();

		const results = this.#data.filter(
			(movie) =>
				movie.title.toLowerCase().includes(formattedSearchString) ||
				movie.director.toLowerCase().includes(formattedSearchString) ||
				movie.producer.toLowerCase().includes(formattedSearchString) ||
				movie.release_date.toString().includes(formattedSearchString)
		);

		this.displayMovies(results);
	}

	////////////////////////////////////////////////////////////////////////////
	// TRIER

	/**
	 * Trie le tableau `#data` selon le critère reçu, et affiche le résultat.
	 *
	 * @param {"titleAsc" | "titleDesc" | "yearAsc" | "yearDesc"} order - Ordre
	 * selon lequel trier le tableau `#data`.
	 */
	sortMovies(order) {
		let results;

		switch (order) {
			case "titleAsc":
				results = this.#data.sort((movieA, movieB) =>
					movieA.title.localeCompare(movieB.title)
				);
				break;
			case "titleDesc":
				results = this.#data.sort((movieA, movieB) =>
					movieB.title.localeCompare(movieA.title)
				);
				break;
			case "yearAsc":
				results = this.#data.sort(
					(movieA, movieB) =>
						Number(movieA.release_date) -
						Number(movieB.release_date)
				);
				break;
			case "yearDesc":
				results = this.#data.sort(
					(movieA, movieB) =>
						Number(movieB.release_date) -
						Number(movieA.release_date)
				);
				break;
		}

		this.displayMovies(results);
	}

	////////////////////////////////////////////////////////////////////////////
	// FILTER

	/**
	 * Crée un nouveau filtre correspondant à la propriété donnée, et y ajoute
	 * dynamiquement les options selon le jeu de données. Crée également un
	 * objet `filter` dans lequel est stockées les options présentement
	 * appliquées. Les options appliquées sont mises à jour lorsque l'état de
	 * l'un des contrôles change.
	 *
	 * @param {String} propertyName - Une des propriétés des valeurs du jeu de
	 * données selon laquelle filtrer les films.
	 *
	 * @returns {HTMLElement} Un `<fieldset>` contenant le nom du filtre et les
	 * options de celui-ci.
	 */
	createFilter(propertyName) {
		const filter = new Filter(this.#data, propertyName);
		const filterEl = filter.createFilterEl();

		// Met à jour l'état de `App` lorsqu'une des options du filtre est mis à
		// jour, et appelle la méthode pour le filtrage.
		filterEl.addEventListener("updated", () => {
			this.#filters[filter.name] = filter.appliedOptions;

			const optionsAreApplied = !Object.values(this.#filters).every(
				(filter) => filter.length === 0
			);

			if (!optionsAreApplied) {
				this.displayMovies();
			} else {
				this.#filterMovies();
			}
		});

		return filterEl;
	}

	/**
	 * Filtre le tableau `_data` selon les options présentement sélectionnées,
	 * et affiche le résultat.
	 */
	#filterMovies() {
		let results = new Set();

		for (const filterName in this.#filters) {
			const appliedOptions = this.#filters[filterName];

			const filteredMovies = this.#data.filter((movie) =>
				appliedOptions.includes(movie[filterName])
			);

			for (const movie of filteredMovies) {
				results.add(movie);
			}
		}

		// `results` est un Set. Il doit être transformé en array pour être
		// ensuite manipulé par les autres méthodes (`filter()`, par
		// exemple, ne fonctionne pas sur un Set).
		results = Array.from(results);

		this.displayMovies(results);
	}
}
