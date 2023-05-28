export default class Filter {
	#data;
	#name;
	#appliedOptions;
	#options;

	/**
	 * Crée un nouveau filtre correspondant à la propriété donnée, et y ajoute
	 * dynamiquement les options selon le jeu de données. Les options appliquées
	 * `appliedOptions` sont mises à jour lorsque l'état de l'un des contrôles
	 * change. Un évènement synthétique `update` est diffusé lorsque
	 * `appliedOptions` change.
	 *
	 * @param {Array} data - Jeu de données selon lequel peupler les options du
	 * filtre.
	 * @param {String} propertyName - Propriété selon laquelle filtrer les films
	 * (director, producer, year_produced, etc.)
	 */
	constructor(data, propertyName) {
		this.#data = data;
		this.#name = propertyName;
		this.#options = new Set();
		this.#appliedOptions = [];
	}

	get appliedOptions() {
		return this.#appliedOptions;
	}

	get name() {
		return this.#name;
	}

	createFilterEl() {
		// Pour chaque film du jeu de données, peuple les `options` du filtre
		// selon les valeurs du nom de la propriété donné.
		for (const movie of this.#data) {
			this.#options.add(movie[this.#name]);
		}

		// Fieldset
		const fieldsetEl = document.createElement("fieldset");

		// Legend
		const legendEl = document.createElement("legend");
		legendEl.innerText = `Filter by ${this.#name}`;
		fieldsetEl.appendChild(legendEl);

		// Inputs
		for (const option of this.#options) {
			// Label
			const labelEl = document.createElement("label");
			fieldsetEl.appendChild(labelEl);
			const labelText = document.createTextNode(option);
			labelEl.appendChild(labelText);

			// Input
			const inputEl = document.createElement("input");
			inputEl.setAttribute("type", "checkbox");
			inputEl.setAttribute("name", this.#name);
			inputEl.setAttribute("value", option);
			labelEl.prepend(inputEl);

			// Attache un écouteur d'évènement à chacun des contrôles associés
			// aux options de filtrage. Lorsque l'état du contrôleur change, met
			// à jour la propriété `#appliedOptions`.
			inputEl.addEventListener("change", () => {
				if (inputEl.checked) {
					this.#appliedOptions.push(inputEl.value);
				} else {
					this.#appliedOptions = this.#appliedOptions.filter(
						(filter) => filter !== inputEl.value
					);
				}

				// Une fois `#appliedOptions` à jour, crée et diffuse un
				// évènement synthétique `updated`. De cette façon, `App` peut
				// écouter cet évènement, et mettre à jour son tableau de tous
				// les filtres.
				const event = new Event("updated", { bubbles: true });
				inputEl.dispatchEvent(event);
			});
		}

		return fieldsetEl;
	}
}
