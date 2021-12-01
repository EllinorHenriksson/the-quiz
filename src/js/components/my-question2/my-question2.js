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

    .answerRadio label, .answerRadio input[type="submit"] {
        display: block;
        margin-top: 5px;
        right: 0;
    }

    .answerRadio input[type="submit"] {
        position: absolute;
        right: 0px;
        bottom: 0px;
    }

    .answerRadio {
        position: relative;
    }

    .hidden {
        display: none;
    }
  </style>
  <p class="question"></p>
  <form class="answerText hidden">
    <input type="text" placeholder="Answer">
    <input type="submit" value="Submit">
  </form>
  <form class="answerRadio hidden">
    <label><input type="radio" name="alternative" value="alt1">Alternative 1</label>
    <label><input type="radio" name="alternative" value="alt1">Alternative 1</label>
    <label><input type="radio" name="alternative" value="alt1">Alternative 1</label>
    <input type="submit" value="Submit">
  </form>
`

customElements.define('my-question2',
  class extends HTMLElement {
    
    #response

    #question

    #answerText

    #answerRadio

    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#question = this.shadowRoot.querySelector('.question')
      this.#answerText = this.shadowRoot.querySelector('.answerText')
      this.#answerRadio = this.shadowRoot.querySelector('.answerRadio')
    }

    startGame () {
      this.#presentQuestion()
    }

    async #presentQuestion (url = 'https://courselab.lnu.se/quiz/question/1') {
      await this.#fetchResponse(url)
      this.#question.innerText = this.#response.question

      this.#presentAnswer()
    }

    async #fetchResponse (url) {
      const response = await window.fetch(url)
      this.#response = await response.json()
    }

    #presentAnswer () {
      if (!this.#response.alternatives) {
        this.#answerText.classList.toggle('hidden')
      } else {
        this.#answerRadio.classList.toggle('hidden')
      }
    }
  }
)
