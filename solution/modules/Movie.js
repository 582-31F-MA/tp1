export default class Movie {
	#title;
	#year;
	#director;
	#producer;
	#image;

	/**
	 * Initialise les métadonnées du film selon l'objet reçu.
	 *
	 * @param {Object} movie - Object contenant les métadonnées du film.
	 */
	constructor(movie) {
		this.#title = movie.title;
		this.#year = movie.release_date;
		this.#director = movie.director;
		this.#producer = movie.producer;
		this.#image = movie.image;
		this.description = movie.description;
	}

	/**
	 * Crée et retourne un élément `<article>` qui contient une image et les
	 * métadonnées du film.
	 *
	 * @returns {HTMLElement} - Un élément `<article>`.
	 */
	createArticleEl() {
		const articleEl = document.createElement("article");

		articleEl.innerHTML = `
			<img src="${this.#image}" alt="Poster image for ${this.#title}" />
			<ul>
				<li><h2>${this.#title}</h2></li>
				<li><span>Year released:</span> ${this.#year}</li>
				<li><span>Director:</span> ${this.#director}</li>
				<li><span>Producer(s):</span> ${this.#producer}</li>
			</ul>
		`;

		return articleEl;
	}
}
