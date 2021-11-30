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
    #nextURL

    #questionHasAlternatives
    
    #form

    #question
     /**
      * Creates an instance of the current type.
      */
     constructor () {
       super()

       // Attach a shadow DOM tree to this element and
       // append the template to the shadow root.
       this.attachShadow({ mode: 'open' })
         .appendChild(template.content.cloneNode(true))

         this.#nextURL = 'https://courselab.lnu.se/quiz/question/1'

         this.#form = this.shadowRoot.querySelector('.answerForm')

         this.#question = this.shadowRoot.querySelector('.question')

         this.#form.addEventListener('submit', event => this.#handleSubmit(event))
     }

     get nextURL () {
         return this.#nextURL
     }

     set nextURL (value) {
         this.#nextURL = value
     }

     async #handleSubmit (event) {
        event.preventDefault()

        console.log('Hej hej')
        let answer
        if (this.#questionHasAlternatives) {
            // To do
        } else {
            answer = this.shadowRoot.querySelector('input[type="text"]').value
        }

        const response = await this.#postAnswer(answer)
        this.#checkResponse(response)
     }

     #checkResponse (response) {
         console.log(response.status)

         if (response.ok) {
             response.json().then(data => {
                 this.nextURL = data.nextURL
                console.log(data.nextURL)
                this.#clearPreviousQuestion()
             this.presentQuestion()
                })
             
         } else {
             console.log('Game Over')
         }
     }

     #clearPreviousQuestion () {
        this.#question.removeChild(this.#question.firstChild)
        while (this.#form.firstChild) {
            this.#form.removeChild(this.#form.firstChild)
        }
     }

     async #postAnswer (answer) {
         console.log(this.#nextURL)
         const answerBody = {'answer': answer}
         const result = await window.fetch(this.#nextURL, {
             method: 'post',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify(answerBody)
         })

         return result
     }

     async #getQuestion () {
        console.log(this.#nextURL)
         const result = await window.fetch(this.#nextURL)
         
         return result.json()
     }

     async presentQuestion () {
        
        
        const question = await this.#getQuestion()
        this.nextURL = question.nextURL
        console.log(this.#nextURL)
        this.shadowRoot.querySelector('.question').innerText = question.question

        if (question.limit) {
            this.#presentAnswerTextfield(question)
            this.#questionHasAlternatives = false
        } else if (question.alternatives) {
            this.#questionHasAlternatives = true
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
