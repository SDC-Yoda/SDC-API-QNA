const controller = require('./controllers/qna.js')
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/loaderio-374a1cdaffdfe05d1a2bb501e9a0b295.txt", (req, res) => (res.send("loaderio-374a1cdaffdfe05d1a2bb501e9a0b295")));

// Q & A - Routes

// get
app.get('/qa/questions', (req, res) => {controller.getQuestions(req, res)});
app.get('/qa/questions/:question_id/answers', (req, res) => {controller.getAnswers(req, res)});
// post
app.post('/qa/questions', (req, res) => {controller.addQuestion(req, res)});
app.post('/qa/questions/:question_id/answers', (req, res) => {controller.addAnswer(req, res)});
// put
app.put('/qa/questions/:question_id/helpful', (req, res) => {controller.helpfulQuestion(req, res)});
app.put('/qa/answers/:answer_id/helpful', (req, res) => {controller.helpfulAnswer(req, res)});
app.put('/qa/answers/:answer_id/report', (req, res) => {controller.report(req, res)});


app.listen(8000, () => {
  console.log('Server listening on 8000');
})
