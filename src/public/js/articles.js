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

    // CREATE
    const createForm = document.querySelector(".article-create");
    createForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const articleTitle = createForm.articleTitle.value.trim();
        const articleContent = createForm.articleContent.value.trim();
        if (!articleTitle || !articleContent) return;

        try {
            const response = await fetch("/admin/article/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ articleType, articleTitle, articleContent }),
            });
            if (!response.ok) throw new Error("Create failed");
            window.location.reload();
        } catch (err) {
            console.log("Error creating article:", err);
            showTopAlert("Create failed. Please try again.", true);
        }
    });

    // UPDATE & DELETE
    document.querySelectorAll(".article-row").forEach((row) => {
        const articleId = row.dataset.articleId;
        const saveButton = row.querySelector(".article-save");
        const deleteButton = row.querySelector(".article-delete");
        const fields = row.querySelectorAll("[data-field]");

        fields.forEach((field) => {
            field.addEventListener("input", () => {
                saveButton.classList.remove("saved");
                saveButton.classList.add("changed");
                saveButton.textContent = "SAVE";
            });
        });

        saveButton.addEventListener("click", async () => {
            const data = {};
            fields.forEach((field) => {
                data[field.dataset.field] = field.value.trim();
            });

            try {
                const response = await fetch(`/admin/article/${articleId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
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
