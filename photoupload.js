document.addEventListener("DOMContentLoaded", () => {
    let fileInput = document.querySelector("#imageUpload > input[type=file]");

    fileInput.addEventListener('change', (event) => { 
        let image = fileInput.files[0];
        if (image && image.type.startsWith("image/")){
            document.querySelector("#imageFormRemainder").innerHTML = `
            <div>
            <label for="characters">Character Tags:</label>
            <input name = "characters">
            </div>
            <div><input type="radio" name="category" value="picrew" id="picrew">
            <label for="picrew">Picrew</label></div>
            <div><input type="radio" name="category" value="other" id="othercat">
            <label for="othercat">Other</label></div>
            <button value="submit">Upload</button>
            `
        }
        else {
            document.querySelector("#imageFormRemainder").innerHTML = "";
        }
    });
});