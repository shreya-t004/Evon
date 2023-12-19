// Open the application form
var edit = false;
function openApplicationForm() {
  document.getElementById("applicationForm").style.display = "block";
  editCheck();
}

// Close the application form
function closeApplicationForm() {
  document.getElementById("applicationForm").style.display = "none";
}

//Form Submission
//add const here
function saveApplication() {
  const name = document.getElementById("name").value;
  const no = document.getElementById("no").value;
  const dob = document.getElementById("dob").value;
  const city = document.getElementById("city").value;
  const event1 = document.getElementById("event1").value;
  const event1pt = document.getElementById("event1pt").value;
  const event2 = document.getElementById("event2").value;
  const event2pt = document.getElementById("event2pt").value;
  const tshirt = document.getElementById("tshirt").value;
  const shorts = document.getElementById("shorts").value;
  const food = document.getElementById("food").value;
  const drinks = document.getElementById("drinks").value;
  const stay = document.getElementById("stay").value;
  const refid = document.getElementById("refid").value;

  if (
    !name ||
    !no ||
    !dob ||
    !event1 ||
    !tshirt ||
    !shorts ||
    !food ||
    !stay ||
    !refid
  ) {
    showAlert("Please fill out all required fields.");
    return;
  }

  const formData = {
    name: name,
    no: no,
    dob: dob,
    city: city,
    event1: event1,
    event1pt: event1pt,
    event2: event2,
    event2pt: event2pt,
    tshirt: tshirt,
    shorts: shorts,
    food: food,
    drinks: drinks,
    stay: stay,
    refid: refid,
  };

  fetch("http://localhost:3000/saveApplication", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Server response:", data);
      edit = data.edit;
      if (data.edit) {
        // Display a confirmation dialog
        const userResponse = confirm(data.message);

        if (userResponse) {
          // User chose to edit, fetch data for editing
          fetch(
            `http://localhost:3000/saveApplication?no=${encodeURIComponent(no)}`
          )
            .then((response) => response.json())
            .then((editData) => {
              // Populate the form with the retrieved data for editing
              populateForm(editData.data);
            })
            .catch((error) =>
              console.error("Error fetching edit data:", error)
            );
        } else {
          //Reload home page if user says no to edit
          location.reload();
        }
      } else {
        // Registration successful
        showAlert("Form submitted successfully!");
        location.reload();
      }
    })

    .catch((error) => {
      console.error("Error:", error);
      showAlert("Error submitting the form. Please try again.");
    });
  //Close the form after submission
  closeApplicationForm();
}

//Populate form
function populateForm(editData) {
  document.getElementById("name").value = editData.name;
  document.getElementById("no").value = editData.no;
  document.getElementById("dob").value = editData.dob;
  document.getElementById("city").value = editData.city;
  document.getElementById("event1").value = editData.event1;
  document.getElementById("event1pt").value = editData.event1pt;
  document.getElementById("event2").value = editData.event2;
  document.getElementById("event2pt").value = editData.event2pt;
  document.getElementById("tshirt").value = editData.tshirt;
  document.getElementById("shorts").value = editData.shorts;
  document.getElementById("food").value = editData.food;
  document.getElementById("drinks").value = editData.drinks;
  document.getElementById("stay").value = editData.stay;
  document.getElementById("refid").value = editData.refid;
  editCheck();
  document.getElementById("applicationForm").style.display = "block";
}

//Update form
function updateData() {
  const name = document.getElementById("name").value;
  const no = document.getElementById("no").value;
  const dob = document.getElementById("dob").value;
  const city = document.getElementById("city").value;
  const event1 = document.getElementById("event1").value;
  const event1pt = document.getElementById("event1pt").value;
  const event2 = document.getElementById("event2").value;
  const event2pt = document.getElementById("event2pt").value;
  const tshirt = document.getElementById("tshirt").value;
  const shorts = document.getElementById("shorts").value;
  const food = document.getElementById("food").value;
  const drinks = document.getElementById("drinks").value;
  const stay = document.getElementById("stay").value;
  const refid = document.getElementById("refid").value;

  if (
    !name ||
    !no ||
    !dob ||
    !event1 ||
    !tshirt ||
    !shorts ||
    !food ||
    !stay ||
    !refid
  ) {
    showAlert("Please fill out all required fields.");
    return;
  }

  fetch("http://localhost:3000/updateData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      showAlert(data.message);
      location.reload();
    })
    .catch((error) => console.error("Error updating data:", error));

  closeApplicationForm();
}

//Manage form edit and submit button
function editCheck() {
  var upd = document.getElementById("update");
  var sub = document.getElementById("submit");

  // Check the value of the variable
  if (!edit) {
    // If showButton is false, hide the button
    upd.style.display = "none";
    sub.style.display = "block";
  } else {
    sub.style.display = "none";
    upd.style.display = "block";
  }
}

function showAlert(message) {
  // Display an alert popup with the specified message
  alert(message);
}

//Admin Section**************************************************************************************************************************
//Open Application form
function openLogin() {
  document.getElementById("Login").style.display = "block";
}

//Close the application form
function closeLogin() {
  document.getElementById("Login").style.display = "none";
}

function validateLogin() {
  //Hardcoded password for Admin Login
  const hardcodedUsername = "admin123";
  const hardcodedPassword = "admin123";
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (pass === hardcodedPassword && user === hardcodedUsername) {
    closeLogin();
    window.location.href = "login.html";
  } else {
    alert("Incorrect password. Please try again.");
  }
}
