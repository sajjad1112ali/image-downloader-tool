const baseURL = "http://127.0.0.1:4000";
function isValidInput(input, type) {
  const validValues = {
    imagesCount: 1,
    dimensions: 150,
  }
  return input !== '' && parseFloat(input) >= validValues[type];
}

function validateInput(){
  const imagesCount = $("#imagesCount").val();
  const height = $("#height").val();
  const width = $("#width").val();
  if ((!isValidInput(imagesCount, "imagesCount") || !(parseFloat(imagesCount) <=100)) || !isValidInput(height, "dimensions") || !isValidInput(width, "dimensions")) return false
  return {
    imagesCount,
    height,
    width,
  };
}

function  saveLocally(folderName) {
  $("#message").text("Preparing for downloading...")
  const data = { folderName }
  const requestOptions = getRequestOptions(data)

  fetch(`${baseURL}/save-locally`, requestOptions)
  .then((response) => response.json())
  .then((result) => {
    const folderName = result.downloaded;
    const dirName = folderName.substring(8, folderName.length);
    $("#downloadImages").attr("href", `${baseURL}/${dirName}/package`).click();
    $("#downloadImages")[0].click();
    $('#configurationForm').trigger("reset");
    if (result.success) $("#successMessage").removeClass('d-none');
    $("#submitBtn").attr("disabled", false)
    $("#message").text("Images downloaded successfully...")
    setTimeout(() => {
    $("#message").text("")
      
    }, 2500);

  })
  .catch((error) => console.log("error", error));
}

function getRequestOptions (data) {

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify(data);

  return {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

}
$("#configurationForm").submit(function (event) {
  event.preventDefault();
  if (!validateInput()) {
    alert("Kindly provide valid input");
    return false;
  }
  $("#submitBtn").attr("disabled", true)
  $("#message").text("Downloading your images...")
  let posting = {
    imagesCount: $("#imagesCount").val(),
    height: $("#height").val(),
    width: $("#width").val(),
  };
  const requestOptions = getRequestOptions(posting)

  fetch(`${baseURL}/download-images`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      saveLocally(result.downloaded)
    })
    .catch((error) => console.log("error", error));
});
