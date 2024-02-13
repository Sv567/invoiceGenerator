const currentDate = new Date();
const invnumber = Math.floor(100000 + Math.random() * 900000);
const formattedDate = currentDate.toISOString().split("T")[0];

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("curnDate").innerHTML =
    document.getElementById("curnDate").innerHTML + " : " + formattedDate;

  document.getElementById("invoiceNum").innerHTML =
    document.getElementById("invoiceNum").innerHTML + invnumber;

  const datePicker = document.getElementById("datePicker");
  datePicker.addEventListener("click", function() {
    this.focus();
  });
});

function addItem() {
  const table = document
    .getElementById("billTable")
    .getElementsByTagName("tbody")[0];
  const newRow = table.insertRow(table.rows.length);
  const cells = [];

  for (let i = 0 ; i < 4 ; i++) {
    cells.push(newRow.insertCell(i));
  }

  cells[0].innerHTML = 
  '<input type="text" id="itemName" placeholder="Item Name"><br/><inputtype="text" id="itemDesc" placeholder="Item Description">';
  cells[1].innerHTML = '<input type="number" min="1" value="1">';
  cells[2].innerHTML = '<input type="number" min="1.00" step="0.01" value="0.00">';
  cells[3].innerHTML = '<button  id = "btn" onclick="deleteItem(this)" > X </button>';

  calculate();
}

function deleteItem(button) {
  const actionBtn = button.parentNode.parentNode;
  actionBtn.parentNode.removeChild(actionBtn);
  calculate();
}
function calculate() {
  const table = document
    .getElementById("billTable")
    .getElementsByTagName("tbody")[0];
  const rows = table.getElementsByTagName("tr");

  let quantity = 0;
  let totalAmount = 0;

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    const qtyInput = cells[1].getElementsByTagName("input")[0];
    const priceInput = cells[2].getElementsByTagName("input")[0];

    const qty = parseFloat(qtyInput.value);
    const price = parseFloat(priceInput.value);

    quantity += qty;
    totalAmount += qty * price;

    qtyInput.removeEventListener("input", calculate);
    priceInput.removeEventListener("input", calculate);

    qtyInput.addEventListener("input", calculate);
    priceInput.addEventListener("input", calculate);
  }

  document.getElementById("quantity").innerText = quantity;
  document.getElementById("totalAmount").innerText = totalAmount.toFixed(2);
}

function reviewInvoice(event) {
  if (event) {
    event.preventDefault();
  }

  openModal();
}

document
  .getElementById("reviewInvoiceButton")
  .addEventListener("click", reviewInvoice);

function openModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

function viewBill() {

  const billContent = generateBillContent();
  toggleVisibility("billContent");
  hideOtherContent("billContent");

  const billContentContainer = document.getElementById("billContent");
  billContentContainer.innerHTML = "";
  const fieldset = document.createElement("fieldset");
  
  fieldset.style.padding = '10px';
  fieldset.style.borderRadius = '8px';

  document.getElementById("billContent").appendChild(fieldset);

  fieldset.innerHTML += billContent;

  document.getElementById("billContent").style.display = "block";
  document.getElementById("qrcode").style.display = "none";
}

function generateBillContent() {
  const billDetails = `
    <strong>Invoice Details:</strong>
    <br/>
    Date: ${formattedDate}
    <br/>
    Due Date: <span style="color: red;">${document.getElementById("datePicker").value}</span>
    <br/>
    Invoice Number: ${invnumber}
    <br/>

    <strong>Bill Contact Details:</strong>
    <br/>
    Bill To:
    <br/>
      Name: ${document.getElementById("billToName").value}<br/>
      Email: ${document.getElementById("billToEmail").value}<br/>
      Address: ${document.getElementById("billToAddress").value}<br/>

    Bill From:<br/>
      Name: ${document.getElementById("billFromName").value}<br/>
      Email: ${document.getElementById("billFromEmail").value}<br/>
      Address: ${document.getElementById("billFromAddress").value}<br/>

    <strong>Bill Details:</strong><br/>
    Total Items: ${document.getElementById("quantity").innerText}<br/>
    Total Amount: ₹ ${document.getElementById("totalAmount").innerText}<br/>

    <strong>Notes:</strong><br/>
    ${document.getElementById("notes").value}<br/>
    `;

  return billDetails;
}


function downloadBill() {
  const downloadContent = generateDownloadContent();
  toggleVisibility("downloadContent");
  hideOtherContent("downloadContent");
  document.getElementById("downloadContent").innerHTML =
    "Downloading ...";
  document.getElementById("downloadContent").style.display = "block";
  generatePDFWithHtml2pdf();
}

function generatePDFWithHtml2pdf() {
  const content = document.getElementById("card1");
  html2pdf(content).from(content);
}

function generateDownloadContent() {
  const downloadDetails = `
  Invoice Details:
  Date: ${formattedDate}
  Due Date: ${document.getElementById("datePicker").value}
  Invoice Number: ${invnumber}

  Bill Contact Details:
  Bill To:
    Name: ${document.getElementById("billToName").value}
    Email: ${document.getElementById("billToEmail").value}
    Address: ${document.getElementById("billToAddress").value}

  Bill From:
    Name: ${document.getElementById("billFromName").value}
    Email: ${document.getElementById("billFromEmail").value}
    Address: ${document.getElementById("billFromAddress").value}

  Bill Details:
  Total Items: ${document.getElementById("quantity").innerText}
  Total Amount: ₹ ${document.getElementById("totalAmount").innerText}

  Notes:
  ${document.getElementById("notes").value}`;

  return downloadDetails;
}



function toggleVisibility(contentId) {
  const contentDivs = ["billContent", "downloadContent", "qrCodeContent"];

  for (const divId of contentDivs) {
    const div = document.getElementById(divId);
    if (divId === contentId) {
      div.style.display = "block";
    } else {
      div.style.display = "none";
    }
  }
}

function hideOtherContent(currentContentId) {
  const contentDivs = ["billContent", "downloadContent", "qrCodeContent"];

  for (const divId of contentDivs) {
    if (divId !== currentContentId) {
      document.getElementById(divId).style.display = "none";
    }
  }
}