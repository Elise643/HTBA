document.addEventListener("DOMContentLoaded", () => {
    let fileInput = document.querySelector("#imageUpload > input[type=file]");

    fileInput.addEventListener('change', () => { 
        let image = fileInput.files[0];
        if (image && image.type.startsWith("image/")) {
            document.querySelector("#imageFormRemainder").innerHTML = `
                <div>
                    <label for="characters">Character Tags:</label>
                    <input required name="characters">
                </div>
                <div>
                    <input required type="radio" name="category" value="picrew" id="picrew">
                    <label for="picrew">Picrew</label>
                </div>
                <div>
                    <input required type="radio" name="category" value="other" id="othercat">
                    <label for="othercat">Other</label>
                </div>
                <button type="submit">Upload</button>
            `;

            document.querySelector("#imageUpload").addEventListener("submit", async (event) => {
                event.preventDefault();
                const form = event.target;
                const imageFile = fileInput.files[0];
                const url = await uploadImage(imageFile);

                if (url) {
                    const pictures = window.db.collection("pictures");
                    await pictures.add({
                        imageUrl: url,
                        characterTags: [form.characters.value],
                        imageType: form.category.value,
                        createdAt: new Date()
                    });
                }
            });
        } else {
            document.querySelector("#imageFormRemainder").innerHTML = "";
        }
    });
});

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
