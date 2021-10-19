/**
 * The my-hello web component module.
 *
 * @author // TODO: YOUR NAME <YOUR EMAIL>
 * @version 1.1.0
 */

// Get the URL for the component image.
// See example of use in CSS.
const MUSHROOM_IMG_URL = (new URL('./images/mushroom.svg', import.meta.url)).href

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
    .bulletin-board {
      font-size: 1.2em;
      color:white;
      background-color: #333;
      padding: 1em;
      margin: 1em;
      background-image: url(${MUSHROOM_IMG_URL});
      background-repeat: no-repeat;
      background-position: right center;
    }
  </style>
  <div class="bulletin-board">
  </div>
`

customElements.define('my-hello',
  /**
   * Represents a my-hello element.
   */
  class extends HTMLElement {
    /**
     * The bulletin board element.
     *
     * @type {HTMLDivElement}
     */
     #bulletinBoard

     /**
      * Creates an instance of the current type.
      */
     constructor () {
       super()

       // Attach a shadow DOM tree to this element and
       // append the template to the shadow root.
       this.attachShadow({ mode: 'open' })
         .appendChild(template.content.cloneNode(true))

       // Get the bulletin board element in the shadow root.
       this.#bulletinBoard = this.shadowRoot.querySelector('.bulletin-board')
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

       this.#upgradeProperty('message')
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
         this.#bulletinBoard.textContent = newValue
       }
     }

     //  /**
     //   * Called after the element has been removed from the DOM.
     //   */
     //  disconnectedCallback () {
     //  }

    /**
     * Run the specified instance property
     * through the class setter.
     *
     * @param {string} prop - The property's name.
     */
    #upgradeProperty (prop) {
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
     * Cleans the bulletin board.
     */
    clean () {
      this.#bulletinBoard.textContent = ''
    }
  }
)
