const template = document.createElement('template')
template.innerHTML = `
<style>
    #container {
        background-color: #f8f8f8;
        width: 200px;
        border: 2px dotted #2c3a44;
    }

    #container div {
        border-bottom: 1px dotted #2c3a44;
        padding: 10px;
        margin: 0;
    }

    :host {
        display: inline-block;
    }
</style>
<div>
<div id="container">
</div>
`

customElements.define('my-high-score',
  class extends HTMLElement {

    //Längden på listan
    #length

    #container

    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#container = this.shadowRoot.querySelector('#container')
    }

    static get observedAttributes () {
      return ['length']
    }

    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'length' && newValue !== oldValue) {
        this.#length = parseInt(newValue)
        //window.localStorage.removeItem('quiz-result')
        this.#createList()
      }
    }

    #createList () {
      this.#container.innerHTML = ''

      for (let i = 0; i < this.#length; i++) {
        const div = document.createElement('div')
        div.setAttribute('id', `${i + 1}`)
        this.#container.appendChild(div)
      }

      if (window.localStorage.getItem('quiz-result')) {
        this.#updateHighScore()
      }
    }

    // data är tänkt representera ett objekt med användarens nickname (string) och tid i sekunder (number)
    saveResult (data) {
      let result

      if (!window.localStorage.getItem('quiz-result')) {
        result = [{ user: data.nickname, score: data.totalTime }]
        window.localStorage.setItem('quiz-result', JSON.stringify(result))
      } else {
        result = JSON.parse(window.localStorage.getItem('quiz-result'))
        result.push({ user: data.nickname, score: data.totalTime })
        window.localStorage.setItem('quiz-result', JSON.stringify(result))
      }

      this.#updateHighScore()
    }

    #updateHighScore () {
      const result = JSON.parse(window.localStorage.getItem('quiz-result'))
      result.sort((a, b) => a.score - b.score)

      for (let i = 0; i < this.#length; i++) {
        this.shadowRoot.getElementById(`${i + 1}`).textContent = `${i + 1}. ${result[i].user}, ${result[i].score}s`
      }
    }
})
