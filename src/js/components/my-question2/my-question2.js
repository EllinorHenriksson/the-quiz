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

    .answerRadio input[type="radio"] {
        cursor: pointer;
    }

    .answerRadio input[type="submit"] {
      display: block;  
      grid-area: right;
      width: max-content;
      height: max-content;
      padding: 5px;
      align-self: end;
      margin-left: 20px;
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
    <div></div>
    <input type="submit" value="Submit">
  </form>
`

customElements.define('my-question2',
  class extends HTMLElement {
    
    #response

    #question

    #answerText

    //#submitText

    #answerRadio

    #submitRadio

    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#question = this.shadowRoot.querySelector('.question')
      this.#answerText = this.shadowRoot.querySelector('.answerText')
      //this.#submitText = this.shadowRoot.querySelector('.answerText input[type="submit"]')
      this.#answerRadio = this.shadowRoot.querySelector('.answerRadio')
      this.#submitRadio = this.shadowRoot.querySelector('.answerRadio input[type="submit"]')

      this.#answerText.addEventListener('submit', event => {
        event.preventDefault()
        this.#handleSubmit()
      })

      this.#answerRadio.addEventListener('submit', event => {
        event.preventDefault()
        this.#handleSubmit()
      })
    }

    async nextQuestion (url = 'https://courselab.lnu.se/quiz/question/1') {
      await this.#presentQuestion(url)
      this.#presentAnswer()
    }

    async #presentQuestion (url) {
      await this.#sendGETRequest(url)
      this.#question.innerText = this.#response.question
    }

    async #sendGETRequest (url) {
      const response = await window.fetch(url)
      this.#response = await response.json()
    }

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

    async #handleSubmit () {
      let answer
      if (!this.#response.alternatives) {
        answer = this.shadowRoot.querySelector('input[type="text"]').value
      } else {
        answer = this.shadowRoot.querySelector('input[type="radio"]:checked').value
      }

      this.#clearWindow()
      const response = await this.#sendPOSTRequest(this.#response.nextURL, answer)
      this.#checkResponse(response)
    }

    #clearWindow () {
      this.#question.innerText = ''

      this.shadowRoot.querySelector('input[type="text"]').value = ''
      
      while (this.shadowRoot.querySelector('label')) {
        this.#answerRadio.querySelector('div').removeChild(this.shadowRoot.querySelector('label'))
      }

      if (!this.#response.alternatives) {
        this.#answerText.classList.toggle('hidden')
      } else {
        this.#answerRadio.classList.toggle('hidden')
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
      if (response.ok) {
          this.#response = await response.json()
          if (this.#response.nextURL) {
            // Ladda nästa fråga
            this.nextQuestion(this.#response.nextURL)
          } else {
            // Quiz completed
            // Save time, save time and nickname in web storage
            // Show high score
            // Gör ovanstående genom att skicka custom event till my-quiz-app med {detail: {stopTime: 00:00}}. I my-quiz-app sparas stopTime undan i en privat egenskap. Byt ut content från div question till en div med en text (om att användaren klarade quizet) och en my-highscore.
            this.dispatchEvent(new window.CustomEvent('completeQuiz'))
          }
      }
      else {
          // Game over
          // Show highscore
          // Gör ovanstående genom att skicka ett custom event till my-quiz-app. Byt ut content från div question (glöm inte att stoppa timern i my-timer!) till en div med en text (Wrong answer - Game over!) och en my-highscore.
          this.dispatchEvent(new window.CustomEvent('gameOver', { detail: { cause: 'wrong answer' } }))
      }
    }
  }
)
