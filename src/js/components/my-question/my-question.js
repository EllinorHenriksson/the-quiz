/**
 * The my-hello web component module.
 *
 * @author // TODO: YOUR NAME <YOUR EMAIL>
 * @version 1.1.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
  <style>
  </style>
  <div class="quizQuestion">
      <h2 class="question"></h2>
      <form class="answerForm"></form>
  </div>
`

customElements.define('my-question',
  /**
   * Represents a my-hello element.
   */
  class extends HTMLElement {
    #nextURL = 'https://courselab.lnu.se/quiz/question/1'
    
    #form
     /**
      * Creates an instance of the current type.
      */
     constructor () {
       super()

       // Attach a shadow DOM tree to this element and
       // append the template to the shadow root.
       this.attachShadow({ mode: 'open' })
         .appendChild(template.content.cloneNode(true))

         this.#form = this.shadowRoot.querySelector('.answerForm')

         this.#form.addEventListener('submit', event => this.#handleSubmit(event))
     }

     #handleSubmit (event) {
        event.preventDefault()

        console.log('Hej hej')
     }

     async #getQuestion () {
         const result = await window.fetch(this.#nextURL)
         const resultJson = result.json()
         this.#nextURL = resultJson.nextURL
         return resultJson
     }

     async presentQuestion () {
        
        const question = await this.#getQuestion()
        this.shadowRoot.querySelector('.question').innerText = question.question

        if (question.limit) {
            this.#presentAnswerTextfield(question)
        } else if (question.alternatives) {
           // this.#presentAnswerRadioButton(question)
        }
     }

     #presentAnswerTextfield (question) {
         const textfield = document.createElement('input')
         textfield.type = 'text'
         textfield.setAttribute('maxlength', question.limit)
         const submit = document.createElement('input')
         submit.type = 'submit'
         submit.value = 'Submit'
         this.#form.appendChild(textfield)
         this.#form.appendChild(submit)
     }
  }
)
