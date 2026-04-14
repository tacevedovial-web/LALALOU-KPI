/**
 * LALALOU KPI Dashboard - Estructura de Datos
 * Basado en el análisis de los archivos Excel reales del negocio
 */

// ==============================================================================
// 1. SCHEMA DE DATOS - Refleja las métricas reales del análisis
// ==============================================================================

/**
 * Schema principal del sistema basado en los archivos de análisis
 */
export const dataSchema = {
  // Archivo 1: Análisis Stock Completo (archivo principal con múltiples hojas)
  stockAnalysis: {
    insights: {
      description: "Análisis de unidades faltantes sin explicación por ventas",
      fields: {
        producto: { type: "string", required: true },
        talla: { type: "string", required: true },
        confeccionado: { type: "number", required: true },
        stockHoy: { type: "number", required: true },
        ventasBsale: { type: "number", required: true },
        diferencia: { type: "number", calculated: true } // confeccionado - stockHoy - ventasBsale
      }
    },
    
    weeklyEstimates: {
      description: "Semanas estimadas de stock por categoría y producto",
      fields: {
        categoria: { type: "string", required: true },
        stockActual: { type: "number", required: true },
        ventas2Semanas: { type: "number", required: true },
        semanasEstimadas: { type: "number", calculated: true } // stockActual / (ventas2Semanas / 2)
      }
    },
    
    salesByWeek: {
      description: "Ventas por semana divididas en períodos",
      fields: {
        categoria: { type: "string", required: true },
        semana1_cantidad: { type: "number", required: true },
        semana1_ventaTotal: { type: "number", required: true },
        semana2_cantidad: { type: "number", required: true },
        semana2_ventaTotal: { type: "number", required: true },
        sumaVentaNeta: { type: "number", calculated: true }
      }
    },
    
    currentStockTable: {
      description: "Resumen de stock actual por categoría",
      fields: {
        categoria: { type: "string", required: true },
        stockI26: { type: "number", required: true },
        valorStockI26: { type: "number", required: true },
        stockOtrasTemp: { type: "number", required: true },
        valorOtrasTemp: { type: "number", required: true },
        stockTotal: { type: "number", calculated: true },
        valorTotal: { type: "number", calculated: true }
      }
    },
    
    productSummary: {
      description: "Resumen por productos con KPIs de rendimiento",
      fields: {
        categoria: { type: "string", required: true },
        producto: { type: "string", required: true },
        tallas: { type: "number", required: true },
        stockConfeccionado: { type: "number", required: true },
        stockActual: { type: "number", required: true },
        ventas2Sem: { type: "number", required: true },
        porcentajeVendido: { type: "number", calculated: true },
        semanasStockPromedio: { type: "number", calculated: true },
        tallasAgotadas: { type: "number", required: true },
        tallasCriticas: { type: "number", required: true },
        detalleTallasAgotadas: { type: "string", required: false }
      }
    },
    
    productSizeDetail: {
      description: "Detalle por producto y talla individual",
      fields: {
        categoria: { type: "string", required: true },
        producto: { type: "string", required: true },
        talla: { type: "string", required: true },
        sku: { type: "string", required: false },
        stockConfeccionado: { type: "number", required: true },
        stockActual: { type: "number", required: true },
        ventas2Semanas: { type: "number", required: true },
        diferenciaInventario: { type: "number", calculated: true },
        semanasStockRestantes: { type: "number", calculated: true },
        observaciones: { type: "string", required: false },
        consumoPorFecha: { type: "string", required: false }
      }
    },
    
    sizeVelocityAnalysis: {
      description: "Análisis de velocidad de venta por talla para priorización de producción",
      fields: {
        categoria: { type: "string", required: true },
        producto: { type: "string", required: true },
        talla: { type: "string", required: true },
        confeccionado: { type: "number", required: true },
        stock: { type: "number", required: true },
        vendido: { type: "number", required: true },
        primeraVenta: { type: "date", required: false },
        ultimaVenta: { type: "date", required: false },
        velocidadDiaria: { type: "number", calculated: true },
        prioridadProduccion: { type: "string", calculated: true }
      }
    }
  },
  
  // Archivo 2: Detalle de ventas con atributos
  salesDetail: {
    description: "Transacciones de venta detalladas con todos los atributos",
    fields: {
      tipoMovimiento: { type: "string", required: true }, // venta, devolucion
      tipoDocumento: { type: "string", required: true },
      numeroDocumento: { type: "number", required: true },
      fechaEmision: { type: "date", required: true },
      trackingNumber: { type: "string", required: false },
      fechaHoraVenta: { type: "datetime", required: true },
      sucursal: { type: "string", required: true },
      vendedor: { type: "string", required: true },
      nombreCliente: { type: "string", required: true },
      clienteRUT: { type: "string", required: true },
      emailCliente: { type: "string", required: false },
      tipoProductoServicio: { type: "string", required: true },
      sku: { type: "string", required: false },
      productoServicio: { type: "string", required: true },
      variante: { type: "string", required: true },
      marca: { type: "string", required: true },
      precioLista: { type: "number", required: true },
      precioNetoUnitario: { type: "number", required: true },
      precioBrutoUnitario: { type: "number", required: true },
      cantidad: { type: "number", required: true },
      ventaTotalNeta: { type: "number", required: true },
      totalImpuestos: { type: "number", required: true },
      ventaTotalBruta: { type: "number", required: true },
      descuentoNeto: { type: "number", required: false },
      descuentoBruto: { type: "number", required: false },
      porcentajeDescuento: { type: "number", required: false },
      costoNetoUnitario: { type: "number", required: true },
      costoTotalNeto: { type: "number", required: true },
      margen: { type: "number", required: true },
      porcentajeMargen: { type: "number", required: true },
      atributoTemporada: { type: "string", required: true },
      atributoTalla: { type: "string", required: false }
    }
  },
  
  // Archivo 3: Stock actual Casa Matriz
  currentStock: {
    description: "Stock actual por producto en Casa Matriz",
    fields: {
      sucursal: { type: "string", required: true },
      producto: { type: "string", required: true },
      stock: { type: "number", required: true },
      filtros: { type: "string", required: false }
    }
  },
  
  // Archivo 4: Base de productos temporada 2026
  productCatalog: {
    description: "Catálogo completo de productos de la temporada",
    fields: {
      clasificacion: { type: "string", required: true },
      tipoProductoServicio: { type: "string", required: true },
      nombreProducto: { type: "string", required: true },
      variante: { type: "string", required: true },
      marca: { type: "string", required: true },
      permiteDecimal: { type: "boolean", required: true },
      codigoBarras: { type: "string", required: false },
      sku: { type: "string", required: false },
      controlaStock: { type: "boolean", required: true },
      stock: { type: "number", required: true },
      costoNeto: { type: "number", required: true },
      precioUnitario: { type: "number", required: true },
      talla: { type: "string", required: false },
      temporada: { type: "string", required: true },
      temporadas: { type: "string", required: true }
    }
  }
};

