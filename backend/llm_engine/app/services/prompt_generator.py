import json

def build_insight_prompt(csv_info):
    return f"""
You are a professional data visualization assistant integrated into an AI dashboard tool.

A CSV file has been uploaded containing **{csv_info['num_rows']} rows** and **{csv_info['num_columns']} columns**.
Here are the column names:
{', '.join(csv_info['columns'])}

Sample data (first 3 rows):
{json.dumps(csv_info['sample_rows'], indent=2)}

---

🎯 Your task:
Generate exactly **10 highly meaningful chart prompt suggestions** that would help users analyze and gain insights from this dataset.

Each chart must include:
- **title**: A clear, concise name of the chart
- **type**: The best-suited chart type (Bar, Line, Pie, Scatter, Treemap, Heatmap, Histogram, BoxPlot, Bubble, Area)
- **description**: Why this chart matters — what question it answers or what insight it reveals
- **prompt**: A short natural-language command (what the user might type or click)

---

🧠 Think like a data analyst building a real dashboard:
- Identify trends, distributions, comparisons, correlations, or rankings
- Vary the chart types; avoid repetition
- Aim for business-useful or exploration-worthy charts

---

📤 Respond ONLY with a **JSON array of 10 items** like:
[
  {{
    "title": "Top Countries by Revenue",
    "type": "Bar",
    "description": "Ranks countries by their total revenue to highlight top performers.",
    "prompt": "Show top revenue-generating countries"
  }},
  {{
    "title": "Salary Growth Over Experience",
    "type": "Line",
    "description": "Shows how salary increases with experience, indicating career progression.",
    "prompt": "Plot salary vs experience trend"
  }},
  ...
]
"""
