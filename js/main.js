        // --- BASE DE DATOS SIMULADA ---
        // Simulación de una base de datos de pyme
        const db = {
            clientes: [
                { id: 1, nombre: "Constructora El Roble S.A.", cedula: "3-101-123456", email: "facturacion@roble.cr", telefono: "2233-4455" },
                { id: 2, nombre: "Ana Sofía Vargas (Serv. Profesionales)", cedula: "1-1234-5678", email: "ana.vargas@gmail.com", telefono: "8899-0011" },
                { id: 3, nombre: "Supermercado La Familia", cedula: "3-101-789012", email: "contabilidad@lafamilia.cr", telefono: "2567-8901" }
            ],
            productos: [
                // Celulares
                { id: 101, nombre: "iPhone 15 Pro", precio: 750000, cabys: "4632101", iva: 0.13, categoria: "Celulares" },
                { id: 102, nombre: "Samsung Galaxy S24 Ultra", precio: 850000, cabys: "4632101", iva: 0.13, categoria: "Celulares" },
                { id: 103, nombre: "Xiaomi Redmi Note 13", precio: 180000, cabys: "4632101", iva: 0.13, categoria: "Celulares" },
                // Accesorios
                { id: 201, nombre: "Cargador USB-C 20W", precio: 15000, cabys: "4632909", iva: 0.13, categoria: "Accesorios" },
                { id: 202, nombre: "Estuche de Silicona para iPhone", precio: 12000, cabys: "4632909", iva: 0.13, categoria: "Accesorios" },
                { id: 203, nombre: "Protector de Pantalla de Vidrio", precio: 8000, cabys: "4632909", iva: 0.13, categoria: "Accesorios" },
                { id: 204, nombre: "Audífonos Inalámbricos Bluetooth", precio: 25000, cabys: "4632301", iva: 0.13, categoria: "Accesorios" },
                // Reparaciones
                { id: 301, nombre: "Cambio de Pantalla (iPhone)", precio: 95000, cabys: "9514001", iva: 0.13, categoria: "Reparaciones" },
                { id: 302, nombre: "Cambio de Batería (Samsung)", precio: 45000, cabys: "9514001", iva: 0.13, categoria: "Reparaciones" }
            ],
            facturas: [
                { id: 2024001, clienteId: 1, fecha: "2024-10-28", total: 50850, estado: "Pagada", lineas: [{ productoId: 101, cantidad: 1, precio: 45000 }] },
                { id: 2024002, clienteId: 2, fecha: "2024-10-15", total: 282500, estado: "Pagada", lineas: [{ productoId: 102, cantidad: 1, precio: 250000 }] },
                { id: 2024003, clienteId: 3, fecha: "2024-11-01", total: 33900, estado: "Pendiente", lineas: [{ productoId: 103, cantidad: 2, precio: 15000 }] },
                { id: 2024004, clienteId: 1, fecha: "2024-11-05", total: 100000, estado: "Pendiente", lineas: [{ productoId: 104, cantidad: 1, precio: 100000 }] },
                { id: 2024005, clienteId: 2, fecha: "2024-09-20", total: 50850, estado: "Vencida", lineas: [{ productoId: 101, cantidad: 1, precio: 45000 }] },
                { id: 2024006, clienteId: 1, fecha: "2024-11-08", total: 50850, estado: "Pendiente", lineas: [{ productoId: 101, cantidad: 1, precio: 45000 }] }
            ],
            egresos: [
                { id: 1, fecha: "2024-11-01", proveedor: "ICE", concepto: "Recibo Eléctrico", monto: 42000 },
                { id: 2, fecha: "2024-11-03", proveedor: "OfiCentro", concepto: "Suministros de oficina", monto: 25000 },
                { id: 3, fecha: "2024-11-05", proveedor: "Google Ads", concepto: "Publicidad", monto: 75000 }
            ],
            borradores: [],
            statsMensuales: {
                labels: ["Jun", "Jul", "Ago", "Sep", "Oct", "Nov"],
                ingresos: [1500000, 1800000, 1750000, 2100000, 2400000, 1500000],
                egresos: [800000, 950000, 900000, 1100000, 1200000, 450000]
            },
            statsSemanales: {
                labels: ["Sem 42", "Sem 43", "Sem 44", "Sem 45"],
                ventas: [350000, 420000, 380000, 510000]
            }
        };

        // --- UTILIDADES ---
        const formatCurrency = (value) => new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC' }).format(value);

        // --- LÓGICA DE LA APLICACIÓN ---
        document.addEventListener('DOMContentLoaded', () => {

            const pages = document.querySelectorAll('.page-container');
            const navLinks = document.querySelectorAll('.nav-link');
            const sidebar = document.getElementById('sidebar');
            const mainContent = document.querySelector('main');
            
            // --- LÓGICA DE COLAPSO ELIMINADA ---
            // const toggleBtn = document.getElementById('sidebar-toggle-btn');
            // const toggleBtnText = toggleBtn.querySelector('.nav-text');
            // const toggleBtnIcon = document.getElementById('sidebar-toggle-icon');




            // --- LÓGICA DE NAVEGACIÓN ---
            function showPage(pageId) {
                // Ocultar todas las páginas
                pages.forEach(page => page.classList.add('hidden'));
                
                // Mostrar la página solicitada
                const targetPage = document.getElementById(`page-${pageId}`);
                if (targetPage) {
                    targetPage.classList.remove('hidden');
                }

                // Actualizar el estado activo de los links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.page === pageId) {
                        link.classList.add('active');
                    }
                });

                // Cargar datos en la página
                switch (pageId) {
                    case 'dashboard': renderDashboard(); break;
                    case 'facturacion': renderInvoiceForm(); break;
                    case 'clientes': renderClientes(); break;
                    case 'productos': renderProductos(); break;
                    case 'egresos': renderEgresos(); break;
                    case 'documentos': /* Inicializar vacío */ break;
                    case 'reportes': renderReportes(); break;
                    case 'contable': /* No hay render aún */ break;
                    case 'settings': /* No hay render aún */ break;
                }
            }

            // Navegación al hacer clic en los links
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const pageId = link.dataset.page;
                    showPage(pageId);
                });
            });

            // --- LÓGICA DE COLAPSO DEL SIDEBAR (ELIMINADA) ---
            // toggleBtn.addEventListener('click', () => { ... });
            // sidebar.addEventListener('transitionend', (event) => { ... });


            // --- LÓGICA DE RENDERIZADO DE PÁGINAS ---

            // RENDER DASHBOARD
            function renderDashboard() {
                // 1. KPIs
                const ingresos = db.facturas
                    .filter(f => f.estado === 'Pagada' && new Date(f.fecha).getMonth() === new Date().getMonth())
                    .reduce((acc, f) => acc + f.total, 0);
                
                const porCobrar = db.facturas
                    .filter(f => f.estado === 'Pendiente' || f.estado === 'Vencida')
                    .reduce((acc, f) => acc + f.total, 0);

                const egresos = db.egresos
                    .filter(e => new Date(e.fecha).getMonth() === new Date().getMonth())
                    .reduce((acc, e) => acc + e.monto, 0);

                document.getElementById('kpi-ingresos').textContent = formatCurrency(ingresos);
                document.getElementById('kpi-por-cobrar').textContent = formatCurrency(porCobrar);
                document.getElementById('kpi-egresos').textContent = formatCurrency(egresos);

                // 2. Mejor Cliente
                const ventasPorCliente = db.facturas.reduce((acc, f) => {
                    acc[f.clienteId] = (acc[f.clienteId] || 0) + f.total;
                    return acc;
                }, {});
                
                const mejorClienteId = Object.keys(ventasPorCliente).sort((a, b) => ventasPorCliente[b] - ventasPorCliente[a])[0];
                const mejorCliente = db.clientes.find(c => c.id == mejorClienteId);
                
                document.getElementById('mejor-cliente-nombre').textContent = mejorCliente.nombre;
                document.getElementById('mejor-cliente-total').textContent = `Facturado: ${formatCurrency(ventasPorCliente[mejorClienteId])}`;
                document.getElementById('mejor-cliente-inicial').textContent = mejorCliente.nombre.substring(0, 1);

                // 3. Mejor Producto
                const ventasPorProducto = db.facturas
                    .flatMap(f => f.lineas)
                    .reduce((acc, l) => {
                        acc[l.productoId] = (acc[l.productoId] || 0) + l.cantidad;
                        return acc;
                    }, {});

                const mejorProductoId = Object.keys(ventasPorProducto).sort((a, b) => ventasPorProducto[b] - ventasPorProducto[a])[0];
                const mejorProducto = db.productos.find(p => p.id == mejorProductoId);

                document.getElementById('mejor-producto').textContent = mejorProducto.nombre;
                document.getElementById('mejor-producto-unidades').textContent = `${ventasPorProducto[mejorProductoId]} unidades vendidas`;

                // 4. Facturas Recientes
                const recentInvoicesBody = document.getElementById('recent-invoices-body');
                recentInvoicesBody.innerHTML = '';
                db.facturas.slice(0, 5).forEach(factura => {
                    const cliente = db.clientes.find(c => c.id === factura.clienteId);
                    let estadoClass = '';
                    if (factura.estado === 'Pagada') estadoClass = 'bg-green-100 text-green-800';
                    else if (factura.estado === 'Pendiente') estadoClass = 'bg-yellow-100 text-yellow-800';
                    else if (factura.estado === 'Vencida') estadoClass = 'bg-red-100 text-red-800';

                    const row = `
                        <tr>
                            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-800">${cliente.nombre}</td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-600">${formatCurrency(factura.total)}</td>
                            <td class="px-4 py-2 whitespace-nowrap">
                                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoClass}">
                                    ${factura.estado}
                                </span>
                            </td>
                        </tr>
                    `;
                    recentInvoicesBody.innerHTML += row;
                });
                
                // 5. Gráficos
                initDashboardCharts();
            }

            // INICIALIZAR GRÁFICOS
            // Esta función es llamada por renderDashboard y por el 'transitionend'
            function initDashboardCharts() {
                // Destruir gráficos existentes para evitar conflictos
                // CORRECCIÓN: Comprobar si la variable global es una instancia de Chart.
                // El 'if (window.salesChart)' simple da un falso positivo porque
                // el navegador crea una variable global window.salesChart para el <canvas> con id="salesChart".
                if (window.salesChart instanceof Chart) {
                    window.salesChart.destroy();
                }
                if (window.trendChart instanceof Chart) {
                    window.trendChart.destroy();
                }

                // Gráfico 1: Ingresos vs Egresos
                const ctxSales = document.getElementById('salesChart').getContext('2d');
                window.salesChart = new Chart(ctxSales, {
                    type: 'bar',
                    data: {
                        labels: db.statsMensuales.labels,
                        datasets: [
                            {
                                label: 'Ingresos',
                                data: db.statsMensuales.ingresos,
                                backgroundColor: 'rgba(59, 130, 246, 0.8)', // blue-500
                                borderRadius: 4,
                            },
                            {
                                label: 'Egresos',
                                data: db.statsMensuales.egresos,
                                backgroundColor: 'rgba(239, 68, 68, 0.8)', // red-500
                                borderRadius: 4,
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { beginAtZero: true, ticks: { callback: (value) => `₡${value/1000}K` } },
                            x: { grid: { display: false } }
                        },
                        plugins: { legend: { position: 'top', align: 'end' } },
                        interaction: { intersect: false, mode: 'index' }
                    }
                });

                // Gráfico 2: Tendencia Semanal
                const ctxTrend = document.getElementById('trendChart').getContext('2d');
                window.trendChart = new Chart(ctxTrend, {
                    type: 'line',
                    data: {
                        labels: db.statsSemanales.labels,
                        datasets: [{
                            label: 'Ventas',
                            data: db.statsSemanales.ventas,
                            fill: true,
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            tension: 0.3
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { beginAtZero: true, ticks: { callback: (value) => `₡${value/1000}K` } }
                        },
                        plugins: { legend: { display: false } }
                    }
                });
            }

            // RENDER CLIENTES
            function renderClientes(filterText = '') {
                const tableBody = document.getElementById('clientes-table-body');
                tableBody.innerHTML = '';
                
                const filteredClientes = db.clientes.filter(cliente => {
                    const searchLower = filterText.toLowerCase();
                    return cliente.nombre.toLowerCase().includes(searchLower) || 
                           cliente.cedula.toLowerCase().includes(searchLower);
                });
                
                filteredClientes.forEach(cliente => {
                    const row = `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${cliente.nombre}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cliente.cedula}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cliente.email}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cliente.telefono}</td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            }

            // RENDER PRODUCTOS
            function renderProductos(filterText = '', filterCategory = 'Todos') {
                const tableBody = document.getElementById('productos-table-body');
                tableBody.innerHTML = '';

                const filteredProductos = db.productos.filter(prod => {
                    const searchLower = filterText.toLowerCase();
                    const nameMatch = prod.nombre.toLowerCase().includes(searchLower);
                    
                    if (filterCategory === 'Todos') {
                        return nameMatch;
                    } else {
                        return nameMatch && prod.categoria === filterCategory;
                    }
                });

                if (filteredProductos.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-10 text-gray-500">No se encontraron productos que coincidan con los filtros.</td></tr>`;
                    return;
                }

                filteredProductos.forEach(prod => {
                    const row = `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${prod.nombre}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${prod.categoria}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(prod.precio)}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${prod.cabys}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${prod.iva * 100}%</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button data-product-id="${prod.id}" class="edit-product-btn text-blue-600 hover:text-blue-900">Editar</button>
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            }

            // Lógica de filtros de productos
            document.getElementById('product-search').addEventListener('input', (e) => {
                const filterText = e.target.value;
                const activeCategory = document.querySelector('.category-tile.active').dataset.category;
                renderProductos(filterText, activeCategory);
            });

            document.getElementById('product-category-tiles').addEventListener('click', (e) => {
                const tile = e.target.closest('.category-tile');
                if (!tile) return;

                // Actualizar estado activo
                document.querySelectorAll('.category-tile').forEach(t => t.classList.remove('active'));
                tile.classList.add('active');

                const filterCategory = tile.dataset.category;
                const filterText = document.getElementById('product-search').value;
                renderProductos(filterText, filterCategory);
            });



            
            // RENDER EGRESOS
            function renderEgresos() {
                const tableBody = document.getElementById('egresos-table-body');
                tableBody.innerHTML = '';
                db.egresos.forEach(egreso => {
                    const row = `
                        <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${egreso.fecha}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${egreso.proveedor}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${egreso.concepto}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(egreso.monto)}</td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            }

            // RENDER DOCUMENTOS CONTENIDO
            function renderDocumentosContenido(tipo) {
                const titulo = document.getElementById('documentos-titulo');
                const contenido = document.getElementById('documentos-contenido');
                
                titulo.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
                
                if (tipo === 'emitidos') {
                    // Mostrar tabla de facturas emitidas
                    contenido.innerHTML = `
                        <div class="overflow-y-auto" style="max-height: 400px;">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    ${db.facturas.map(factura => {
                                        const cliente = db.clientes.find(c => c.id === factura.clienteId);
                                        let estadoClass = '';
                                        if (factura.estado === 'Pagada') estadoClass = 'bg-green-100 text-green-800';
                                        else if (factura.estado === 'Pendiente') estadoClass = 'bg-yellow-100 text-yellow-800';
                                        else if (factura.estado === 'Vencida') estadoClass = 'bg-red-100 text-red-800';
                                        return `
                                            <tr>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${factura.id}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${factura.fecha}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cliente.nombre}</td>
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(factura.total)}</td>
                                                <td class="px-6 py-4 whitespace-nowrap">
                                                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoClass}">
                                                        ${factura.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                } else if (tipo === 'descargar') {
                    // Mostrar formulario para descargar
                    contenido.innerHTML = `
                        <form id="descargar-form" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label for="fecha-desde" class="block text-sm font-medium text-gray-700">Fecha Desde</label>
                                    <input type="date" id="fecha-desde" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label for="fecha-hasta" class="block text-sm font-medium text-gray-700">Fecha Hasta</label>
                                    <input type="date" id="fecha-hasta" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                </div>
                            </div>
                            <div>
                                <label for="tipo-documento" class="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                                <select id="tipo-documento" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                    <option value="todos">Todos</option>
                                    <option value="facturas">Facturas</option>
                                    <option value="recibos">Recibos</option>
                                </select>
                            </div>
                            <div class="flex justify-end">
                                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    Descargar Documentos
                                </button>
                            </div>
                        </form>
                    `;
                    // Event listener para el formulario
                    document.getElementById('descargar-form').addEventListener('submit', (e) => {
                        e.preventDefault();
                        const desde = document.getElementById('fecha-desde').value;
                        const hasta = document.getElementById('fecha-hasta').value;
                        const tipoDoc = document.getElementById('tipo-documento').value;
                        showNotification(`Descargando documentos desde ${desde} hasta ${hasta} (${tipoDoc})`, "Procesando");
                        // Simulación de descarga
                        setTimeout(() => {
                            showNotification("Documentos descargados exitosamente.", "Éxito");
                        }, 2000);
                    });
                } else if (tipo === 'proformas') {
                    // Mostrar tabla de proformas y borradores
                    const proformasYBorradores = db.borradores.filter(b => b.tipo === 'proforma' || b.tipo === 'borrador');
                    if (proformasYBorradores.length === 0) {
                        contenido.innerHTML = '<p class="text-gray-500">No hay proformas o borradores guardados.</p>';
                    } else {
                        contenido.innerHTML = `
                            <div class="overflow-y-auto" style="max-height: 400px;">
                                <table class="min-w-full divide-y divide-gray-200">
                                    <thead class="bg-gray-50">
                                        <tr>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-white divide-y divide-gray-200">
                                        ${proformasYBorradores.map(borrador => {
                                            const cliente = db.clientes.find(c => c.id === borrador.clienteId);
                                            return `
                                                <tr>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${borrador.tipo.charAt(0).toUpperCase() + borrador.tipo.slice(1)}</td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${borrador.fecha}</td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cliente ? cliente.nombre : 'N/A'}</td>
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <button class="text-blue-600 hover:text-blue-800 mr-2" onclick="cargarBorrador(${borrador.id})">Cargar</button>
                                                        <button class="text-red-600 hover:text-red-800" onclick="eliminarBorrador(${borrador.id})">Eliminar</button>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `;
                    }
                } else {
                    contenido.innerHTML = '<p class="text-gray-500">Selecciona un tipo de documento.</p>';
                }
            }

            // Funciones globales para borradores
            window.cargarBorrador = (id) => {
                const borrador = db.borradores.find(b => b.id === id);
                if (!borrador) return;
                
                // Cambiar a página de facturación
                showPage('facturacion');
                
                // Cargar datos
                document.getElementById('invoice-client').value = borrador.clienteId;
                document.getElementById('invoice-client').dispatchEvent(new Event('change'));
                
                // Limpiar líneas existentes
                document.getElementById('invoice-items-container').innerHTML = '';
                
                // Agregar líneas
                borrador.lineas.forEach(linea => {
                    addInvoiceItem();
                    const rows = document.querySelectorAll('.invoice-item-row');
                    const lastRow = rows[rows.length - 1];
                    lastRow.querySelector('.invoice-item-product').value = linea.productoId;
                    lastRow.querySelector('.invoice-item-product').dispatchEvent(new Event('change'));
                    lastRow.querySelector('.invoice-item-qty').value = linea.cantidad;
                    lastRow.querySelector('.invoice-item-qty').dispatchEvent(new Event('input'));
                });
                
                showNotification("Borrador cargado.", "Éxito");
            };
            
            window.eliminarBorrador = (id) => {
                db.borradores = db.borradores.filter(b => b.id !== id);
                renderDocumentosContenido('proformas');
                showNotification("Borrador eliminado.", "Éxito");
            };

            // RENDER FORMULARIO DE FACTURA
            let invoiceItemCounter = 0;
            function renderInvoiceForm() {
                // Llenar select de clientes
                const clientSelect = document.getElementById('invoice-client');
                clientSelect.innerHTML = '<option value="">Seleccione un cliente...</option>';
                db.clientes.forEach(cliente => {
                    clientSelect.innerHTML += `<option value="${cliente.id}">${cliente.nombre}</option>`;
                });
                
                // Resetear líneas
                invoiceItemCounter = 0;
                document.getElementById('invoice-items-container').innerHTML = '';
                addInvoiceItem(); // Agregar la primera línea

                // Resetear totales
                updateTotals();

                // Limpiar info de cliente
                document.getElementById('client-info').textContent = '';
            }

            // Lógica del formulario de factura
            document.getElementById('invoice-client').addEventListener('change', (e) => {
                const clientId = e.target.value;
                const clientInfoBox = document.getElementById('client-info');
                if (!clientId) {
                    clientInfoBox.textContent = '';
                    return;
                }
                const cliente = db.clientes.find(c => c.id == clientId);
                clientInfoBox.textContent = `Cédula: ${cliente.cedula} | Email: ${cliente.email}`;
            });

            document.getElementById('add-invoice-item').addEventListener('click', addInvoiceItem);
            
            function addInvoiceItem() {
                invoiceItemCounter++;
                const itemHtml = `
                    <div class="grid grid-cols-12 gap-x-4 gap-y-2 invoice-item-row" data-id="${invoiceItemCounter}">
                        <div class="col-span-12 md:col-span-6">
                            <label class="block text-sm font-medium text-gray-700">Producto/Servicio</label>
                            <select class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 invoice-item-product">
                                <option value="">Seleccione...</option>
                                ${db.productos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join('')}
                            </select>
                        </div>
                        <div class="col-span-4 md:col-span-2">
                            <label class="block text-sm font-medium text-gray-700">Cantidad</label>
                            <input type="number" value="1" min="1" class="invoice-item-qty mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                        </div>
                        <div class="col-span-5 md:col-span-3">
                            <label class="block text-sm font-medium text-gray-700">Precio Unit.</label>
                            <input type="number" readonly class="invoice-item-price mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100">
                        </div>
                        <div class="col-span-3 md:col-span-1 flex items-end">
                            <button type="button" class="remove-invoice-item mt-1 text-red-500 hover:text-red-700 p-2 rounded-md">
                                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.54 0c-.27.041-.54.082-.811.124m10.022 3.301c.378.02.75.034 1.12.034s.742-.014 1.12-.034m-3.005 0H9.005m5.418 0l.28.034m-3.56 0l-.28.034" /></svg>
                            </button>
                        </div>
                    </div>
                `;
                document.getElementById('invoice-items-container').insertAdjacentHTML('beforeend', itemHtml);
                
                // Asignar eventos a la nueva línea
                const newRow = document.querySelector(`.invoice-item-row[data-id="${invoiceItemCounter}"]`);
                newRow.querySelector('.invoice-item-product').addEventListener('change', updateLinePrice);
                newRow.querySelector('.invoice-item-qty').addEventListener('input', updateTotals);
                newRow.querySelector('.remove-invoice-item').addEventListener('click', removeInvoiceItem);
            }
            
            function updateLinePrice(e) {
                const productId = e.target.value;
                const row = e.target.closest('.invoice-item-row');
                const priceInput = row.querySelector('.invoice-item-price');
                if (!productId) {
                    priceInput.value = '';
                    updateTotals();
                    return;
                }
                const producto = db.productos.find(p => p.id == productId);
                priceInput.value = producto.precio;
                updateTotals();
            }

            function removeInvoiceItem(e) {
                const row = e.target.closest('.invoice-item-row');
                row.remove();
                updateTotals();
            }

            function updateTotals() {
                let subtotal = 0;
                let iva = 0;
                
                document.querySelectorAll('.invoice-item-row').forEach(row => {
                    const productId = row.querySelector('.invoice-item-product').value;
                    const qty = parseFloat(row.querySelector('.invoice-item-qty').value) || 0;
                    const price = parseFloat(row.querySelector('.invoice-item-price').value) || 0;
                    
                    if (productId && qty > 0) {
                        const producto = db.productos.find(p => p.id == productId);
                        const lineSubtotal = price * qty;
                        const lineIva = lineSubtotal * producto.iva;
                        
                        subtotal += lineSubtotal;
                        iva += lineIva;
                    }
                });

                document.getElementById('total-subtotal').textContent = formatCurrency(subtotal);
                document.getElementById('total-iva').textContent = formatCurrency(iva);
                document.getElementById('total-general').textContent = formatCurrency(subtotal + iva);
            }
            
            // Re-asignar eventos que se pierden al cambiar de página
            document.getElementById('invoice-items-container').addEventListener('change', (e) => {
                if (e.target.classList.contains('invoice-item-product')) updateLinePrice(e);
            });
            document.getElementById('invoice-items-container').addEventListener('input', (e) => {
                if (e.target.classList.contains('invoice-item-qty')) updateTotals();
            });
            document.getElementById('invoice-items-container').addEventListener('click', (e) => {
                if (e.target.closest('.remove-invoice-item')) removeInvoiceItem(e);
            });

            // Enviar factura
            document.getElementById('invoice-form').addEventListener('submit', (e) => {
                e.preventDefault();
                
                const clientSelect = document.getElementById('invoice-client');
                if (!clientSelect.value) {
                    showNotification("Por favor, seleccione un cliente.", "Error");
                    clientSelect.classList.add('border-red-500', 'ring-red-500');
                    setTimeout(() => clientSelect.classList.remove('border-red-500', 'ring-red-500'), 2000);
                    return;
                }
                
                showNotification("Enviando a Hacienda...", "Procesando", true);
                
                // Simulación de API de Hacienda
                setTimeout(() => {
                    const total = document.getElementById('total-general').textContent;
                    const newInvoiceId = Math.floor(2024000 + Math.random() * 100);
                    
                    // Agregar a facturas
                    const clienteId = parseInt(clientSelect.value);
                    const lineas = [];
                    document.querySelectorAll('.invoice-item-row').forEach(row => {
                        const productId = parseInt(row.querySelector('.invoice-item-product').value);
                        const qty = parseFloat(row.querySelector('.invoice-item-qty').value);
                        const price = parseFloat(row.querySelector('.invoice-item-price').value);
                        if (productId && qty > 0) {
                            lineas.push({ productoId: productId, cantidad: qty, precio: price });
                        }
                    });
                    db.facturas.push({
                        id: newInvoiceId,
                        clienteId: clienteId,
                        fecha: new Date().toISOString().split('T')[0],
                        total: parseFloat(document.getElementById('total-general').textContent.replace('₡', '').replace(',', '')),
                        estado: 'Pendiente',
                        lineas: lineas
                    });
                    
                    showNotification(`Factura #${newInvoiceId} por ${total} enviada y aprobada por Hacienda.`, "Éxito");
                    showPage('dashboard');
                }, 2000);
            });

            // Guardar borrador
            document.getElementById('save-draft-btn').addEventListener('click', () => {
                const clientSelect = document.getElementById('invoice-client');
                if (!clientSelect.value) {
                    showNotification("Por favor, seleccione un cliente.", "Error");
                    return;
                }
                
                const draft = {
                    id: Date.now(), // Usar timestamp como ID único
                    clienteId: parseInt(clientSelect.value),
                    fecha: new Date().toISOString().split('T')[0],
                    lineas: [],
                    tipo: 'borrador'
                };
                
                document.querySelectorAll('.invoice-item-row').forEach(row => {
                    const productId = parseInt(row.querySelector('.invoice-item-product').value);
                    const qty = parseFloat(row.querySelector('.invoice-item-qty').value);
                    const price = parseFloat(row.querySelector('.invoice-item-price').value);
                    if (productId && qty > 0) {
                        draft.lineas.push({ productoId: productId, cantidad: qty, precio: price });
                    }
                });
                
                db.borradores.push(draft);
                showNotification("Borrador guardado exitosamente.", "Éxito");
            });

            // Crear proforma
            document.getElementById('send-proforma-btn').addEventListener('click', () => {
                const clientSelect = document.getElementById('invoice-client');
                if (!clientSelect.value) {
                    showNotification("Por favor, seleccione un cliente.", "Error");
                    return;
                }
                
                const proforma = {
                    id: Date.now(),
                    clienteId: parseInt(clientSelect.value),
                    fecha: new Date().toISOString().split('T')[0],
                    lineas: [],
                    tipo: 'proforma'
                };
                
                document.querySelectorAll('.invoice-item-row').forEach(row => {
                    const productId = parseInt(row.querySelector('.invoice-item-product').value);
                    const qty = parseFloat(row.querySelector('.invoice-item-qty').value);
                    const price = parseFloat(row.querySelector('.invoice-item-price').value);
                    if (productId && qty > 0) {
                        proforma.lineas.push({ productoId: productId, cantidad: qty, precio: price });
                    }
                });
                
                db.borradores.push(proforma);
                showNotification("Proforma creada exitosamente.", "Éxito");
            });


            // --- LÓGICA DE NOTIFICACIÓN (MODAL) ---
            const notificationModal = document.getElementById('notification-modal');
            const notificationTitle = document.getElementById('notification-title');
            const notificationMessage = document.getElementById('notification-message');
            const notificationSpinner = document.getElementById('notification-spinner');
            const notificationCloseBtn = document.getElementById('notification-close-btn');

            function showNotification(message, title, processing = false) {
                notificationTitle.textContent = title;
                notificationMessage.textContent = message;
                
                if (processing) {
                    notificationSpinner.style.display = 'block';
                    notificationCloseBtn.style.display = 'none';
                } else {
                    notificationSpinner.style.display = 'none';
                    notificationCloseBtn.style.display = 'block';
                }

                if (title === "Error") {
                    notificationTitle.classList.add('text-red-600');
                } else {
                    notificationTitle.classList.remove('text-red-600');
                }
                
                notificationModal.classList.remove('hidden');
            }

            notificationCloseBtn.addEventListener('click', () => {
                notificationModal.classList.add('hidden');
            });


            // --- LÓGICA MODAL AGREGAR CLIENTE ---
            const addClientModal = document.getElementById('add-client-modal');
            const addClientCloseBtn = document.getElementById('add-client-close-btn');
            const addClientCancelBtn = document.getElementById('add-client-cancel-btn');
            const addClientForm = document.getElementById('add-client-form');
            const addClientBtn = document.getElementById('add-client-btn');

            function showAddClientModal() {
                addClientModal.classList.remove('hidden');
                // Limpiar formulario
                addClientForm.reset();
            }

            function hideAddClientModal() {
                addClientModal.classList.add('hidden');
            }

            addClientBtn.addEventListener('click', showAddClientModal);
            addClientCloseBtn.addEventListener('click', hideAddClientModal);
            addClientCancelBtn.addEventListener('click', hideAddClientModal);

            addClientForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const nombre = document.getElementById('client-nombre').value.trim();
                const cedula = document.getElementById('client-cedula').value.trim();
                const email = document.getElementById('client-email').value.trim();
                const telefono = document.getElementById('client-telefono').value.trim();
                
                // Validación básica
                if (!nombre || !cedula || !email || !telefono) {
                    showNotification("Por favor, complete todos los campos.", "Error");
                    return;
                }
                
                // Validar email básico
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showNotification("Por favor, ingrese un correo electrónico válido.", "Error");
                    return;
                }
                
                // Crear nuevo cliente
                const newId = Math.max(...db.clientes.map(c => c.id)) + 1;
                const newClient = {
                    id: newId,
                    nombre: nombre,
                    cedula: cedula,
                    email: email,
                    telefono: telefono
                };
                
                // Agregar a la base de datos
                db.clientes.push(newClient);
                
                // Actualizar el select de clientes en facturación
                const clientSelect = document.getElementById('invoice-client');
                clientSelect.innerHTML += `<option value="${newClient.id}">${newClient.nombre}</option>`;
                
                // Si estamos en la página de clientes, re-renderizar la tabla con el filtro actual
                if (!document.getElementById('page-clientes').classList.contains('hidden')) {
                    const currentFilter = document.getElementById('client-search').value;
                    renderClientes(currentFilter);
                }
                
                // Cerrar modal y mostrar notificación
                hideAddClientModal();
                showNotification(`Cliente "${newClient.nombre}" agregado exitosamente.`, "Éxito");
            });


            // --- LÓGICA MODAL AGREGAR PRODUCTO ---
            const addProductModal = document.getElementById('add-product-modal');
            const addProductCloseBtn = document.getElementById('add-product-close-btn');
            const addProductCancelBtn = document.getElementById('add-product-cancel-btn');
            const addProductForm = document.getElementById('add-product-form');
            const addProductBtn = document.getElementById('add-product-btn');

            function showAddProductModal() {
                addProductModal.classList.remove('hidden');
                // Limpiar formulario
                addProductForm.reset();
            }

            function hideAddProductModal() {
                addProductModal.classList.add('hidden');
            }

            addProductBtn.addEventListener('click', showAddProductModal);
            addProductCloseBtn.addEventListener('click', hideAddProductModal);
            addProductCancelBtn.addEventListener('click', hideAddProductModal);

            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const nombre = document.getElementById('product-nombre').value.trim();
                const precio = parseFloat(document.getElementById('product-precio').value);
                const cabys = document.getElementById('product-cabys').value.trim();
                const iva = parseFloat(document.getElementById('product-iva').value);
                
                // Validación básica
                if (!nombre || isNaN(precio) || precio < 0 || !cabys) {
                    showNotification("Por favor, complete todos los campos correctamente.", "Error");
                    return;
                }
                
                // Crear nuevo producto
                const newId = Math.max(...db.productos.map(p => p.id)) + 1;
                const newProduct = {
                    id: newId,
                    nombre: nombre,
                    precio: precio,
                    cabys: cabys,
                    iva: iva
                };
                
                // Agregar a la base de datos
                db.productos.push(newProduct);
                
                // Actualizar el select de productos en facturación
                const productSelects = document.querySelectorAll('.invoice-item-product');
                productSelects.forEach(select => {
                    select.innerHTML += `<option value="${newProduct.id}">${newProduct.nombre}</option>`;
                });
                
                // Si estamos en la página de productos, re-renderizar la tabla
                if (!document.getElementById('page-productos').classList.contains('hidden')) {
                    renderProductos();
                }
                
                // Cerrar modal y mostrar notificación
                hideAddProductModal();
                showNotification(`Producto "${newProduct.nombre}" agregado exitosamente.`, "Éxito");
            });

            // --- LÓGICA MODAL EDITAR PRODUCTO ---
            const editProductModal = document.getElementById('edit-product-modal');
            const editProductCloseBtn = document.getElementById('edit-product-close-btn');
            const editProductCancelBtn = document.getElementById('edit-product-cancel-btn');
            const editProductForm = document.getElementById('edit-product-form');
            const productosTableBody = document.getElementById('productos-table-body');

            function showEditProductModal(producto) {
                document.getElementById('edit-product-id').value = producto.id;
                document.getElementById('edit-product-nombre').value = producto.nombre;
                document.getElementById('edit-product-precio').value = producto.precio;
                document.getElementById('edit-product-cabys').value = producto.cabys;
                document.getElementById('edit-product-iva').value = producto.iva;
                editProductModal.classList.remove('hidden');
            }

            function hideEditProductModal() {
                editProductModal.classList.add('hidden');
            }

            productosTableBody.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.edit-product-btn');
                if (editBtn) {
                    const productId = parseInt(editBtn.dataset.productId);
                    const producto = db.productos.find(p => p.id === productId);
                    if (producto) {
                        showEditProductModal(producto);
                    }
                }
            });

            editProductCloseBtn.addEventListener('click', hideEditProductModal);
            editProductCancelBtn.addEventListener('click', hideEditProductModal);

            editProductForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const id = parseInt(document.getElementById('edit-product-id').value);
                const nombre = document.getElementById('edit-product-nombre').value.trim();
                const precio = parseFloat(document.getElementById('edit-product-precio').value);
                const cabys = document.getElementById('edit-product-cabys').value.trim();
                const iva = parseFloat(document.getElementById('edit-product-iva').value);

                if (!nombre || isNaN(precio) || precio < 0 || !cabys) {
                    showNotification("Por favor, complete todos los campos correctamente.", "Error");
                    return;
                }

                const productIndex = db.productos.findIndex(p => p.id === id);
                if (productIndex > -1) {
                    db.productos[productIndex] = { ...db.productos[productIndex], nombre, precio, cabys, iva };
                    
                    // Re-renderizar la tabla de productos con los filtros actuales
                    const filterText = document.getElementById('product-search').value;
                    const activeCategory = document.querySelector('.category-tile.active').dataset.category;
                    renderProductos(filterText, activeCategory);
                    
                    hideEditProductModal();
                    showNotification("Producto actualizado exitosamente.", "Éxito");
                } else {
                    showNotification("No se pudo encontrar el producto para actualizar.", "Error");
                }
            });

            // RENDER REPORTES
            function renderReportes() {
                // 1. Gráfico de Ventas (inicial)
                initSalesReportChart('monthly');

                // 2. Productos más vendidos
                const bestSellingBody = document.getElementById('best-selling-products-table');
                bestSellingBody.innerHTML = '';
                const ventasPorProducto = db.facturas
                    .flatMap(f => f.lineas)
                    .reduce((acc, l) => {
                        acc[l.productoId] = (acc[l.productoId] || 0) + l.cantidad;
                        return acc;
                    }, {});
                
                const sortedProducts = Object.keys(ventasPorProducto)
                    .sort((a, b) => ventasPorProducto[b] - ventasPorProducto[a])
                    .slice(0, 5); // Top 5

                sortedProducts.forEach(prodId => {
                    const producto = db.productos.find(p => p.id == prodId);
                    const row = `
                        <tr>
                            <td class="px-4 py-2 text-sm text-gray-800">${producto.nombre}</td>
                            <td class="px-4 py-2 text-sm text-gray-600">${ventasPorProducto[prodId]}</td>
                        </tr>
                    `;
                    bestSellingBody.innerHTML += row;
                });

                // 3. Gráfico de Rentabilidad
                initProfitabilityChart();

                // 4. Event listener para el filtro de ventas
                document.getElementById('sales-chart-filter').addEventListener('change', (e) => {
                    initSalesReportChart(e.target.value);
                });
            }

            function initSalesReportChart(period) {
                if (window.salesReportChart instanceof Chart) {
                    window.salesReportChart.destroy();
                }

                let labels, data;
                if (period === 'monthly') {
                    labels = db.statsMensuales.labels;
                    data = db.statsMensuales.ingresos;
                } else { // quarterly
                    labels = ["T1", "T2", "T3", "T4"];
                    // Simulación de datos trimestrales
                    data = [
                        db.statsMensuales.ingresos.slice(0,3).reduce((a,b) => a+b, 0),
                        db.statsMensuales.ingresos.slice(3,6).reduce((a,b) => a+b, 0),
                        db.statsMensuales.ingresos.slice(6,9).reduce((a,b) => a+b, 0),
                        db.statsMensuales.ingresos.slice(9,12).reduce((a,b) => a+b, 0)
                    ];
                }

                const ctx = document.getElementById('salesReportChart').getContext('2d');
                window.salesReportChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Ventas',
                            data: data,
                            borderColor: 'rgba(59, 130, 246, 1)',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            fill: true,
                            tension: 0.3
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { y: { beginAtZero: true } },
                        plugins: { legend: { display: false } }
                    }
                });
            }

            function initProfitabilityChart() {
                if (window.profitabilityChart instanceof Chart) {
                    window.profitabilityChart.destroy();
                }
                const ctx = document.getElementById('profitabilityChart').getContext('2d');
                window.profitabilityChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Ingresos', 'Egresos'],
                        datasets: [{
                            data: [
                                db.statsMensuales.ingresos.reduce((a, b) => a + b, 0),
                                db.statsMensuales.egresos.reduce((a, b) => a + b, 0)
                            ],
                            backgroundColor: ['rgba(59, 130, 246, 0.8)', 'rgba(239, 68, 68, 0.8)'],
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { position: 'bottom' } }
                    }
                });
            }


            // --- INICIALIZACIÓN DE LA APP ---
            showPage('dashboard');
        });