// ==============================================================================
// 2. FUNCIONES PARA PROCESAR ARCHIVOS INPUT
// ==============================================================================

/**
 * Procesa el archivo de análisis de stock (archivo principal)
 */
export function processStockAnalysisFile(excelData) {
  const result = {
    insights: [],
    weeklyEstimates: [],
    salesByWeek: [],
    currentStockTable: [],
    productSummary: [],
    productSizeDetail: [],
    sizeVelocityAnalysis: []
  };
  
  // Procesar hoja "Insights"
  if (excelData.sheets.Insights) {
    const insightsData = excelData.sheets.Insights.sampleData;
    for (let i = 4; i < insightsData.length; i++) { // Empezar desde fila 4 (después del header)
      const row = insightsData[i];
      if (row && row.length >= 6) {
        result.insights.push({
          producto: row[1],
          talla: row[2],
          confeccionado: parseFloat(row[3]) || 0,
          stockHoy: parseFloat(row[4]) || 0,
          ventasBsale: parseFloat(row[5]) || 0,
          diferencia: (parseFloat(row[3]) || 0) - (parseFloat(row[4]) || 0) - (parseFloat(row[5]) || 0)
        });
      }
    }
  }
  
  // Procesar hoja "Tabla Stock Actual"
  if (excelData.sheets["Tabla Stock Actual"]) {
    const stockData = excelData.sheets["Tabla Stock Actual"].sampleData;
    for (let i = 1; i < stockData.length; i++) {
      const row = stockData[i];
      if (row && row.length >= 7) {
        result.currentStockTable.push({
          categoria: row[0],
          stockI26: parseFloat(row[1]) || 0,
          valorStockI26: parseFloat(row[2]) || 0,
          stockOtrasTemp: parseFloat(row[3]) || 0,
          valorOtrasTemp: parseFloat(row[4]) || 0,
          stockTotal: parseFloat(row[5]) || 0,
          valorTotal: parseFloat(row[6]) || 0
        });
      }
    }
  }
  
  // Procesar hoja "Resumen Productos"
  if (excelData.sheets["Resumen Productos"]) {
    const productData = excelData.sheets["Resumen Productos"].sampleData;
    for (let i = 1; i < productData.length; i++) {
      const row = productData[i];
      if (row && row.length >= 10) {
        result.productSummary.push({
          categoria: row[0],
          producto: row[1],
          tallas: parseInt(row[2]) || 0,
          stockConfeccionado: parseFloat(row[3]) || 0,
          stockActual: parseFloat(row[4]) || 0,
          ventas2Sem: parseFloat(row[5]) || 0,
          porcentajeVendido: parseFloat(row[6]) || 0,
          semanasStockPromedio: parseFloat(row[7]) || 0,
          tallasAgotadas: parseInt(row[8]) || 0,
          tallasCriticas: parseInt(row[9]) || 0,
          detalleTallasAgotadas: row[10] || ""
        });
      }
    }
  }
  
  // Procesar hoja "Resumen Productos con Tallas"
  if (excelData.sheets["Resumen Productos con Tallas"]) {
    const sizeData = excelData.sheets["Resumen Productos con Tallas"].sampleData;
    for (let i = 1; i < sizeData.length; i++) {
      const row = sizeData[i];
      if (row && row.length >= 9) {
        result.productSizeDetail.push({
          categoria: row[0],
          producto: row[1],
          talla: row[2],
          sku: row[3],
          stockConfeccionado: parseFloat(row[4]) || 0,
          stockActual: parseFloat(row[5]) || 0,
          ventas2Semanas: parseFloat(row[6]) || 0,
          diferenciaInventario: parseFloat(row[7]) || 0,
          semanasStockRestantes: parseFloat(row[8]) || 0,
          observaciones: row[9] || "",
          consumoPorFecha: row[10] || ""
        });
      }
    }
  }
  
  return result;
}

