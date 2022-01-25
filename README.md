# The quiz

## Introduction

In this assignment, you will use asynchronous communication to create a quiz application. All questions are served to your application using HTTP in a [RESTful](https://en.wikipedia.org/wiki/Representational_state_transfer) way, and your application should send the users answers back to the server for validation.

The backend (server-side code) of this assignment is given and already published online, and your assignment is to write the client-side code that communicates against that server.

Please make sure to read the additional requirements in the issues linked in the text below. (#1, #2, #3 ...)

## The assignment

You should create a single page (#11) client application in which the user can answer quiz questions by the server given. The user must do this within a specific time frame. If the user provides the correct answer, the application should present the next question to the user. If the user provides the wrong answer or does not answer in time, the quiz is over, and a high score list is presented to the user.

You are responsible for presenting the questions (retrieved from the server), handling the client application logic, and the user interface. The user shouldn't have any problem understanding the UI. Keep it simple and keep it beautiful.

At the start of the game, the user should write a nickname they want in the quiz game (#1). The game must have a timer that gives the user a maximum of 20 seconds to answer each question (#2). If the user doesn't answer during the time or provides a false answer, the game is over, and the user should be able to start over.

If the user answers all of the questions correctly, the game should save that user:s total time (#3) and present it in a high-score list showing the five quickest tries. The high score will be saved in the browser's Web Storage. (#4)

### The questions and answers

The questions will be public to the client application through a RESTful Web API. The first question (starting point of the application) is at the URL:
[https://courselab.lnu.se/quiz/question/1]('https://courselab.lnu.se/quiz/question/1')

The response of the API will tell you what kind of question you should show to the user and where to send the answers. In other words, you have to analyze the response from the server to know how to display the questions and how to send new requests for answering the questions. Hyperlinks are provided by the server response in a RESTful way. The server responses will also give clues about what HTTP methods to use and how to send the answers back.

The server will put out two different types of questions. Simple text questions and questions with alternatives where the user should answer with the right key "alt1", "alt2" etc. You can watch the server responses and decide what is what. Questions with alternatives should be presented with HTML radio buttons. The user should not need to write anything at these questions.  (#5)

The last question answered will not return a new link to a new question, which means that the quiz is over.

## Non functional requirements

The client application must be written in vanilla javascript (#6) using the provided code style (#7). The application should be well documented. The application is comfortable for the end-user to understand and use (#10).

## A proposed composition (#9) (optional)

You are free to create the application in any way you like as long as you follow the requirements. However, it can be helpful to build the application using web components. Here we present a proposed composition of web components. Of course, you are free to use or extend this composition or create your own. This is just an example.

![Dependency Graph](https://gitlab.lnu.se/1dv025/templates/assignment-b2-the-quiz/-/raw/main/.readme/dependency-graph.svg)

This composition is further explained in #9.

## Hints

Before you start writing code think about:

* How to present the question the user should answer?
* How to get the answer from the user and how to send it back to the server? [Postman](https://www.postman.com/) is a great tool if you want to play around with HTTP calls and do tests without writing code.
* Be sure to tell the server that the POST-request is a "application/json"-request by setting the "Content-type" of the HTTP-header (check [the XMLHttpRequest object](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) and setRequestHeader or [fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API))
* Decide if you want to use XMLHttpRequest or the Fetch API. Fetch API is recommended.
* The API (Server part) will make use of HTTP. Use the correct verb (POST or GET), headers and look at the status codes. (200, 400...)
