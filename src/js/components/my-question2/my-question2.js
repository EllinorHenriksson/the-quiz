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

    .answerRadio input[type="radio"] {
        cursor: pointer;
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
    <!-- <label><input type="radio" name="alternative" value="alt1">Alternative 1</label>
    <label><input type="radio" name="alternative" value="alt1">Alternative 1</label>
    <label><input type="radio" name="alternative" value="alt1">Alternative 1</label> -->
    <input type="submit" value="Submit">
  </form>
`

customElements.define('my-question2',
  class extends HTMLElement {
    
    #response

    #question

    #answerText

    #answerRadio

    #submitRadio

    //#label

    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#question = this.shadowRoot.querySelector('.question')
      this.#answerText = this.shadowRoot.querySelector('.answerText')
      this.#answerRadio = this.shadowRoot.querySelector('.answerRadio')
      this.#submitRadio = this.shadowRoot.querySelector('.answerRadio input')

      this.shadowRoot.querySelector('.answerText').addEventListener('submit', event => {
          event.preventDefault()

          this.#handleSubmit()
      })

      this.shadowRoot.querySelector('.answerRadio').addEventListener('submit', event => {
        event.preventDefault()

        this.#handleSubmit()
    })
    }

    startGame () {
      this.#presentQuestion()
    }

    async #presentQuestion (url = 'https://courselab.lnu.se/quiz/question/1') {
      await this.#sendGETRequest(url)
      this.#question.innerText = this.#response.question

      this.#presentAnswer()
    }

    async #sendGETRequest (url) {
      const response = await window.fetch(url)
      this.#response = await response.json()
    }

    #presentAnswer () {
      if (!this.#response.alternatives) {
        this.#answerText.classList.toggle('hidden')
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
          this.#answerRadio.insertBefore(label, this.#submitRadio)
        }

        //this.#label = this.shadowRoot.querySelector('label')
      }
    }

    async #handleSubmit () {
      let answer
      if (!this.#response.alternatives) {
        answer = this.shadowRoot.querySelector('input[type="text"]').value
      } else {
        const checked = this.shadowRoot.querySelector('input[type="radio"]:checked')
        answer = checked.value
      }

      this.#clearWindow()
      const response = await this.#sendPOSTRequest(this.#response.nextURL, answer)
      this.#checkResponse(response)
    }

    #clearWindow () {
      this.#question.innerText = ''
      
      while (this.shadowRoot.querySelector('label')) {
        this.#answerRadio.removeChild(this.shadowRoot.querySelector('label'))
      }
    }

    async #sendPOSTRequest (url, answer) {
      const bodyJS = {
        answer: answer
      }

      const response = await window.fetch(url, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyJS)
      })
    
      return response
    }

    async #checkResponse (response) {
        console.log(response.ok)
      if (response.ok) {
          this.#response = await response.json()
      }
      else {
          // Game over
      }
    }
  }
)
