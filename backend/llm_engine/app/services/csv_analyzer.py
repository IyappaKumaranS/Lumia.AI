import pandas as pd

def analyze_csv(file_path):
    df = pd.read_csv(file_path)
    return {
        "columns": df.columns.tolist(),
        "sample_rows": df.head(3).to_dict(orient="records"),
        "num_rows": len(df),
        "num_columns": len(df.columns)
    }
