const express = require("express");
const textGeneration = require("./openai");

require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`Path ${req.path} with Method ${req.method}`);
  next();
});

app.get("/", (req, res) => {
  return res.send("Welcome to saiyan chat!");
});

app.post("/dialogflow", async (req, res) => {
  let action = req.body.queryResult.action;
  let queryText = req.body.queryResult.queryText;

  console.log({ action, queryText });

  if (action === "input.unknown") {
    let result = await textGeneration(queryText);
    if (result.status == 1) {
      res.send({
        fulfillmentText: result.response,
      });
    } else {
      res.send({
        fulfillmentText: `Sorry, I'm not able to help with that.`,
      });
    }
  } else {
    res.send({
      fulfillmentText: `No handler for the action ${action}.`,
    });
  }
});

const port = process.env.PORT || 9001;

app.listen(port, () => {
  console.log(`Server is up and running at ${port}`);
});
