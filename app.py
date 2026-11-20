from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from google import genai
from google.genai import types
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

app = Flask(__name__)

api_key = os.getenv("GEMINI_API_KEY")
print("Gemini API key loaded:", bool(api_key))

client = genai.Client(api_key=api_key) if api_key else None


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate-prompt", methods=["POST"])
def generate_prompt():
    try:
        data = request.get_json(silent=True) or {}
        idea = data.get("idea", "").strip()
        category = data.get("category", "General")
        level = data.get("level", "Beginner")

        if not idea:
            return jsonify({"error": "Please enter your idea."}), 400

        if not client:
            return jsonify({"error": "Gemini API key is missing."}), 500

        system_instruction = (
            "You are an expert AI Prompt Engineer. Create a professional, detailed, "
            "clear, and ready-to-copy AI prompt that includes: "
            "1. AI Role, 2. Task Description, 3. Relevant Context, "
            "4. Step-by-step Instructions, 5. Expected Output Format, "
            "6. Important Guidelines."
        )

        user_prompt = f"User Idea: {idea}\nCategory: {category}\nDifficulty Level: {level}"

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction
            )
        )

        return jsonify({"prompt": response.text})

    except Exception as error:
        print("Gemini Error:", error)
        return jsonify({"error": str(error)}), 500


if __name__ == "__main__":
    app.run(debug=True)
