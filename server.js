const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//MySQL database connection configuration
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "shreya424",
  database: "evon",
};
const db = mysql.createConnection(dbConfig);

//Create a MySQL pool
const pool = mysql.createPool(dbConfig);

//Static files access
app.use(express.static(__dirname));

var oldnum = "";

//form submissions
app.post("/saveApplication", (req, res) => {
  // Process the form data
  const formData = req.body;
  console.log("Form Data:", formData);

  // Saving form data to MySQL database
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      res.status(500).json({ message: "Internal Server Error." });
      return;
    }

    //add the updation query with respect to the value of edit using if else

    const checkDuplicateQuery = "SELECT * From attendee WHERE no = ?";
    connection.query(
      checkDuplicateQuery,
      [formData.no],
      (queryErr, results) => {
        connection.release();

        if (queryErr) {
          console.error("Error checking duplicate entry:", queryErr);
          res.status(500).json({ message: "Internal Server Error." });
          return;
        }

        if (results.length > 0) {
          // Registration with this number already exists
          oldnum = formData.no;
          res.json({
            message:
              "Registration with this number is already done. Do you want to edit?",
            edit: true,
          });
        } else {
          //Database initial entry query
          const sql =
            "INSERT INTO attendee (name, no, dob, city, event1, event1pt, event2, event2pt, tshirt, shorts,food, drinks,stay,refid) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?,?,?,?,?)";
          connection.query(
            sql,
            [
              formData.name,
              formData.no,
              formData.dob,
              formData.city,
              formData.event1,
              formData.event1pt,
              formData.event2,
              formData.event2pt,
              formData.tshirt,
              formData.shorts,
              formData.food,
              formData.drinks,
              formData.stay,
              formData.refid,
            ],
            (queryErr) => {
              connection.release();

              if (queryErr) {
                console.error("Error saving form data to MySQL:", queryErr);
                res.status(500).json({ message: "Internal Server Error." });
              } else {
                res.json({ message: "Form submitted successfully." });
              }
            }
          );
          const ev1 =
            "INSERT INTO ranking (name, no, event, eventpt) VALUES (?, ?, ?, ?)";
          connection.query(
            ev1,
            [formData.name, formData.no, formData.event1, formData.event1pt],
            (Err) => {
              connection.release();

              if (Err) {
                console.error(
                  "Error saving form data to ranks table MySQL:",
                  Err
                );
              }
            }
          );
          if (formData.event2) {
            const ev2 =
              "INSERT INTO ranking (name, no, event, eventpt) VALUES (?, ?, ?, ?)";
            connection.query(
              ev1,
              [formData.name, formData.no, formData.event2, formData.event2pt],
              (Err) => {
                connection.release();

                if (Err) {
                  console.error(
                    "Error saving form data to ranks table MySQL:",
                    Err
                  );
                }
              }
            );
          }
        }
      }
    );
  });
});

app.get("/saveApplication", (req, res) => {
  const no = req.query.no;

  // Fetch data for the provided whatsapp number from the database
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      res.status(500).json({ message: "Internal Server Error." });
      return;
    }

    const fetchDataQuery = "SELECT * FROM attendee WHERE no = ?";
    connection.query(fetchDataQuery, [no], (queryErr, results) => {
      connection.release();

      if (queryErr) {
        console.error("Error fetching data for editing:", queryErr);
        res.status(500).json({ message: "Internal Server Error." });
        return;
      }

      if (results.length > 0) {
        res.json({ data: results[0] });
      } else {
        res.status(404).json({ message: "Data not found for editing." });
      }
    });
  });
});

//updating data**********************************************************************************************

app.use(express.json());

//Handle updates in form submission
app.post("/updateData", (req, res) => {
  try {
    const {
      name,
      no,
      dob,
      city,
      event1,
      event1pt,
      event2,
      event2pt,
      tshirt,
      shorts,
      food,
      drinks,
      stay,
      refid,
    } = req.body;

    //SQL update query
    const x = pool.execute(
      "UPDATE attendee SET name = ?, dob=?, city=?, event1=?, event1pt=?, event2=?, event2pt=?, tshirt=?, shorts=?, food=?, drinks=?, stay=?, refid=? WHERE no = ?",
      [
        name,
        dob,
        city,
        event1,
        event1pt,
        event2,
        event2pt,
        tshirt,
        shorts,
        food,
        drinks,
        stay,
        refid,
        no,
      ]
    );
    const del = pool.execute("DELETE FROM ranking WHERE no=?", [no]);
    const ev1 = pool.execute(
      "INSERT INTO ranking (name, no, event, eventpt) VALUES (?, ?, ?, ?)",
      [name, no, event1, event1pt]
    );
    if (event2) {
      const ev2 = pool.execute(
        "INSERT INTO ranking (name, no, event, eventpt) VALUES (?, ?, ?, ?)",
        [name, no, event2, event2pt]
      );
    }

    res.json({ success: true, message: "Update successful", edit: false });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

//Admin login side**********************************************************************************************************************
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// Populate ranks table with data and handle rank update
app.get("/api/data", (req, res) => {
  const filterValue = req.query.filter || "all";
  let filterCondition = "";

  switch (filterValue) {
    case "75":
      filterCondition = 'WHERE event="75+ Combined"';
      break;
    case "90":
      filterCondition = 'WHERE event="90+ Combined"';
      break;
    case "105":
      filterCondition = 'WHERE event="105+ Combined"';
      break;
    case "120":
      filterCondition = 'WHERE event="120+ Combined"';
      break;
    default:
      break;
  }

  const query = `SELECT * FROM ranking ${filterCondition}`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data from database:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

//Update specific/all ranks
app.post("/api/update", (req, res) => {
  const updatedData = req.body;

  if (!Array.isArray(updatedData) || updatedData.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid data format or empty array" });
  }

  const updateQueries = updatedData.map((item) => {
    if (isNaN(item.rank)) {
      return null; // Ignore entries with non-numeric rank values
    }

    return `UPDATE ranking SET ranks = ${item.rank} WHERE (no = "${item.no}" AND event="${item.event}")`;
  });

  // Remove null entries (entries with non-numeric rank values)
  const validUpdateQueries = updateQueries.filter((query) => query !== null);

  if (validUpdateQueries.length === 0) {
    return res.status(400).json({ error: "No valid rank values provided" });
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting database transaction:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      validUpdateQueries.forEach((query) => {
        db.query(query, (err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error updating data in the database:", err);
              res.status(500).json({ error: "Internal Server Error" });
            });
          }
        });
      });

      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error committing database transaction:", err);
            res.status(500).json({ error: "Internal Server Error" });
          });
        }
        console.log("Data updated successfully");
        res.json({ message: "Data updated successfully" });
      });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
