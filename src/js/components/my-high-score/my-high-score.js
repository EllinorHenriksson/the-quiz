/**
 * The my-high-score web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #container {
        background-color: #f8f8f8;
        width: 200px;
        border: 2px dotted #2c3a44;
    }

    #container div {
        border-bottom: 1px dotted #2c3a44;
        padding: 10px;
        margin: 0;
        text-align: left;
    }

    :host {
        display: inline-block;
    }
</style>

<div id="container">
</div>
`

customElements.define('my-high-score',
  /**
   * Represents a my-high-score element.
   */
  class extends HTMLElement {
    /**
     * The length of the list.
     *
     * @type {number}
     */
    #length

    /**
     * The container element.
     *
     * @type {HTMLDivElement}
     */
    #container

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#container = this.shadowRoot.querySelector('#container')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['length']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {string} oldValue - The old attribute value.
     * @param {string} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'length' && newValue !== oldValue) {
        this.#length = parseInt(newValue)
        this.#createList()
      }
    }

    /**
     * Creates a high score list and updates it if there are any saved results.
     */
    #createList () {
      this.#container.innerHTML = ''

      for (let i = 0; i < this.#length; i++) {
        const div = document.createElement('div')
        div.setAttribute('id', `${i + 1}`)
        div.textContent = `${i + 1}.`
        this.#container.appendChild(div)
      }

      if (window.localStorage.getItem('quiz-result')) {
        this.#updateHighScore()
      }
    }

    /**
     * Saves the result of the current quiz round in the local web storage.
     *
     * @param {object} data - The player's nickname and total time (s).
     */
    saveResult (data) {
      let result
      if (!window.localStorage.getItem('quiz-result')) {
        result = [{ user: data.nickname, score: data.totalTime }]
        window.localStorage.setItem('quiz-result', JSON.stringify(result))
      } else {
        result = JSON.parse(window.localStorage.getItem('quiz-result'))
        result.push({ user: data.nickname, score: data.totalTime })
        window.localStorage.setItem('quiz-result', JSON.stringify(result))
      }

      this.#updateHighScore()
    }

    /**
     * Updates the high score list so that it presents the five fastest players.
     */
    #updateHighScore () {
      const result = JSON.parse(window.localStorage.getItem('quiz-result'))
      result.sort((a, b) => a.score - b.score)

      for (let i = 0; i < result.length; i++) {
        this.shadowRoot.getElementById(`${i + 1}`).textContent = `${i + 1}. ${result[i].user}, ${result[i].score}s`
      }
    }

    /**
     * Checks if there are any saved results and creates an empty list if not.
     */
    checkStorage () {
      if (!window.localStorage.getItem('quiz-result')) {
        this.#createList()
      }
    }
  }
)
