const API_KEY = "V8NoPwvUe-q-vz1iXjPPsceKkT8";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));



function processOption(form) {

    let optArray = [];

    for (let e of form.entries()) {
        if (e[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    form.delete("options");

    form.append("options", optArray.join());

    return form;

}

async function postForm(e) {
    const form = processOption(new FormData(getElementById("checksform")));

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }

}

function displayErrors(data) {

    let results = "";

    let heading = `JSHint Results for ${data.file}`;

    if (data.total_erroes === 0) {
        results = `<div class="no_erroes">No errores reported</div>`
    } else {
        results = `<div>Total errors: <span class="error_count">${data.total_errors}</span>`
        for (let error of data.errors_list) {
            results += `<div> At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    } 

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();
    

}

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayStatus(data) {

    let headingText = "API Key Status";
    let bodyText = `<div>Your key is valid until</div>`;
    bodyText += `<div class="key-status">${data.expiry}</div>`;

    document.getElementById("resultsModalTitle").innerText = headingText;
    document.getElementById("results-content").innerHTML = bodyText;
    resultsModal.show();

}

function displayException(data) {

    let heading = `An exception orccured`;
    results = `<div>The API returned status code ${data.status_code}</div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;
    resultsModal.show();

}