let authorLinks = document.querySelectorAll("a");
for (authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}

async function getAuthorInfo() {
    var myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();
    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    let authorHeader = document.querySelector("#authorHeader");
    let authorInfo = document.querySelector("#authorInfo");
    let authorBio = document.querySelector("#authorBio");
    let dob = new Date(data[0].dob);
    let dod = new Date(data[0].dod);
    dob = dob.toLocaleDateString();
    dod = dod.toLocaleDateString();
    authorHeader.innerHTML = `<h1> ${data[0].firstName} ${data[0].lastName} </h1>`
    authorInfo.innerHTML = `<img src="${data[0].portrait}" width="200">`;
    authorInfo.innerHTML += `<div class="columnInfo"><span> <strong>Date of Birth:</strong> ${dob}</span><br>
                                <span> <strong>Date of Death:</strong> ${dod}</span><br>
                                <span> <strong>Gender:</strong> ${data[0].sex}</span><br>
                                <span> <strong>Country of Origin:</strong> ${data[0].country}</span><br>
                                <span> <strong>Profession:</strong> ${data[0].profession}</span></div>`;
    authorBio.innerHTML = `<span> <strong>Bio:</strong> ${data[0].biography}`;

}

function validateLikes(event) {
    let minLikes = document.querySelector("#minLikes").value;
    let maxLikes = document.querySelector("#maxLikes").value;

    let errorMessage = '';

    if (!minLikes || !maxLikes) {
        errorMessage = "Please fill in both 'min' and 'max' fields.";
    } else {
        const min = parseInt(minLikes);
        const max = parseInt(maxLikes);

        if (isNaN(min) || isNaN(max) || min < 0 || max < 0){
            errorMessage = "Please enter valid non-negative numbers for 'min' and 'max'.";
        } else if (min > max) {
            errorMessage = "The 'min' value must be less than or equal to the 'max' value.";
        }
    }

    if (errorMessage) {
        event.preventDefault();
        alert(errorMessage);
        document.querySelector("#minLikes").value = '';
        document.querySelector("#maxLikes").value = '';
        return false;
    }

    return true;
}