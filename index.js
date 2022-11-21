const conn = require('./config');
const cors = require("cors");
const express = require('express');
const app = express();

const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/review", (req, resp) => {
  conn.query("select * from userreview", (err, result) => {
    if (err) { resp.send("error in api") }
    else { resp.send(result) }
  })
});




app.post("/review", (req, resp) => {
  const data = {
    movieName: req.body.movieName,
    movieRating: req.body.movieRating,
    movieReview: req.body.movieReview

  }
  conn.query("INSERT INTO userreview SET?", data, (error, results, fields) => {
    if (error) throw error;
    resp.send(results)
  })
});

app.put("/review/:id", (req, resp) => {
  const data = [req.body.movieName, req.body.movieRating, req.body.movieReview, req.params.id];
  conn.query("UPDATE userreview SET movieName = ?, movieRating = ?, movieReview = ? WHERE id = ?",
    data, (error, results, fields) => {
      if (error) throw error;
      resp.send(results)
    })
})


app.get("/review/:id", (req, resp) => {

  let sql = "select * from userreview where id =" + req.params.id + "";

  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    resp.send(result);
  })

});

app.delete("/review/:id", (req, res) => {

  let sql = "DELETE FROM userreview WHERE id =" + req.params.id + "";

  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  })
})


app.get('/searchMovie?', function (req, res, next) {
  var movieName = req.query.movieName;
  var sql = `SELECT * FROM userreview WHERE movieName LIKE '%${movieName}%'`;
  conn.query(sql, function (error, results, fields) {
    res.send(results);
  });
});


app.post("/userAuth", (req, res) => {

  var email = req.body.email;
  var password = req.body.password;

  var hash = bcrypt.hashSync(password, 10);
  // const bcryptPassword = bcrypt.compareSync(password, hash);

  conn.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
    if (error) {
      res.json({
        status: false,
        message: 'there are some error with query'
      })
    } else {
      if (results.length > 0) {

        bcrypt.compare(password, results[0].password, (error, response) => {
          if (response) {

            res.json({
              status: true,
              data: results,
              message: "Success"
            });

          } else {
            console.log(response);
            res.send({ message: "Wrong email/password combination!" });
          }
        });
      }
      else {
        res.json({
          status: false,
          message: "Email does not exits"
        });
      }
    }
  });

})

app.post("/userReg", (req, res) => {

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  var hash = bcrypt.hashSync(password, saltRounds);

  let sql = "INSERT INTO users (username, email,  password) VALUES (?,?,?)";
    let query = conn.query(sql, [username, email, hash], (error, results) => {
      if (error) {
        res.json({
          data: error,
          status: false,
          message: 'there are some error with query'
        })
      } else {
        res.json({
          status: true,
          data: results,
          message: 'user registered sucessfully'
        })
      }
    });


})


app.listen(5000);