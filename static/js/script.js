
// PROMPTCRAFT AI - GEMINI CONNECTION

const userIdea = document.getElementById("userIdea");
const category = document.getElementById("category");
const level = document.getElementById("level");

const generateBtn = document.getElementById("generateBtn");
const result = document.getElementById("result");
const copyBtn = document.getElementById("copyBtn");

// GENERATE PROMPT USING GEMINI AI

generateBtn.addEventListener("click", async function () {

    const idea = userIdea.value.trim();

    if (idea === "") {
        result.textContent = "Please enter your idea first!";
        userIdea.focus();
        return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent = "✨ Gemini is thinking...";
    result.textContent = "Generating your AI prompt...";

    try {

        const response = await fetch("/generate-prompt", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                idea: idea,
                category: category.value,
                level: level.value
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Something went wrong.");
        }

        result.textContent = data.prompt;

    } catch (error) {

        result.textContent = "Error: " + error.message;

    } finally {

        generateBtn.disabled = false;
        generateBtn.textContent = "✨ Generate Prompt";

    }

});


// COPY GENERATED PROMPT

copyBtn.addEventListener("click", async function () {

    const promptText = result.textContent;

    if (
        !promptText ||
        promptText === "Your prompt will appear here..." ||
        promptText.startsWith("Generating") ||
        promptText.startsWith("Error:")
    ) {
        alert("Please generate a prompt first!");
        return;
    }

    try {

        await navigator.clipboard.writeText(promptText);

        copyBtn.textContent = "Copied! ✓";

        setTimeout(function () {
            copyBtn.textContent = "Copy Prompt";
        }, 2000);

    } catch (error) {

        alert("Unable to copy the prompt.");

    }

});