/**
 * Procesa el archivo de detalle de ventas
 */
export function processSalesDetailFile(excelData) {
  const result = [];
  
  if (excelData.sheets.Sheet1) {
    const salesData = excelData.sheets.Sheet1.sampleData;
    for (let i = 1; i < salesData.length; i++) {
      const row = salesData[i];
      if (row && row.length >= 42) {
        result.push({
          tipoMovimiento: row[0],
          tipoDocumento: row[1],
          numeroDocumento: parseInt(row[2]) || 0,
          fechaEmision: new Date(row[3]),
          trackingNumber: row[4] || "",
          fechaHoraVenta: new Date(row[5]),
          sucursal: row[6],
          vendedor: row[7],
          nombreCliente: row[8],
          clienteRUT: row[9],
          emailCliente: row[10] || "",
          tipoProductoServicio: row[17],
          sku: row[18],
          productoServicio: row[19],
          variante: row[20],
          marca: row[22],
          precioLista: parseFloat(row[24]) || 0,
          precioNetoUnitario: parseFloat(row[25]) || 0,
          precioBrutoUnitario: parseFloat(row[26]) || 0,
          cantidad: parseInt(row[27]) || 0,
          ventaTotalNeta: parseFloat(row[28]) || 0,
          totalImpuestos: parseFloat(row[29]) || 0,
          ventaTotalBruta: parseFloat(row[30]) || 0,
          descuentoNeto: parseFloat(row[32]) || 0,
          descuentoBruto: parseFloat(row[33]) || 0,
          porcentajeDescuento: parseFloat(row[34]) || 0,
          costoNetoUnitario: parseFloat(row[35]) || 0,
          costoTotalNeto: parseFloat(row[36]) || 0,
          margen: parseFloat(row[37]) || 0,
          porcentajeMargen: parseFloat(row[38]) || 0,
          atributoTemporada: row[39],
          atributoTalla: row[41] || ""
        });
      }
    }
  }
  
  return result;
}

