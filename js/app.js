document.addEventListener("DOMContentLoaded", () => {
    const bugForm = document.getElementById("bug-form");
    const bugsContainer = document.getElementById("bugs-container");
    const userCookie = document.cookie;
    if (!userCookie.includes("username")) {
        let username = ''
        while (username === '' || username === null || username.length > 50) {
            username = prompt("Bitte geben Sie Ihren Username ein: (max 50 Zeichen)").trim();
        }
        document.cookie = `username=${username}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; SameSite=Strict`;
    }
    document.getElementById("username").innerText = document.cookie.split("=")[1];

    bugForm.addEventListener("input", event => {
        if (event.target.id === "description") {
            if (bugForm.description.value.trim() === "") {
                document.getElementById("description-error").innerText = "Bitte geben Sie eine Beschreibung ein.";
            } else {
                document.getElementById("description-error").innerText = "";
            }
        }
        if (event.target.id === "severity") {
            if (!bugForm.severity.value) {
                document.getElementById("severity-error").innerText = "Bitte wählen Sie einen Schweregrad aus.";
            } else if ((bugForm.severity.value < 1 || bugForm.severity.value > 5)) {
                document.getElementById("severity-error").innerText = "Der Schweregrad muss zwischen 1 und 5 liegen.";
            } else {
                document.getElementById("severity-error").innerText = "";
            }
        }
        if (event.target.id === "date") {
            if (!bugForm.date.value) {
                document.getElementById("date-error").innerText = "Bitte geben Sie ein Datum ein.";
            } else {
                document.getElementById("date-error").innerText = "";
            }
        }
    })

    bugForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!confirm("Sind die eingegebenen Daten korrekt? \n" + "Beschreibung: " + bugForm.description.value + "\n" + "Schweregrad: " + bugForm.severity.value + "\n" + "Datum: " + bugForm.date.value)) {
            return;
        }

        const formData = new FormData(bugForm);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch("backend.php?action=addBug", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "addBug", ...data }),
            });
            const result = await response.json();
            if (response.status === 200) {
                alert(result.message);
                loadBugs();
                bugForm.reset();
            } else {
                console.error("Error adding bug:", result);
                alert(result.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    });

    async function loadBugs() {
        try {
            const response = await fetch("backend.php?action=getBugs");
            const bugs = await response.json();
            bugsContainer.innerHTML = bugs.map(bug => `
                <div class="bug">
                    <p><strong>Beschreibung:</strong> ${bug.description}</p>
                    <p><strong>Schweregrad:</strong> ${bug.severity}</p>
                    <p>Gemeldet von ${bug.username}</p>
                    <p>${bug.date}</p>
                </div>
            `).join("");
        } catch (error) {
            console.error("Error loading bugs:", error);
        }
    }

    function drawLogo() {
        const canvas = document.getElementById("logoCanvas");
        const ctx = canvas.getContext("2d");

        // Body
        ctx.fillStyle = "#4CAF50";
        ctx.beginPath();
        ctx.arc(150, 150, 50, 0, Math.PI * 2);
        ctx.fill();

        // Legs
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 4;
        for (let i = 0; i < 3; i++) {
            // Left legs
            ctx.beginPath();
            ctx.moveTo(100, 170 - i * 20);
            ctx.lineTo(60, 140 - i * 20);
            ctx.stroke();

            // Right legs
            ctx.beginPath();
            ctx.moveTo(200, 170 - i * 20);
            ctx.lineTo(240, 140 - i * 20);
            ctx.stroke();
        }

        // Head
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(150, 80, 20, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(140, 75, 5, 0, Math.PI * 2);
        ctx.arc(160, 75, 5, 0, Math.PI * 2);
        ctx.fill();
    }

    loadBugs();
    drawLogo();
});
