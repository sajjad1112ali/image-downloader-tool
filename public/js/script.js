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
  if (!isValidInput(imagesCount, "imagesCount") || !isValidInput(height, "dimensions") || !isValidInput(width, "dimensions")) return false
  return {
    imagesCount,
    height,
    width,
  };
}
$("#configurationForm").submit(function (event) {
  event.preventDefault();
  if (!validateInput()) {
    alert("Kindly provide valid input");
    return false;
  }
  $("#submitBtn").attr("disabled", true)

  let posting = {
    imagesCount: $("#imagesCount").val(),
    height: $("#height").val(),
    width: $("#width").val(),
  };

  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify(posting);

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };
  fetch("http://127.0.0.1:4000/download-images", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const folderName = result.downloaded;
      const dirName = folderName.substring(8, folderName.length);

      $("#downloadImages").attr("href", `http://127.0.0.1:4000/${dirName}/package`).click();
      $("#downloadImages")[0].click();

      $('#configurationForm').trigger("reset");
      if (result.success) $("#successMessage").removeClass('d-none');
      $("#submitBtn").attr("disabled", false)
    })
    .catch((error) => console.log("error", error));
});
