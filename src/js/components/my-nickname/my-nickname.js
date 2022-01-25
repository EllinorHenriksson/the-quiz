/**
 * The my-nickname web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  input {
    font-size: 16px;
    background-color: #f8f8f8;
    color: #2c3a44;  
    border: 1px solid #2c3a44;
    padding: 5px;
  }

  input:focus {
    border: 2px solid #2c3a44;
    background-color: #f0eb89;
  }

  input[type="submit"] {
    cursor: pointer;
  }

  input[type="submit"]:hover {
    transform: translate(1px, 1px);
  }
</style>

<p>Choose a nickname, then start the quiz!</p>
<form>
  <input type="text" placeholder="Nickname" required>
  <input type="submit" value="Start">
</form>
`

customElements.define('my-nickname',
  /**
   * Represents a my-nickname element.
   */
  class extends HTMLElement {
    /**
     * The textInput element.
     *
     * @type {HTMLInputElement}
     */
    #textInput

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#textInput = this.shadowRoot.querySelector('input[type="text"]')

      this.shadowRoot.querySelector('form').addEventListener('submit', event => {
        event.preventDefault()
        this.#handleSubmit()
      })
    }

    /**
     * Handles the submit event.
     */
    #handleSubmit () {
      this.dispatchEvent(new window.CustomEvent('startQuiz', { detail: { nickname: this.#textInput.value } }))
    }

    /**
     * Sets focus on the textInput element.
     */
    setFocus () {
      this.#textInput.focus()
    }
  }
)
