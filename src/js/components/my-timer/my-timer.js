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
  class extends HTMLElement {

    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
    }
})
