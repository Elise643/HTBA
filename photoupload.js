document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.querySelector("#imageUpload > input[type=file]");
    const imageUploadForm = document.querySelector("#imageUpload");
    const remainder = document.querySelector("#imageFormRemainder");

    // Handle file selection
    fileInput.addEventListener("change", () => {
        const image = fileInput.files[0];

        if (image && image.type.startsWith("image/")) {
            remainder.innerHTML = `
                <div>
                    <label for="characters">Character Tags (Separate by commas if multiple):</label>
                    <input required name="characters" placeholder="e.g. Con, Serina">
                </div>
                <div>
                    <input required type="radio" name="category" value="Picrew" id="picrew">
                    <label for="picrew">Picrew</label>
                </div>
                <div>
                    <input required type="radio" name="category" value="Other" id="othercat">
                    <label for="othercat">Other</label>
                </div>
                <button type="submit">Upload</button>
            `;
        } else {
            remainder.innerHTML = "";
        }
    });

    // Handle form submit (only bound once)
    imageUploadForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const imageFile = fileInput.files[0];
        if (!imageFile) {
            alert("Please select an image first.");
            return;
        }

        const url = await uploadImage(imageFile);
        if (!url) return;

        const chars = imageUploadForm.characters?.value.trim();
        const cat = imageUploadForm.category?.value;

        if (chars && cat) {
            // Reset form
            imageUploadForm.reset();
            remainder.innerHTML = "";

            // Store to DB
            const pictures = window.db.collection("pictures");
            await pictures.add({
                imageUrl: url,
                characterTags: chars.split(",").map(tag => tag.trim()),
                imageType: cat,
                createdAt: new Date()
            });

            console.log("Upload success:", { url, chars, cat });
        } else {
            alert("Please fill in all required fields before uploading.");
        }
    });
});

// Image upload with Cloudinary → fallback Imgur
async function uploadImage(image) {
    try {
        const cloudinaryData = new FormData();
        cloudinaryData.append("file", image);
        cloudinaryData.append("upload_preset", "htba-preset");

        const cloudinaryRes = await fetch("https://api.cloudinary.com/v1_1/dnl9rrcr5/image/upload", {
            method: "POST",
            body: cloudinaryData,
        });

        if (cloudinaryRes.ok) {
            const cloudinaryJson = await cloudinaryRes.json();
            return cloudinaryJson.secure_url;
        } else {
            throw new Error("Cloudinary upload failed");
        }
    } catch (err) {
        console.warn("Cloudinary failed, trying Imgur...");
        try {
            const imgurData = new FormData();
            imgurData.append("image", image);

            const imgurRes = await fetch("https://api.imgur.com/3/image", {
                method: "POST",
                headers: {
                    Authorization: "Client-ID 37b62003f061f9b"
                },
                body: imgurData
            });

            if (!imgurRes.ok) throw new Error("Imgur upload failed");

            const imgurJson = await imgurRes.json();
            console.warn("Hosted on Imgur rather than Cloudinary.");
            return imgurJson.data.link;
        } catch (e) {
            console.error("Both uploads failed:", e);
            alert("Image upload failed. Try again (or tell Elise something's wrong lol)");
        }
    }
}