/**
 * Procesa el archivo de stock actual
 */
export function processCurrentStockFile(excelData) {
  const result = [];
  
  if (excelData.sheets.Sheet1) {
    const stockData = excelData.sheets.Sheet1.sampleData;
    // Procesar datos de stock (formato específico del archivo)
    for (let i = 2; i < stockData.length; i++) {
      const row = stockData[i];
      if (row && row.length >= 2 && row[0] && row[1]) {
        result.push({
          sucursal: row[0],
          producto: row[1],
          stock: 1, // Asumimos stock disponible ya que el filtro es "Con stock"
          filtros: "Con stock"
        });
      }
    }
  }
  
  return result;
}

/**
 * Procesa el archivo del catálogo de productos
 */
export function processProductCatalogFile(excelData) {
  const result = [];
  
  if (excelData.sheets["Base de Productos Temp 2026"]) {
    const catalogData = excelData.sheets["Base de Productos Temp 2026"].sampleData;
    for (let i = 1; i < catalogData.length; i++) {
      const row = catalogData[i];
      if (row && row.length >= 18) {
        result.push({
          clasificacion: row[0],
          tipoProductoServicio: row[1],
          nombreProducto: row[2],
          variante: row[3],
          marca: row[4],
          permiteDecimal: row[5] === "Sí",
          codigoBarras: row[6],
          sku: row[7],
          controlaStock: row[8] === "Sí",
          stock: parseFloat(row[9]) || 0,
          costoNeto: parseFloat(row[10]) || 0,
          precioUnitario: parseFloat(row[11]) || 0,
          talla: row[15],
          temporada: row[16],
          temporadas: row[17]
        });
      }
    }
  }
  
  return result;
}

// ==============================================================================
// 3. LÓGICA DE CÁLCULO PARA GENERAR KPIS EXACTOS DEL OUTPUT
// ==============================================================================

/**
 * KPIs principales basados en el análisis real de LALALOU
 */
