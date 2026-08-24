console.log("Users frontend javascript file");

document.addEventListener("DOMContentLoaded", () => {

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

    const userRows = document.querySelectorAll(".user-row");

    userRows.forEach((row) => {

        const saveButton = row.querySelector(".user-save");
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

            const userId = saveButton.dataset.userId;

            const userData = { _id: userId };
            fields.forEach((field) => {
                userData[field.dataset.field] = field.value;
            });

            try {
                const response = await fetch("/admin/user/edit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(userData),
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
                console.log("Error saving user:", err);
                showTopAlert("Update failed. Please try again.", true);
            }
        });
    });

        const deleteButtons = document.querySelectorAll(".user-delete");

deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
        const userId = button.dataset.userId;
        const row = button.closest(".user-row");
        const name = row.querySelector('[data-field="memberNick"]').value;

        if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;

        try {
            const response = await fetch(`/admin/user/${userId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Delete failed");

            row.remove();
            showTopAlert("User deleted.");

        } catch (err) {
            console.log("Error deleting user:", err);
            showTopAlert("Delete failed. Please try again.", true);
        }
    });
});

});