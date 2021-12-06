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
    <div>1. Ellen, 10s</div>
    <div>2. Rebecca, 15s</div>
    <div>3. Ida, 17s</div>
    <div>4. Sofia, 20s</div>
    <div>5. Nina, 25s</div>
</div>
`

customElements.define('my-high-score',
  class extends HTMLElement {
    
    //Längden på listan
    #length
    
    #nickname

    #totalTime

    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
    }

    static get observedAttributes () {
      return ['length']
    }

    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'length' && newValue !== oldValue) {
        this.#length = parseInt(newValue)
        console.log(this.#length)
      }
    }

    //data är tänkt representera ett objekt med användarens nickname (string) och tid i sekunder (number)
    saveHighScore (data) {
      this.#nickname = data.nickname
      this.#totalTime = data.totalTime

      let result
      if (!window.localStorage.getItem('quiz-result')) {
        result = [{ user: this.#nickname, score: this.#totalTime }]
        window.localStorage.setItem('quiz-result', JSON.stringify(result))
      } else {
        result = JSON.parse(window.localStorage.getItem('quiz-result'))
        result.push({ user: this.#nickname, score: this.#totalTime })
        window.localStorage.setItem('quiz-result', JSON.stringify(result))
      }
    }

    showHighScore () {
      const result = JSON.parse(window.localStorage.getItem('quiz-result'))
      
    }
})
