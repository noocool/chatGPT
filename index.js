const express = require("express");
const bodyParser = require("body-parser");
const { dialogflow } = require("actions-on-google");

const textGeneration = require("./openai");

const app = express();
app.use(bodyParser.json());

const dialogflowApp = dialogflow({
  debug: true,
});

dialogflowApp.intent("Default Welcome Intent", (conv) => {
  conv.ask("Hello! What can I help you with today?");
});

dialogflowApp.intent("Question Intent", async (conv, { question }) => {
  // Here, you can perform some logic to answer the question
  let result = await textGeneration(question);
  let answer = "This is the answer to your question";
  if (result.status == 1) {
    answer = result.response;
  } else {
    answer = `Sorry, I'm not able to help with that.`;
  }
  conv.ask(answer);
});

app.post("/webhook", dialogflowApp);

app.listen(process.env.PORT || 3000, () => {
  console.log("Webhook is listening");
});
