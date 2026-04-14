#!/usr/bin/env python3
import pandas as pd
import os
import json

# Paths to the Excel files
inbound_dir = "/home/node/.openclaw/media/inbound/"
files = [
    "Analisis_Stock_Lalalou_Domingo_12---a3b5d6b2-e91b-4595-9311-cf9e8205aec6.xlsx",
    "Detalle_de_ventas_con_atributos_-_30_03_2026_-_12_04_2026---88fb4a61-00b6-4789-b1c5-f013503112df.xlsx", 
    "Stock-actual_Casa-Matriz_13-04-2026---ae384ec1-f9c0-400f-bb9a-d94845d2d71b.xlsx"
]

analysis_results = {}

for file in files:
    file_path = os.path.join(inbound_dir, file)
    if os.path.exists(file_path):
        try:
            print(f"\n=== ANALYZING: {file} ===")
            
            # Read all sheets
            xl_file = pd.ExcelFile(file_path)
            sheet_names = xl_file.sheet_names
            print(f"Sheets: {sheet_names}")
            
            file_analysis = {
                "sheets": {},
                "summary": {}
            }
            
            for sheet_name in sheet_names:
                try:
                    df = pd.read_excel(file_path, sheet_name=sheet_name)
                    
                    print(f"\n--- Sheet: {sheet_name} ---")
                    print(f"Shape: {df.shape}")
                    print(f"Columns: {list(df.columns)}")
                    
                    # Sample data
                    if not df.empty:
                        print("\nFirst 3 rows:")
                        print(df.head(3).to_string())
                        
                        print("\nData types:")
                        print(df.dtypes.to_string())
                        
                        # Numerical summary
                        numeric_cols = df.select_dtypes(include=['number']).columns
                        if len(numeric_cols) > 0:
                            print("\nNumerical summary:")
                            print(df[numeric_cols].describe().to_string())
                    
                    # Store analysis
                    file_analysis["sheets"][sheet_name] = {
                        "shape": df.shape,
                        "columns": list(df.columns),
                        "dtypes": df.dtypes.to_dict(),
                        "numeric_columns": list(df.select_dtypes(include=['number']).columns),
                        "sample_data": df.head(2).to_dict('records') if not df.empty else []
                    }
                    
                except Exception as e:
                    print(f"Error reading sheet {sheet_name}: {e}")
                    file_analysis["sheets"][sheet_name] = {"error": str(e)}
            
            analysis_results[file] = file_analysis
            
        except Exception as e:
            print(f"Error analyzing {file}: {e}")
            analysis_results[file] = {"error": str(e)}

# Save analysis results
with open('/home/node/.openclaw/workspace/LALALOU-KPI/excel_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(analysis_results, f, indent=2, ensure_ascii=False, default=str)

print("\n=== ANALYSIS COMPLETE ===")
print("Results saved to excel_analysis.json")