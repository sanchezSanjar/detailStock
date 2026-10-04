console.log("Articles frontend javascript file");

document.addEventListener("DOMContentLoaded", () => {
    const board = document.querySelector("[data-article-type]");
    const articleType = board.dataset.articleType;

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

    // show the chosen image before it is uploaded
    function previewImage(input, img) {
        const file = input.files[0];
        if (file) img.src = URL.createObjectURL(file);
    }

    async function errorMessage(response, fallback) {
        try {
            const data = await response.json();
            return data.message || fallback;
        } catch {
            return fallback;
        }
    }

    // CREATE
    const createForm = document.querySelector(".article-create");
    const createFile = createForm.querySelector('input[type="file"]');
    if (createFile) {
        createFile.addEventListener("change", () => previewImage(createFile, createForm.querySelector(".article-image")));
    }

    createForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(createForm);
        formData.append("articleType", articleType);

        try {
            const response = await fetch("/admin/article/create", { method: "POST", body: formData });
            if (!response.ok) throw new Error(await errorMessage(response, "Create failed"));
            window.location.reload();
        } catch (err) {
            console.log("Error creating article:", err);
            showTopAlert(`${err.message}. Please check all fields.`, true);
        }
    });

    // UPDATE & DELETE
    document.querySelectorAll(".article-row").forEach((row) => {
        const articleId = row.dataset.articleId;
        const saveButton = row.querySelector(".article-save");
        const deleteButton = row.querySelector(".article-delete");
        const fields = row.querySelectorAll("[data-field]");
        const fileInput = row.querySelector(".article-file");

        const markChanged = () => {
            saveButton.classList.remove("saved");
            saveButton.classList.add("changed");
            saveButton.textContent = "SAVE";
        };

        fields.forEach((field) => field.addEventListener("input", markChanged));
        if (fileInput) {
            fileInput.addEventListener("change", () => {
                previewImage(fileInput, row.querySelector(".article-image"));
                markChanged();
            });
        }

        saveButton.addEventListener("click", async () => {
            const formData = new FormData();
            fields.forEach((field) => formData.append(field.dataset.field, field.value.trim()));
            if (fileInput && fileInput.files[0]) formData.append("articleImage", fileInput.files[0]);

            try {
                const response = await fetch(`/admin/article/${articleId}`, { method: "POST", body: formData });
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
                console.log("Error saving article:", err);
                showTopAlert("Update failed. Please try again.", true);
            }
        });

        deleteButton.addEventListener("click", async () => {
            const title = row.querySelector('[data-field="articleTitle"]').value;
            if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

            try {
                const response = await fetch(`/admin/article/${articleId}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Delete failed");
                row.remove();
                showTopAlert("Deleted.");
            } catch (err) {
                console.log("Error deleting article:", err);
                showTopAlert("Delete failed. Please try again.", true);
            }
        });
    });
});
