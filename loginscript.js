//document.addEventListener("DOMContentLoaded", function () {
// Function to make an HTTP request

async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Function to update data on the server
async function updateData(url, updatedData) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

// Function to populate the table with data
async function populateTable() {
  const dataTable = document.getElementById("dataTable");
  const filterValue = document.getElementById("filter").value;

  const data = await fetchData(
    `http://localhost:3000/api/data?filter=${filterValue}`
  );

  //dataTable.innerHTML = ""; // Clear existing table data
  while (dataTable.rows.length > 1) {
    dataTable.deleteRow(1);
  }

  data.forEach((item) => {
    const row = dataTable.insertRow();
    row.insertCell(0).textContent = item.name;
    row.insertCell(1).textContent = item.no;
    row.insertCell(2).textContent = item.event;
    row.insertCell(3).textContent = item.eventpt;
    row.insertCell(4).textContent = item.ranks;

    const inputCell = row.insertCell(5);
    const input = document.createElement("input");
    input.type = "number";
    input.value = item.rank;
    inputCell.appendChild(input);
  });

  const totalRowsElement = document.getElementById("totalRows");
  totalRowsElement.textContent = `Total Participants: ${
    dataTable.rows.length - 1
  }`;
}

// Function to filter data and update the table
window.filterData = function () {
  populateTable();
};

// Function to get input values, update data, and refresh the table
document
  .getElementById("updateButton")
  .addEventListener("click", async function () {
    const inputElements = document.querySelectorAll("#dataTable input");
    const updatedData = [];

    inputElements.forEach((input) => {
      const no = input.closest("tr").cells[1].textContent;
      const rank = input.value;
      const event = input.closest("tr").cells[2].textContent;
      updatedData.push({ no, rank, event });
    });

    // Remove entries with undefined rank values
    const filteredUpdatedData = updatedData.filter(
      (item) => item.rank !== "" && !isNaN(item.rank)
    );

    await updateData("http://localhost:3000/api/update", filteredUpdatedData);
    populateTable();
  });

// Initial population of the table
populateTable();
//});

function logout() {
  window.location.href = "index.html";
}
