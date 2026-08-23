console.log("Products frontend javascript file");

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       TOP ALERT BANNER
    ========================== */

    function showTopAlert(message, isError = false) {
        let banner = document.getElementById("top-alert-banner");

        if (!banner) {
            banner = document.createElement("div");
            banner.id = "top-alert-banner";
            document.body.prepend(banner);
        }

        banner.textContent = message;
        banner.className = isError ? "top-alert error show" : "top-alert show";

        setTimeout(() => {
            banner.classList.remove("show");
        }, 2500);
    }


    /* =========================
       IMAGE PREVIEW (create form)
    ========================== */

    const imageInputs = document.querySelectorAll(".image-upload input[type='file']");

    imageInputs.forEach((input) => {
        input.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const validTypes = ["image/jpg", "image/jpeg", "image/png"];
            if (!validTypes.includes(file.type)) {
                alert("Please upload only JPG, JPEG or PNG images.");
                input.value = "";
                return;
            }

            const uploadBox = input.closest(".image-upload");
            const reader = new FileReader();

            reader.onload = (e) => {
                uploadBox.style.backgroundImage = `url("${e.target.result}")`;
                uploadBox.style.backgroundSize = "cover";
                uploadBox.style.backgroundPosition = "center";

                const plus = uploadBox.querySelector("span");
                if (plus) plus.style.display = "none";
            };

            reader.readAsDataURL(file);
        });
    });


    /* =========================
       INLINE TABLE EDITING — SAVE
    ========================== */

    const productRows = document.querySelectorAll(".product-row");

    productRows.forEach((row) => {

        const saveButton = row.querySelector(".product-save");
        const fields = row.querySelectorAll("[data-field]");

        fields.forEach((field) => {
            field.addEventListener("input", () => {
                saveButton.classList.remove("saved");
                saveButton.classList.add("changed");
                saveButton.textContent = "SAVE";
            });

            field.addEventListener("change", () => {
                saveButton.classList.remove("saved");
                saveButton.classList.add("changed");
                saveButton.textContent = "SAVE";
            });
        });

        saveButton.addEventListener("click", async () => {

            const productId = saveButton.dataset.productId;

            const productData = {};
            fields.forEach((field) => {
                productData[field.dataset.field] = field.value;
            });

            try {
                const response = await fetch(`/admin/product/${productId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(productData),
                });

                if (!response.ok) throw new Error("Update failed");

                saveButton.classList.remove("changed");
                saveButton.classList.add("saved");
                saveButton.textContent = "SAVED";

                showTopAlert("Successfully updated!");

                setTimeout(() => {
                    saveButton.classList.remove("saved");
                    saveButton.textContent = "SAVE";
                }, 1500);

            } catch (err) {
                console.log("Error saving product:", err);
                showTopAlert("Update failed. Please try again.", true);
            }
        });
    });

});