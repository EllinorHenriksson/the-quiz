/**
 * The my-timer web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #timer {
        background-color: #f8f8f8;
        border-radius: 10px;
        text-align: left;
        border: 1px #2c3a44 solid;
        padding: 0.5rem;
        width: max-content;
        height: max-content;
        display: inline-block;
    }
    #time {
        font-weight: bold;
        font-size: 20px;
        margin: 0;
        display: inline;
    }

    #description {
        margin-top: 5px;
    }

    #container {
        text-align: center;
        width: max-content;
        height: max-content;
    }

</style>

<div id="container">
    <div id="timer">
        <p id="time">00:00</p>
    </div>
    <p id="description">Countdown &#8987;</p>
</div>
`

customElements.define('my-timer',
  /**
   * Represents a my-timer element.
   */
  class extends HTMLElement {
    /**
     * The time limit of the question.
     *
     * @type {number}
     */
    #limit

    /**
     * The count of the timer.
     *
     * @type {number}
     */
    #count

    /**
     * The interval ID for the timer.
     *
     * @type {number}
     */
    #timer

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['limit']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {string} oldValue - The old attribute value.
     * @param {string} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'limit' && newValue !== oldValue) {
        this.#limit = parseInt(newValue)
      }
    }

    /**
     * Starts the timer.
     */
    startTimer () {
      this.#count = this.#limit
      this.#changeDisplay()

      this.#timer = window.setInterval(() => {
        this.#count--
        this.#changeDisplay()

        if (this.#count === 0) {
          this.stopTimer()
          this.dispatchEvent(new CustomEvent('timeout'))
        }
      }, 1000)
    }

    /**
     * Changes the presentation of the timer according to the current time.
     */
    #changeDisplay () {
      let currentTime

      if (this.#count < 10) {
        currentTime = `00:0${this.#count}`
      } else {
        currentTime = `00:${this.#count}`
      }

      const newTimeTextNode = document.createTextNode(currentTime)
      const oldTextNode = this.shadowRoot.querySelector('#time').firstChild
      this.shadowRoot.querySelector('#time').replaceChild(newTimeTextNode, oldTextNode)
    }

    /**
     * Stops the timer.
     */
    stopTimer () {
      window.clearInterval(this.#timer)
    }
  }
)
