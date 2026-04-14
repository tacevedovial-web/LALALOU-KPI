const XLSX = require('xlsx');

class LalallouDataProcessor {
    constructor() {
        this.stockPath = '/home/node/.openclaw/media/inbound/Stock-actual_Casa-Matriz_13-04-2026---ae384ec1-f9c0-400f-bb9a-d94845d2d71b.xlsx';
        this.ventasPath = '/home/node/.openclaw/media/inbound/Detalle_de_ventas_con_atributos_-_30_03_2026_-_12_04_2026---88fb4a61-00b6-4789-b1c5-f013503112df.xlsx';
        this.stockData = [];
        this.ventasData = [];
        this.kpis = {};
    }

    async loadData() {
        try {
            // Cargar datos de stock
            const stockWorkbook = XLSX.readFile(this.stockPath);
            const stockSheet = stockWorkbook.Sheets[stockWorkbook.SheetNames[0]];
            this.stockData = XLSX.utils.sheet_to_json(stockSheet)
                .filter(row => row.Sucursal && row['Casa Matriz'] && 
                              row.Sucursal.trim() !== '' && 
                              row['Casa Matriz'].trim() !== '' &&
                              row.Sucursal !== 'Filtros' &&
                              row.Sucursal !== 'Tipo de Producto');

            // Cargar datos de ventas
            const ventasWorkbook = XLSX.readFile(this.ventasPath);
            const ventasSheet = ventasWorkbook.Sheets[ventasWorkbook.SheetNames[0]];
            this.ventasData = XLSX.utils.sheet_to_json(ventasSheet)
                .filter(row => row['Tipo Movimiento'] && row['Venta Total Bruta']);

            console.log(`Stock cargado: ${this.stockData.length} productos`);
            console.log(`Ventas cargadas: ${this.ventasData.length} transacciones`);
            
            return true;
        } catch (error) {
            console.error('Error cargando datos:', error);
            return false;
        }
    }

    calculateKPIs() {
        // 1. KPIs de Stock
        const stockByCategory = {};
        this.stockData.forEach(item => {
            const categoria = item.Sucursal;
            if (!stockByCategory[categoria]) {
                stockByCategory[categoria] = 0;
            }
            stockByCategory[categoria]++;
        });

        // 2. KPIs de Ventas
        const ventasPorDia = {};
        const ventasPorProducto = {};
        const ventasPorVendedor = {};
        let totalVentasBrutas = 0;
        let totalCantidadVendida = 0;
        let totalMargen = 0;

        this.ventasData.forEach(venta => {
            // Solo procesar ventas reales (no devoluciones)
            if (venta['Tipo Movimiento'] === 'venta') {
                const fecha = venta['Fecha de Emisión'];
                const producto = venta['Producto / Servicio'];
                const vendedor = venta['Vendedor'];
                const ventaBruta = parseFloat(venta['Venta Total Bruta']) || 0;
                const cantidad = parseFloat(venta['Cantidad']) || 0;
                const margen = parseFloat(venta['Margen']) || 0;

                // Ventas por día
                if (!ventasPorDia[fecha]) {
                    ventasPorDia[fecha] = { total: 0, cantidad: 0 };
                }
                ventasPorDia[fecha].total += ventaBruta;
                ventasPorDia[fecha].cantidad += cantidad;

                // Ventas por producto
                if (!ventasPorProducto[producto]) {
                    ventasPorProducto[producto] = { total: 0, cantidad: 0 };
                }
                ventasPorProducto[producto].total += ventaBruta;
                ventasPorProducto[producto].cantidad += cantidad;

                // Ventas por vendedor
                if (!ventasPorVendedor[vendedor]) {
                    ventasPorVendedor[vendedor] = { total: 0, cantidad: 0 };
                }
                ventasPorVendedor[vendedor].total += ventaBruta;
                ventasPorVendedor[vendedor].cantidad += cantidad;

                totalVentasBrutas += ventaBruta;
                totalCantidadVendida += cantidad;
                totalMargen += margen;
            }
        });

        // 3. Top productos
        const topProductos = Object.entries(ventasPorProducto)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 10)
            .map(([producto, datos]) => ({
                producto,
                ventas: datos.total,
                cantidad: datos.cantidad
            }));

        // 4. Top vendedores
        const topVendedores = Object.entries(ventasPorVendedor)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 5)
            .map(([vendedor, datos]) => ({
                vendedor,
                ventas: datos.total,
                cantidad: datos.cantidad
            }));

        // 5. Productos con bajo stock (menos de 3 unidades por categoría)
        const stockCritico = Object.entries(stockByCategory)
            .filter(([categoria, cantidad]) => cantidad < 3)
            .map(([categoria, cantidad]) => ({
                categoria,
                cantidad
            }));

        this.kpis = {
            resumen: {
                totalProductosStock: this.stockData.length,
                totalCategorias: Object.keys(stockByCategory).length,
                totalVentasBrutas: totalVentasBrutas.toFixed(0),
                totalCantidadVendida: totalCantidadVendida,
                promedioMargen: totalMargen > 0 ? (totalMargen / this.ventasData.filter(v => v['Tipo Movimiento'] === 'venta').length).toFixed(0) : 0,
                fechaUltimaActualizacion: new Date().toLocaleString('es-CL')
            },
            stockPorCategoria: stockByCategory,
            stockCritico,
            topProductos,
            topVendedores,
            ventasPorDia
        };

        return this.kpis;
    }

    getKPIs() {
        return this.kpis;
    }

    async processAll() {
        const loaded = await this.loadData();
        if (loaded) {
            return this.calculateKPIs();
        }
        return null;
    }
}

// Exportar para usar en el dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LalallouDataProcessor;
}

// Para usar en el browser
if (typeof window !== 'undefined') {
    window.LalallouDataProcessor = LalallouDataProcessor;
}