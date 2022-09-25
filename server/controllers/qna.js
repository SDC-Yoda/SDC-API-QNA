const pool = require('../db.js')


module.exports = {
  getQuestions: (req, res) => {
    var key = Object.keys(req.query)[0];
    var id = Object.values(req.query)[0];
    id = Number(id);
    

    const query = {
      text:
      `SELECT
      json_build_object(
      'product_id', product_id,
      'results',(
      SELECT
      array_agg(json_build_object(
      'question_id', questions.id,
      'question_body', questions.body,
      'question_date', questions.date_written,
      'asker_name', questions.asker_name,
      'question_helpfulness', questions.helpful,
      'reported', questions.reported,
      'answers',(
      SELECT
      array_agg(json_build_object(
      'id', answers.id,
      'body', answers.body,
      'date', answers.date_written,
      'answerer_name', answers.answerer_name,
      'helpfulness', answers.helpful,
      'photos',(
      SELECT
      coalesce(array_agg(json_build_object(
      'id', photos.id,
      'url', photos.url
      )), '{}')
      FROM photos
      WHERE photos.answer_id = answers.id
      )
      ))
      FROM answers
      WHERE answers.question_id = questions.id
      )
      ))

      FROM questions
      WHERE questions.product_id = $1
      )
      )
      FROM questions
      WHERE questions.product_id = $1
      FETCH FIRST 1 ROW ONLY;`,
      values: [id],
    }
    pool.query(query)
      .then((response) => {
        if (response.rows[0] === undefined) {
	  return res.status(200).send("no product");
	} else {
	   var final = response.rows[0].json_build_object;
	  return  res.status(200).send(final);
	}
      })
      .catch((err) => {
	console.log('err = ', err);
        res.status(400).send(err);
      })
  },

  getAnswers: (req, res) => {

    var key1 = Object.keys(req.query)[0];
    var key2 = Object.keys(req.query)[1];

    if (key1 === 'page') {
      var page = Object.values(req.query)[0];
    } else if (key2 === 'page') {
      var page = Object.values(req.query)[1];
    } else {
      var page = 1;
    }

    if (key1 === 'count') {
      var count = Object.values(req.query)[0];
    } else if (key2 === 'count') {
      var count = Object.values(req.query)[1];
    } else {
      var count = 5;
    }

    page = Number(page);
    count = Number(count);

    var q_id = Object.values(req.params)[0];
    q_id = Number(q_id);

    const query = {
      text:
      `SELECT
      json_build_object(
      'question', id,
      'page', ${page},
      'count', ${count},
      'results',(
      SELECT
      array_agg(json_build_object(
      'answer_id', answers.id,
      'body', answers.body,
      'date', answers.date_written,
      'answerer_name', answers.answerer_name,
      'helpfulness', answers.helpful,
      'photos',(
      SELECT
      coalesce(array_agg(json_build_object(
      'id', photos.id,
      'url', photos.url
      )), '{}')
      FROM photos
      WHERE photos.answer_id = answers.id
      )
      ))
      FROM answers
      WHERE answers.question_id = questions.id
      )
      )
      FROM questions
      WHERE questions.id = $1
      FETCH FIRST 1 ROW ONLY;`,
      values: [q_id],
    }
    pool.query(query)
      .then((response) => {
        var final = response.rows[0].json_build_object;
        res.status(200).send(final);
      })
      .catch((err) => {
        console.log('err = ', err);
        res.status(400).send(err);
      })
  },

  addQuestion: (req, res) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    var values = [req.body.product_id, req.body.body, today, req.body.name, req.body.email, false, 0];

    const query = {
      text:
      `INSERT INTO questions(product_id, body, date_written, asker_name, asker_email, reported, helpful)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;`,
      values: values,
    }
    pool.query(query)
      .then((result) => {
        res.status(201).send(result.data)
      })
      .catch((err) => {
        console.log('err: ', err);
        res.status(400).send(err);
      })
  },

  addAnswer: (req, res) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    var q_id = Number(req.params.question_id);

    var values = [q_id, req.body.body, today, req.body.name, req.body.email, false, 0];
    var pics = req.body.photos;

    const query = {
      text:
      `INSERT INTO answers(question_id, body, date_written, answerer_name, answerer_email, reported, helpful)
      VALUES($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;`,
      values: values,
    }

    const queryPic = {
      text:
      `INSERT INTO photos(answer_id, url)
      VALUES ((SELECT MAX(id) from answers), '${pics[0]}')
      RETURNING *;`,
    }

    pool.query(query)
      .then((result1) => {
      })
      .then(() => {
        return pool.query(queryPic)
      })
      .then((result2) => {
        res.status(201).send("added answer/photo")
      })
      .catch((err) => {
        console.log('err: ', err);
        res.status(400).send(err);
      })
  },

  helpfulQuestion: (req, res) => {
    var q_id = Object.values(req.params)[0];
    q_id = Number(q_id);

    const query = {
      text:
      `UPDATE questions
      SET helpful = helpful + 1
      WHERE id = $1;`,
      values: [q_id],
    }
    pool.query(query)
      .then((result) => {
        res.status(204).end()
      })
      .catch((err) => {
        console.log('err: ', err);
        res.status(400).send(err);
      })
  },

  helpfulAnswer: (req, res) => {
    var a_id = Object.values(req.params)[0];
    a_id = Number(a_id);

    const query = {
      text:
      `UPDATE answers
      SET helpful = helpful + 1
      WHERE id = $1;`,
      values: [a_id],
    }
    pool.query(query)
      .then((result) => {
        res.status(204).end()
      })
      .catch((err) => {
        console.log('err: ', err);
        res.status(400).send(err);
      })
  },

  report: (req, res) => {
    var a_id = Object.values(req.params)[0];
    a_id = Number(a_id);

    const query = {
      text:
      `UPDATE answers
      SET reported = true
      WHERE id = $1;`,
      values: [a_id],
    }
    pool.query(query)
      .then((result) => {
        res.status(204).end()
      })
      .catch((err) => {
        console.log('err: ', err);
        res.status(400).send(err);
      })
  }

}
