/**
 * The my-nickname web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.1.0
 */

const template = document.createElement('template')
template.innerHTML = `
<label for="nickname">Nickname</label>
<input type="text" id="nickname">
<button type="button">Done</button>
`

customElements.define('my-nickname',
/**
 * Represents a my-nickname element.
 */
  class extends HTMLElement {
    /**
     * The text field element.
     *
     * @type {HTMLInputElement}
     */
    #textField

    /**
     * The button element.
     *
     * @type {HTMLButtonElement}
     */
    #button

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and append the template to the shadow root.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Get the text field element in the shadow root.
      this.#textField = this.shadowRoot.querySelector('input')

      // Get the button element in the shadow root.
      this.#button = this.shadowRoot.querySelector('button')

      this.#button.addEventListener('click', event =>  )
    }
  })

