import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "llm-engine")))

from app.services.csv_analyzer import analyze_csv
from app.services.prompt_generator import build_insight_prompt
from app.core.llm_client import call_llm


def test(csv_path):
    print("Analysing the CSV file")
    csv_info = analyze_csv(csv_path)
    prompt = build_insight_prompt(csv_info)
    print("\n🧠 Prompt Sent to LLM:\n", prompt)

    response = call_llm(prompt)
    print("\n📊 Suggested Prompts from LLM:\n", response)

if __name__ == "__main__":
    test(r"S:\LumiaAI\project\backend\training_data\healthcare_dataset.csv")

 