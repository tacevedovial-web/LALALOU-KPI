const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const inboundDir = '/home/node/.openclaw/media/inbound/';
const files = [
    'Analisis_Stock_Lalalou_Domingo_12---a3b5d6b2-e91b-4595-9311-cf9e8205aec6.xlsx',
    'Detalle_de_ventas_con_atributos_-_30_03_2026_-_12_04_2026---88fb4a61-00b6-4789-b1c5-f013503112df.xlsx',
    'Stock-actual_Casa-Matriz_13-04-2026---ae384ec1-f9c0-400f-bb9a-d94845d2d71b.xlsx'
];

const analysisResults = {};

files.forEach(file => {
    const filePath = path.join(inboundDir, file);
    
    if (fs.existsSync(filePath)) {
        try {
            console.log(`\n=== ANALYZING: ${file} ===`);
            
            const workbook = XLSX.readFile(filePath);
            const sheetNames = workbook.SheetNames;
            console.log(`Sheets: ${sheetNames.join(', ')}`);
            
            const fileAnalysis = {
                sheets: {},
                summary: {}
            };
            
            sheetNames.forEach(sheetName => {
                try {
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    
                    console.log(`\n--- Sheet: ${sheetName} ---`);
                    console.log(`Rows: ${jsonData.length}`);
                    
                    if (jsonData.length > 0) {
                        const headers = jsonData[0];
                        console.log(`Columns (${headers.length}): ${headers.join(', ')}`);
                        
                        // Get sample data
                        const sampleData = jsonData.slice(0, 5);
                        console.log('\nFirst 5 rows:');
                        sampleData.forEach((row, idx) => {
                            console.log(`Row ${idx}: ${JSON.stringify(row.slice(0, 10))}${row.length > 10 ? '...' : ''}`);
                        });
                        
                        // Analyze columns for KPIs
                        const numericColumns = [];
                        const textColumns = [];
                        
                        if (jsonData.length > 1) {
                            const firstDataRow = jsonData[1];
                            headers.forEach((header, idx) => {
                                const value = firstDataRow[idx];
                                if (typeof value === 'number' || (typeof value === 'string' && !isNaN(parseFloat(value)))) {
                                    numericColumns.push(header);
                                } else {
                                    textColumns.push(header);
                                }
                            });
                        }
                        
                        console.log(`\nNumeric columns: ${numericColumns.join(', ')}`);
                        console.log(`Text columns: ${textColumns.join(', ')}`);
                        
                        fileAnalysis.sheets[sheetName] = {
                            rows: jsonData.length,
                            columns: headers,
                            numericColumns,
                            textColumns,
                            sampleData: sampleData.slice(0, 3)
                        };
                    }
                } catch (error) {
                    console.log(`Error reading sheet ${sheetName}: ${error.message}`);
                    fileAnalysis.sheets[sheetName] = { error: error.message };
                }
            });
            
            analysisResults[file] = fileAnalysis;
            
        } catch (error) {
            console.log(`Error analyzing ${file}: ${error.message}`);
            analysisResults[file] = { error: error.message };
        }
    } else {
        console.log(`File not found: ${file}`);
        analysisResults[file] = { error: 'File not found' };
    }
});

// Save analysis results
fs.writeFileSync('/home/node/.openclaw/workspace/LALALOU-KPI/excel_analysis.json', 
    JSON.stringify(analysisResults, null, 2), 'utf8');

console.log('\n=== ANALYSIS COMPLETE ===');
console.log('Results saved to excel_analysis.json');