export const kpiCalculations = {
  
  // KPI 1: Análisis de Rotación de Inventario
  inventoryTurnover: {
    name: "Rotación de Inventario",
    description: "Velocidad de venta del inventario por categoría",
    calculate: (stockData, salesData) => {
      const categoryTurnover = {};
      
      // Agrupar stock por categoría
      const stockByCategory = stockData.currentStockTable.reduce((acc, item) => {
        acc[item.categoria] = (acc[item.categoria] || 0) + item.stockTotal;
        return acc;
      }, {});
      
      // Calcular ventas por categoría
      const salesByCategory = salesData.reduce((acc, sale) => {
        if (sale.tipoMovimiento === "venta") {
          acc[sale.tipoProductoServicio] = (acc[sale.tipoProductoServicio] || 0) + sale.cantidad;
        }
        return acc;
      }, {});
      
      // Calcular turnover
      Object.keys(stockByCategory).forEach(category => {
        const sales = salesByCategory[category] || 0;
        const stock = stockByCategory[category] || 1;
        categoryTurnover[category] = {
          ventas2Semanas: sales,
          stockActual: stock,
          turnoverSemanal: sales / 2, // Ventas por semana
          semanasParaAgotar: stock / (sales / 2 || 1),
          velocidadRotacion: (sales / stock) * 100 // Porcentaje del stock vendido
        };
      });
      
      return categoryTurnover;
    }
  },
  
  // KPI 2: Análisis ABC de Productos
  abcAnalysis: {
    name: "Análisis ABC",
    description: "Clasificación de productos por impacto en ventas",
    calculate: (salesData) => {
      // Calcular ventas totales por producto
      const productSales = salesData
        .filter(sale => sale.tipoMovimiento === "venta")
        .reduce((acc, sale) => {
          const key = `${sale.productoServicio} - ${sale.variante}`;
          if (!acc[key]) {
            acc[key] = {
              producto: sale.productoServicio,
              variante: sale.variante,
              categoria: sale.tipoProductoServicio,
              ventaTotalNeta: 0,
              cantidad: 0,
              margenTotal: 0
            };
          }
          acc[key].ventaTotalNeta += sale.ventaTotalNeta;
          acc[key].cantidad += sale.cantidad;
          acc[key].margenTotal += sale.margen;
          return acc;
        }, {});
      
      // Convertir a array y ordenar por ventas
      const sortedProducts = Object.values(productSales)
        .sort((a, b) => b.ventaTotalNeta - a.ventaTotalNeta);
      
      const totalSales = sortedProducts.reduce((sum, p) => sum + p.ventaTotalNeta, 0);
      let cumulativePercent = 0;
      
      return sortedProducts.map(product => {
        cumulativePercent += (product.ventaTotalNeta / totalSales) * 100;
        let classification;
        if (cumulativePercent <= 80) classification = "A";
        else if (cumulativePercent <= 95) classification = "B";
        else classification = "C";
        
        return {
          ...product,
          participacionVentas: (product.ventaTotalNeta / totalSales) * 100,
          participacionAcumulada: cumulativePercent,
          clasificacionABC: classification,
          prioridad: classification === "A" ? "Alta" : classification === "B" ? "Media" : "Baja"
        };
      });
    }
  },
  
  // KPI 3: Análisis de Tallas Críticas
  criticalSizeAnalysis: {
    name: "Análisis de Tallas Críticas",
    description: "Identificación de tallas con riesgo de agotamiento",
    calculate: (productSizeData) => {
      return productSizeData.map(item => {
        const diasStock = item.semanasStockRestantes * 7;
        const velocidadVenta = item.ventas2Semanas / 14; // unidades por día
        const puntoReorden = velocidadVenta * 7; // stock para 1 semana
        
        let nivelRiesgo;
        let accionRecomendada;
        
        if (item.stockActual === 0) {
          nivelRiesgo = "🔴 Crítico - Agotado";
          accionRecomendada = "Reposición inmediata";
        } else if (diasStock <= 7) {
          nivelRiesgo = "🟠 Alto - Menos de 1 semana";
          accionRecomendada = "Reposición urgente";
        } else if (diasStock <= 14) {
          nivelRiesgo = "🟡 Medio - 1-2 semanas";
          accionRecomendada = "Programar reposición";
        } else {
          nivelRiesgo = "🟢 Bajo - Más de 2 semanas";
          accionRecomendada = "Sin acción requerida";
        }
        
        return {
          ...item,
          diasStockRestante: Math.round(diasStock),
          velocidadVentaDiaria: Math.round(velocidadVenta * 100) / 100,
          puntoReorden: Math.ceil(puntoReorden),
          nivelRiesgo,
          accionRecomendada,
          prioridadProduccion: item.stockActual === 0 ? 1 : diasStock <= 7 ? 2 : diasStock <= 14 ? 3 : 4
        };
      }).sort((a, b) => a.prioridadProduccion - b.prioridadProduccion);
    }
  },
  
  // KPI 4: Métricas de Rentabilidad
  profitabilityMetrics: {
    name: "Análisis de Rentabilidad",
    description: "Métricas de margen y rentabilidad por producto y categoría",
    calculate: (salesData) => {
      const metrics = {};
      
      // Agrupar por categoría
      const categorySales = salesData
        .filter(sale => sale.tipoMovimiento === "venta")
        .reduce((acc, sale) => {
          if (!acc[sale.tipoProductoServicio]) {
            acc[sale.tipoProductoServicio] = {
              categoria: sale.tipoProductoServicio,
              ventasTotales: 0,
              costosTotales: 0,
              margenTotal: 0,
              cantidad: 0,
              transacciones: 0
            };
          }
          
          acc[sale.tipoProductoServicio].ventasTotales += sale.ventaTotalNeta;
          acc[sale.tipoProductoServicio].costosTotales += sale.costoTotalNeto;
          acc[sale.tipoProductoServicio].margenTotal += sale.margen;
          acc[sale.tipoProductoServicio].cantidad += sale.cantidad;
          acc[sale.tipoProductoServicio].transacciones += 1;
          
          return acc;
        }, {});
      
      // Calcular métricas por categoría
      Object.values(categorySales).forEach(category => {
        const porcentajeMargen = (category.margenTotal / category.ventasTotales) * 100;
        const ventaPromedioPorTransaccion = category.ventasTotales / category.transacciones;
        const margenPromedioPorTransaccion = category.margenTotal / category.transacciones;
        
        metrics[category.categoria] = {
          categoria: category.categoria,
          ventasTotales: Math.round(category.ventasTotales),
          costosTotales: Math.round(category.costosTotales),
          margenTotal: Math.round(category.margenTotal),
          porcentajeMargen: Math.round(porcentajeMargen * 100) / 100,
          cantidadVendida: category.cantidad,
          transacciones: category.transacciones,
          ticketPromedio: Math.round(ventaPromedioPorTransaccion),
          margenPorTransaccion: Math.round(margenPromedioPorTransaccion),
          rentabilidad: porcentajeMargen >= 50 ? "Alta" : porcentajeMargen >= 30 ? "Media" : "Baja"
        };
      });
      
      return metrics;
    }
  },
  
  // KPI 5: Forecast de Demanda
  demandForecast: {
    name: "Proyección de Demanda",
    description: "Estimación de demanda futura basada en tendencias actuales",
    calculate: (productSummaryData) => {
      return productSummaryData.map(product => {
        const ventaSemanalPromedio = product.ventas2Sem / 2;
        const tendenciaVenta = product.porcentajeVendido > 0.5 ? "Alta" : product.porcentajeVendido > 0.2 ? "Media" : "Baja";
        
        const proyeccion4Semanas = ventaSemanalPromedio * 4;
        const proyeccion8Semanas = ventaSemanalPromedio * 8;
        const stockNecesario4Sem = Math.ceil(proyeccion4Semanas - product.stockActual);
        const stockNecesario8Sem = Math.ceil(proyeccion8Semanas - product.stockActual);
        
        return {
          categoria: product.categoria,
          producto: product.producto,
          ventaSemanalPromedio: Math.round(ventaSemanalPromedio * 100) / 100,
          tendenciaVenta,
          stockActual: product.stockActual,
          proyeccion4Semanas: Math.round(proyeccion4Semanas),
          proyeccion8Semanas: Math.round(proyeccion8Semanas),
          stockNecesario4Sem: stockNecesario4Sem > 0 ? stockNecesario4Sem : 0,
          stockNecesario8Sem: stockNecesario8Sem > 0 ? stockNecesario8Sem : 0,
          recomendacionProduccion: stockNecesario4Sem > 0 ? `Producir ${stockNecesario4Sem} unidades` : "Stock suficiente",
          prioridadProduccion: product.tallasAgotadas > 0 ? "Inmediata" : tendenciaVenta === "Alta" ? "Alta" : "Normal"
        };
      }).sort((a, b) => {
        const priority = { "Inmediata": 1, "Alta": 2, "Normal": 3 };
        return priority[a.prioridadProduccion] - priority[b.prioridadProduccion];
      });
    }
  }
};

// ==============================================================================
// 4. ESTRUCTURA DE DATOS DE EJEMPLO BASADA EN LOS ARCHIVOS REALES
// ==============================================================================

/**
 * Datos de ejemplo extraídos de los archivos reales de LALALOU
 */
export const sampleData = {
  // Resumen de stock actual por categorías (basado en "Tabla Stock Actual")
  stockSummary: {
    "Abrigos": {
      stockI26: 71,
      valorStockI26: 11322236,
      stockOtrasTemp: 0,
      valorOtrasTemp: 0,
      stockTotal: 71,
      valorTotal: 11322236
    },
    "Blazers y Chaquetas": {
      stockI26: 193,
      valorStockI26: 11460491,
      stockOtrasTemp: 77,
      valorOtrasTemp: 3572898,
      stockTotal: 270,
      valorTotal: 15033389
    },
    "Blusas y Camisas": {
      stockI26: 368,
      valorStockI26: 12996081,
      stockOtrasTemp: 122,
      valorOtrasTemp