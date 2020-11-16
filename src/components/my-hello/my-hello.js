/**
 * The my-hello web component module.
 *
 * @author // TODO: YOUR NAME <YOUR EMAIL>
 * @version 1.0.0
 */

// Get the URL for the component image.
// /js/components/my-hello/img/mushroom.svg
// This is a Snowpack feature and not implemented in the standard.
// See example of use in CSS
import mushroom from './img/mushroom.svg'

/**
 * Define template.
 */
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .message-board {
      font-size: 1.2em;
      color:white;
      background-color: #333;
      padding: 1em;
      margin: 1em;
      background-image: url(${mushroom});
      background-repeat: no-repeat;
      background-position: right center;
    }
  </style>
  <div class="message-board">
  </div>
`

/**
 * Define custom element.
 */
customElements.define('my-hello',
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and
      // append the template to the shadow root.
      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      // Get the message board element in the shadow root.
      this._messageBoard = this.shadowRoot.querySelector('.message-board')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['message']
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (!this.hasAttribute('message')) {
        this.setAttribute('message', 'A simple hello from a web component.')
      }

      this._upgradeProperty('message')
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {*} oldValue - The old value.
     * @param {*} newValue - The new value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'message') {
        this._messageBoard.textContent = newValue
      }
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
    }

    /**
     * Run the specified instance property
     * through the class setter.
     *
     * @param {string} prop - The property's name.
     */
    _upgradeProperty (prop) {
      if (Object.hasOwnProperty.call(this, prop)) {
        const value = this[prop]
        delete this[prop]
        this[prop] = value
      }
    }

    /**
     * Gets the message.
     *
     * @returns {string} The message value.
     */
    get message () {
      return this.getAttribute('message')
    }

    /**
     * Sets the message.
     *
     * @param {string} value - The message.
     */
    set message (value) {
      if (this.message !== value) {
        this.setAttribute('message', value)
      }
    }

    /**
     * Cleans the message board.
     */
    clean () {
      this._messageBoard.textContent = ''
    }
  }
)
