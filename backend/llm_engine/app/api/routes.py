import os
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "llm-engine")))
from fastapi import APIRouter, UploadFile, File
import os
# import uuid
from llm_engine.app.services.csv_analyzer import analyze_csv
from llm_engine.app.services.prompt_generator import build_insight_prompt
from llm_engine.app.core.llm_client import call_llm

router = APIRouter()

@router.post("/generate-insights")
async def generate_insights(file: UploadFile = File(...)):
    file_ext = file.filename.split('.')[-1]
    temp_filename = f"uploads/{uuid.uuid4()}.{file_ext}"

    with open(temp_filename, "wb") as f:
        f.write(await file.read())

    csv_info = analyze_csv(temp_filename)
    prompt = build_insight_prompt(csv_info)
    llm_output = call_llm(prompt)

    return {"suggestions": llm_output}
 