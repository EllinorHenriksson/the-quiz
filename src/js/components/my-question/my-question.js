/**
 * The my-question web component module.
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

    input[type="submit"], input[type="radio"] {
        cursor: pointer;
    }

    input[type="submit"]:hover {
        transform: translate(1px, 1px);
    }

    .answerRadio {
      display: grid;
      grid-template-columns: max-content auto;
      grid-template-areas: "left right"
    }

    .answerRadio div {
      grid-area: left;
      max-width: 400px;
    }

    .answerRadio label {
        display: block;
        margin-top: 5px;
        word-break: break-all;
    }

    .answerRadio input[type="submit"] {
      display: block;  
      grid-area: right;
      width: max-content;
      height: max-content;
      align-self: end;
      margin-left: 20px;
    }

    .hidden {
        display: none;
    }
  </style>

  <p id="question"></p>
  <form class="answerText hidden">
    <input type="text" placeholder="Answer">
    <input type="submit" value="Submit">
  </form>
  <form class="answerRadio hidden">
    <div></div>
    <input type="submit" value="Submit">
  </form>
`

customElements.define('my-question',
  /**
   * Represents a my-timer element.
   */
  class extends HTMLElement {
    /**
     * The parsed body of the http response.
     *
     * @type {object}
     */
    #response

    /**
     * The time limit for the current question.
     *
     * @type {number}
     */
    #limit

    /**
     * The question element.
     *
     * @type {HTMLParagraphElement}
     */
    #question

    /**
     * The answerText element.
     *
     * @type {HTMLFormElement}
     */
    #answerText

    /**
     * The answerRadio element.
     *
     * @type {HTMLFormElement}
     */
    #answerRadio

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#question = this.shadowRoot.querySelector('#question')
      this.#answerText = this.shadowRoot.querySelector('.answerText')
      this.#answerRadio = this.shadowRoot.querySelector('.answerRadio')

      this.#answerText.addEventListener('submit', event => {
        event.preventDefault()
        this.#handleSubmit()
      })

      this.#answerRadio.addEventListener('submit', event => {
        event.preventDefault()
        this.#handleSubmit()
      })
    }

    /**
     * Fetches and presents the next question and answers.
     *
     * @param {string} [url='https://courselab.lnu.se/quiz/question/1'] - The url of the GET request.
     */
    async nextQuestion (url = 'https://courselab.lnu.se/quiz/question/1') {
      await this.#presentQuestion(url)
      this.#presentAnswer()

      if (this.#response.limit) {
        this.#limit = parseInt(this.#response.limit)
      } else {
        this.#limit = 20
      }
      this.dispatchEvent(new CustomEvent('questionPresented', { detail: { limit: this.#limit } }))
    }

    /**
     * Fetches and presents the next question.
     *
     * @param {string} url - The url of the GET request.
     */
    async #presentQuestion (url) {
      await this.#sendGETRequest(url)
      this.#question.innerText = this.#response.question
    }

    /**
     * Fetches the next question.
     *
     * @param {string} url - The url of the GET request.
     */
    async #sendGETRequest (url) {
      try {
        const response = await window.fetch(url)
        this.#response = await response.json()
      } catch {
        console.log('An error occured.')
        this.dispatchEvent(new CustomEvent('networkError'))
      }
    }

    /**
     * Presents answer alternatives and input fields.
     */
    #presentAnswer () {
      if (!this.#response.alternatives) {
        this.#answerText.classList.toggle('hidden')
        this.shadowRoot.querySelector('input[type="text"]').focus()
      } else {
        this.#answerRadio.classList.toggle('hidden')

        const keys = Object.keys(this.#response.alternatives)
        const values = Object.values(this.#response.alternatives)

        for (let i = 0; i < keys.length; i++) {
          const label = document.createElement('label')
          const input = document.createElement('input')
          input.setAttribute('type', 'radio')
          input.setAttribute('name', 'alternative')
          const key = keys[i]
          input.setAttribute('value', key)
          label.appendChild(input)
          const value = values[i]
          const textNode = document.createTextNode(value)
          label.appendChild(textNode)
          this.#answerRadio.querySelector('div').appendChild(label)
        }

        this.#answerRadio.querySelector('div').firstElementChild.firstElementChild.focus()
      }
    }

    /**
     * Handles the submit event.
     */
    async #handleSubmit () {
      let answer
      if (!this.#response.alternatives) {
        answer = this.shadowRoot.querySelector('input[type="text"]').value
      } else {
        if (this.shadowRoot.querySelector('input[type="radio"]:checked')) {
          answer = this.shadowRoot.querySelector('input[type="radio"]:checked').value
        } else {
          answer = ''
        }
      }

      this.dispatchEvent(new CustomEvent('myQuestionSubmit'))
      this.clearWindow()
      const response = await this.#sendPOSTRequest(this.#response.nextURL, answer)
      this.#checkResponse(response)
    }

    /**
     * Cleares the page from the question and the input value or the answer alternatives.
     */
    clearWindow () {
      this.#question.innerText = ''

      if (!this.#response.alternatives) {
        this.shadowRoot.querySelector('input[type="text"]').value = ''
        this.#answerText.classList.toggle('hidden')
      } else {
        while (this.shadowRoot.querySelector('label')) {
          this.#answerRadio.querySelector('div').removeChild(this.shadowRoot.querySelector('label'))
        }

        this.#answerRadio.classList.toggle('hidden')
      }
    }

    /**
     * Sends the player's answer with a POST request to the given url.
     *
     * @param {string} url - The url of the POST request.
     * @param {string} answer - The answer to the current question.
     * @returns {Response} A Response object.
     */
    async #sendPOSTRequest (url, answer) {
      try {
        const bodyJS = {
          answer: answer
        }

        const response = await window.fetch(url, {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bodyJS)
        })

        return response
      } catch {
        console.log('An error occured.')
        this.dispatchEvent(new CustomEvent('networkError'))
      }
    }

    /**
     * Checks the response to the POST request.
     *
     * @param {Response} response - The Response object.
     */
    async #checkResponse (response) {
      if (response.ok) {
        this.#response = await response.json()
        if (response.status === 200 && this.#response.nextURL) {
          this.nextQuestion(this.#response.nextURL)
        } else if (response.status === 200) {
          this.dispatchEvent(new window.CustomEvent('completeQuiz'))
        }
      } else {
        if (response.status === 400) {
          this.dispatchEvent(new window.CustomEvent('wrongAnswer'))
        } else {
          this.dispatchEvent(new window.CustomEvent('statusNotOK'))
        }
      }
    }
  }
)
