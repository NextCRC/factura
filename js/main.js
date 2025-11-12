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
            borradores: [
                { id: 9001, clienteId: 1, fecha: "2024-10-12", tipo: 'proforma', lineas: [{ productoId: 101, cantidad: 1, precio: 750000 }] },
                { id: 9002, clienteId: 2, fecha: "2024-11-02", tipo: 'proforma', lineas: [{ productoId: 201, cantidad: 2, precio: 15000 }] },
                { id: 9003, clienteId: 3, fecha: "2024-11-06", tipo: 'borrador', lineas: [{ productoId: 302, cantidad: 1, precio: 45000 }] }
            ],
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

            // Acciones de Cobros Pendientes
            window.enviarRecordatorio = (id) => {
                const factura = db.facturas.find(f => f.id === id);
                if (!factura) return;
                const cliente = db.clientes.find(c => c.id === factura.clienteId);
                showNotification(`Enviando recordatorio a ${cliente ? cliente.email : 'cliente'} para factura #${id}...`, 'Procesando');
                setTimeout(() => showNotification(`Recordatorio enviado para la factura #${id}.`, 'Éxito'), 1000);
            };

            window.marcarComoCobrado = (id) => {
                const idx = db.facturas.findIndex(f => f.id === id);
                if (idx === -1) return;
                db.facturas[idx].estado = 'Pagada';
                renderDashboard();
                // Si estamos en Documentos>Emitidos, refrescar
                const docsPage = document.getElementById('page-documentos');
                if (docsPage && !docsPage.classList.contains('hidden')) {
                    if (typeof renderDocumentosContenido === 'function') {
                        renderDocumentosContenido('emitidos');
                    }
                }
                showNotification(`Factura #${id} marcada como cobrada.`, 'Éxito');
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
                    case 'documentos': initDocumentosPage(); break;
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

                // 2. Cobros Pendientes (tabla derecha)
                const arBody = document.getElementById('ar-table-body');
                if (arBody) {
                    arBody.innerHTML = '';
                    const hoy = new Date();
                    const pendientes = db.facturas
                        .filter(f => f.estado === 'Pendiente' || f.estado === 'Vencida')
                        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

                    pendientes.forEach(f => {
                        const cliente = db.clientes.find(c => c.id === f.clienteId);
                        const diffDias = Math.floor((hoy - new Date(f.fecha)) / (1000 * 60 * 60 * 24));
                        const diasTxt = diffDias >= 0 ? `${diffDias} días` : `${Math.abs(diffDias)} días`;
                        const row = `
                            <tr>
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-800">${cliente ? cliente.nombre : 'N/A'}</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-600">${f.fecha}</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm ${f.estado === 'Vencida' ? 'text-red-600' : 'text-yellow-600'}">${diasTxt}</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-800">${formatCurrency(f.total)}</td>
                                <td class="px-4 py-2 whitespace-nowrap text-sm">
                                    <button class="text-blue-600 hover:text-blue-800 mr-3" onclick="enviarRecordatorio(${f.id})">Recordatorio</button>
                                    <button class="text-green-600 hover:text-green-800" onclick="marcarComoCobrado(${f.id})">Cobrado</button>
                                </td>
                            </tr>
                        `;
                        arBody.innerHTML += row;
                    });
                }

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
                
                // 5. Gráfico unificado
                initDashboardCharts();
            }

            // INICIALIZAR GRÁFICO UNIFICADO
            let perfView = 'pair'; // 'pair' | 'sales'
            let perfPeriod = '6m'; // '4w' | '6m' | '1y'
            function initDashboardCharts() {
                const canvas = document.getElementById('performanceChart');
                if (!canvas) return;
                const ctx = canvas.getContext('2d');

                // Preparar datos según toggles
                const buildData = () => {
                    let labels = [];
                    let datasets = [];
                    if (perfPeriod === '4w') {
                        labels = db.statsSemanales.labels;
                        if (perfView === 'pair') {
                            datasets = [
                                { label: 'Ingresos', data: db.statsSemanales.ventas, backgroundColor: 'rgba(59,130,246,0.8)', borderRadius: 4, type: 'bar' },
                                { label: 'Egresos', data: db.statsSemanales.ventas.map(v => Math.round(v * 0.6)), backgroundColor: 'rgba(239,68,68,0.8)', borderRadius: 4, type: 'bar' }
                            ];
                        } else {
                            datasets = [{ label: 'Ventas', data: db.statsSemanales.ventas, fill: true, backgroundColor: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,1)', tension: 0.3, type: 'line' }];
                        }
                    } else { // 6m y 1y usan datos mensuales simulados
                        labels = db.statsMensuales.labels;
                        if (perfView === 'pair') {
                            datasets = [
                                { label: 'Ingresos', data: db.statsMensuales.ingresos, backgroundColor: 'rgba(59,130,246,0.8)', borderRadius: 4, type: 'bar' },
                                { label: 'Egresos', data: db.statsMensuales.egresos, backgroundColor: 'rgba(239,68,68,0.8)', borderRadius: 4, type: 'bar' }
                            ];
                        } else {
                            datasets = [{ label: 'Ventas', data: db.statsMensuales.ingresos, fill: true, backgroundColor: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,1)', tension: 0.3, type: 'line' }];
                        }
                    }
                    return { labels, datasets };
                };

                // Destruir instancia previa si existe
                if (window.performanceChart instanceof Chart) {
                    window.performanceChart.destroy();
                }

                const data = buildData();
                window.performanceChart = new Chart(ctx, {
                    data,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: { y: { beginAtZero: true, ticks: { callback: (value) => `₡${value/1000}K` } }, x: { grid: { display: false } } },
                        plugins: { legend: { position: 'top', align: 'end' } },
                        interaction: { intersect: false, mode: 'index' }
                    }
                });

                // Listeners para toggles (solo una vez por sesión)
                const viewPairBtn = document.getElementById('view-pair');
                const viewSalesBtn = document.getElementById('view-sales');
                const p4w = document.getElementById('period-4w');
                const p6m = document.getElementById('period-6m');
                const p1y = document.getElementById('period-1y');
                const attach = (el, fn) => el && !el.dataset.bound && (el.addEventListener('click', fn), (el.dataset.bound = '1'));

                const render = () => initDashboardCharts();
                attach(viewPairBtn, () => { perfView = 'pair'; render(); });
                attach(viewSalesBtn, () => { perfView = 'sales'; render(); });
                attach(p4w, () => { perfPeriod = '4w'; render(); });
                attach(p6m, () => { perfPeriod = '6m'; render(); });
                attach(p1y, () => { perfPeriod = '1y'; render(); });
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
                    const facturasCliente = db.facturas.filter(f => f.clienteId === cliente.id);
                    const pendiente = facturasCliente
                        .filter(f => f.estado === 'Pendiente' || f.estado === 'Vencida')
                        .reduce((acc, f) => acc + f.total, 0);
                    const tieneVencida = facturasCliente.some(f => f.estado === 'Vencida');
                    let insightTxt = 'Al día';
                    let insightClass = 'text-green-600';
                    if (pendiente > 0) {
                        insightTxt = `Pendiente: ${formatCurrency(pendiente)}`;
                        insightClass = tieneVencida ? 'text-red-600' : 'text-yellow-600';
                    }

                    const row = `
                        <tr class="hover:bg-gray-50 cursor-pointer" data-cliente-id="${cliente.id}">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <div>${cliente.nombre}</div>
                                <div class="text-xs mt-1 ${insightClass}">${insightTxt}</div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cliente.cedula}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cliente.email}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${cliente.telefono}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button class="btn-edit text-blue-600 hover:text-blue-800 mr-3" data-id="${cliente.id}" title="Editar">
                                    <svg class="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.313 3 21l.688-4.5L16.862 4.487z"/></svg>
                                </button>
                                <button class="btn-delete text-red-600 hover:text-red-800" data-id="${cliente.id}" title="Eliminar">
                                    <svg class="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            }

            // Delegación de eventos para acciones de clientes
            const clientesTableBody = document.getElementById('clientes-table-body');
            if (clientesTableBody) {
                clientesTableBody.addEventListener('click', (e) => {
                    const editBtn = e.target.closest('.btn-edit');
                    const delBtn = e.target.closest('.btn-delete');
                    const row = e.target.closest('tr[data-cliente-id]');
                    if (editBtn) {
                        const id = parseInt(editBtn.dataset.id);
                        editarCliente(id);
                        e.stopPropagation();
                        return;
                    }
                    if (delBtn) {
                        const id = parseInt(delBtn.dataset.id);
                        eliminarCliente(id);
                        e.stopPropagation();
                        return;
                    }
                    if (row) {
                        const id = parseInt(row.dataset.clienteId);
                        verPerfilCliente(id);
                    }
                });
            }

            // Handlers básicos
            window.editarCliente = (id) => {
                const cliente = db.clientes.find(c => c.id === id);
                if (!cliente) return;
                showNotification(`Editar cliente: ${cliente.nombre} (próximamente)`, 'Info');
            };
            window.eliminarCliente = (id) => {
                db.clientes = db.clientes.filter(c => c.id !== id);
                const currentFilter = document.getElementById('client-search').value;
                renderClientes(currentFilter);
                showNotification('Cliente eliminado.', 'Éxito');
            };
            window.verPerfilCliente = (id) => {
                const cliente = db.clientes.find(c => c.id === id);
                if (!cliente) return;
                showNotification(`Perfil de ${cliente.nombre} (próximamente)`, 'Info');
            };

            // Categorías personalizadas en memoria (no destructivo)
            window.customCategories = window.customCategories || [];

            function getAllCategories() {
                const base = Array.from(new Set(db.productos.map(p => p.categoria)));
                const merged = Array.from(new Set([...base, ...window.customCategories]));
                merged.sort();
                return ['Todos', ...merged];
            }

            function populateCategorySelect(selected = 'Todos') {
                const sel = document.getElementById('product-category-select');
                if (!sel) return;
                const cats = getAllCategories();
                sel.innerHTML = cats.map(c => `<option value="${c}">${c}</option>`).join('');
                sel.value = selected;
            }

            // RENDER PRODUCTOS
            function renderProductos(filterText = '', filterCategory = 'Todos') {
                const tableBody = document.getElementById('productos-table-body');
                tableBody.innerHTML = '';

                // Asegurar dropdown poblado
                populateCategorySelect(filterCategory);

                const filteredProductos = db.productos.filter(prod => {
                    const searchLower = filterText.toLowerCase();
                    const nameMatch = prod.nombre.toLowerCase().includes(searchLower);
                    if (filterCategory === 'Todos') return nameMatch;
                    return nameMatch && prod.categoria === filterCategory;
                });

                if (filteredProductos.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-10 text-gray-500">No se encontraron productos que coincidan con los filtros.</td></tr>`;
                    return;
                }

                filteredProductos.forEach(prod => {
                    const row = `
                        <tr data-producto-id="${prod.id}">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${prod.nombre}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${prod.categoria}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${formatCurrency(prod.precio)}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${prod.cabys}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(prod.iva * 100).toFixed(0)}%</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button class="prod-edit text-blue-600 hover:text-blue-800 mr-3" title="Editar">
                                    <svg class="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487a2.25 2.25 0 113.182 3.182L7.5 20.313 3 21l.688-4.5L16.862 4.487z"/></svg>
                                </button>
                                <button class="prod-delete text-red-600 hover:text-red-800" title="Eliminar">
                                    <svg class="w-5 h-5 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </td>
                        </tr>
                    `;
                    tableBody.insertAdjacentHTML('beforeend', row);
                });
            }

            // Delegación de eventos de tabla de productos
            const productosTableBody = document.getElementById('productos-table-body');
            if (productosTableBody) {
                productosTableBody.addEventListener('click', (e) => {
                    const row = e.target.closest('tr[data-producto-id]');
                    if (!row) return;
                    const id = parseInt(row.getAttribute('data-producto-id'));
                    if (e.target.closest('.prod-edit')) {
                        editarProducto(id);
                        return;
                    }
                    if (e.target.closest('.prod-delete')) {
                        const prod = db.productos.find(p => p.id === id);
                        if (!prod) return;
                        const ok = confirm(`¿Eliminar "${prod.nombre}"? Esta acción no se puede deshacer.`);
                        if (!ok) return;
                        db.productos = db.productos.filter(p => p.id !== id);
                        const txt = document.getElementById('product-search').value;
                        const cat = document.getElementById('product-category-select')?.value || 'Todos';
                        renderProductos(txt, cat);
                        showNotification('Producto eliminado.', 'Éxito');
                        return;
                    }
                });
            }

            // Handlers de productos (simulados)
            window.editarProducto = (id) => {
                const prod = db.productos.find(p => p.id === id);
                if (!prod) return;
                showNotification(`Editar producto: ${prod.nombre} (próximamente)`, 'Info');
            };

            // Listeners toolbar productos
            const productSearchInput = document.getElementById('product-search');
            if (productSearchInput) {
                productSearchInput.addEventListener('input', (e) => {
                    const cat = document.getElementById('product-category-select')?.value || 'Todos';
                    renderProductos(e.target.value, cat);
                });
            }
            const productCategorySelect = document.getElementById('product-category-select');
            if (productCategorySelect) {
                productCategorySelect.addEventListener('change', (e) => {
                    const txt = document.getElementById('product-search').value;
                    renderProductos(txt, e.target.value);
                });
            }
            const manageCategoriesBtn = document.getElementById('manage-categories-btn');
            if (manageCategoriesBtn) {
                manageCategoriesBtn.addEventListener('click', () => showManageCategoriesModal());
            }

            // Modal gestión de categorías (render mínimo)
            function showManageCategoriesModal() {
                const modal = document.getElementById('manage-categories-modal');
                if (!modal) return;
                renderCategoriesList();
                modal.classList.remove('hidden');
            }
            function hideManageCategoriesModal() {
                const modal = document.getElementById('manage-categories-modal');
                if (!modal) return;
                modal.classList.add('hidden');
            }
            function renderCategoriesList() {
                const list = document.getElementById('categories-list');
                if (!list) return;
                const base = Array.from(new Set(db.productos.map(p => p.categoria)));
                const customs = window.customCategories;
                const items = [...base.map(c => ({ name: c, custom: false })), ...customs.map(c => ({ name: c, custom: true }))].sort((a,b)=>a.name.localeCompare(b.name));
                list.innerHTML = items.map(item => `
                    <li class="flex items-center justify-between py-1">
                        <span>${item.name}</span>
                        ${item.custom ? `<button class="cat-delete text-red-600 text-sm" data-name="${item.name}">Eliminar</button>` : ''}
                    </li>
                `).join('');
            }
            document.addEventListener('click', (e) => {
                if (e.target.id === 'close-manage-categories') hideManageCategoriesModal();
                if (e.target.id === 'add-category-btn') {
                    const inp = document.getElementById('new-category-name');
                    const name = (inp.value || '').trim();
                    if (!name) return;
                    if (!window.customCategories.includes(name)) window.customCategories.push(name);
                    inp.value = '';
                    renderCategoriesList();
                    const currentCat = document.getElementById('product-category-select')?.value || 'Todos';
                    populateCategorySelect(currentCat);
                }
                if (e.target.classList && e.target.classList.contains('cat-delete')) {
                    const name = e.target.getAttribute('data-name');
                    window.customCategories = window.customCategories.filter(c => c !== name);
                    renderCategoriesList();
                    const currentCat = document.getElementById('product-category-select')?.value || 'Todos';
                    populateCategorySelect(currentCat);
                }
            });

            // (Eliminado) Lógica antigua basada en tiles de categoría



            
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

            // INICIALIZAR PÁGINA DE DOCUMENTOS
            function initDocumentosPage() {
                const tiles = document.querySelectorAll('.documento-tile');
                
                tiles.forEach(tile => {
                    tile.addEventListener('click', () => {
                        // Quitar clase activa de todos
                        tiles.forEach(t => t.classList.remove('active-tile'));
                        // Agregar clase activa al seleccionado
                        tile.classList.add('active-tile');
                        
                        const tipo = tile.dataset.tipo;
                        renderDocumentosContenido(tipo);
                    });
                });

                // Simular click en el primer tile para mostrar contenido por defecto
                const primerTile = document.querySelector('.documento-tile[data-tipo="emitidos"]');
                if (primerTile) {
                    primerTile.click();
                }
            }

            // RENDER DOCUMENTOS CONTENIDO
            function renderDocumentosContenido(tipo) {
                const titulo = document.getElementById('documentos-titulo');
                const contenido = document.getElementById('documentos-contenido');
                
                titulo.textContent = tipo.charAt(0).toUpperCase() + tipo.slice(1);
                
                if (tipo === 'emitidos') {
                    // Barra de exportación + tabla de facturas emitidas
                    contenido.innerHTML = `
                        <div class="mb-4 flex flex-col md:flex-row md:items-end md:space-x-3 space-y-2 md:space-y-0">
                            <div>
                                <label class="block text-xs text-gray-600">Desde</label>
                                <input type="date" id="emitidos-desde" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-xs text-gray-600">Hasta</label>
                                <input type="date" id="emitidos-hasta" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                            </div>
                            <div class="flex space-x-2">
                                <button class="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" title="Exportar en PDF" onclick="exportarDocumentos('pdf','emitidos')">PDF</button>
                                <button class="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" title="Exportar en Excel" onclick="exportarDocumentos('excel','emitidos')">Excel</button>
                                <button class="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800" title="Exportar en CSV" onclick="exportarDocumentos('csv','emitidos')">CSV</button>
                            </div>
                        </div>
                        <div class="overflow-y-auto" style="max-height: 400px;">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    ${db.facturas.map(factura => {
                                        const cliente = db.clientes.find(c => c.id === factura.clienteId);
                                        let estadoClass = '';
                                        if (factura.estado === 'Pagada') estadoClass = 'bg-green-100 text-green-800';
                                        else if (factura.estado === 'Pendiente') estadoClass = 'bg-yellow-100 text-yellow-800';
                                        else if (factura.estado === 'Vencida') estadoClass = 'bg-red-100 text-red-800';
                                        else if (factura.estado === 'Anulada') estadoClass = 'bg-gray-200 text-gray-700';
                                        else if (factura.estado === 'Acreditada') estadoClass = 'bg-purple-100 text-purple-800';
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
                                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 space-x-3">
                                                    <button class="inline-flex items-center text-blue-600 hover:text-blue-800" title="Reenviar por correo" onclick="reenviarFactura(${factura.id})">
                                                        <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992m0 0V4.356m0 4.992L12 14.977"/></svg>
                                                        <span>Reenviar</span>
                                                    </button>
                                                    <button class="inline-flex items-center text-red-600 hover:text-red-800" title="Anular factura" onclick="anularFactura(${factura.id})">
                                                        <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M12 21a9 9 0 100-18 9 9 0 000 18z"/></svg>
                                                        <span>Anular</span>
                                                    </button>
                                                    <button class="inline-flex items-center text-purple-600 hover:text-purple-800" title="Nota de crédito" onclick="notaCredito(${factura.id})">
                                                        <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                                        <span>Nota de crédito</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                        </div>
                    `;
                } else if (tipo === 'proformas') {
                    // Mostrar tabla de proformas y borradores
                    const proformasYBorradores = db.borradores.filter(b => b.tipo === 'proforma' || b.tipo === 'borrador');
                    if (proformasYBorradores.length === 0) {
                        contenido.innerHTML = '<p class="text-gray-500">No hay proformas o borradores guardados.</p>';
                    } else {
                        contenido.innerHTML = `
                            <div class="mb-4 flex flex-col md:flex-row md:items-end md:space-x-3 space-y-2 md:space-y-0">
                                <div>
                                    <label class="block text-xs text-gray-600">Desde</label>
                                    <input type="date" id="proformas-desde" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                </div>
                                <div>
                                    <label class="block text-xs text-gray-600">Hasta</label>
                                    <input type="date" id="proformas-hasta" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                </div>
                                <div class="flex space-x-2">
                                    <button class="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" title="Exportar en PDF" onclick="exportarDocumentos('pdf','proformas')">PDF</button>
                                    <button class="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" title="Exportar en Excel" onclick="exportarDocumentos('excel','proformas')">Excel</button>
                                    <button class="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800" title="Exportar en CSV" onclick="exportarDocumentos('csv','proformas')">CSV</button>
                                </div>
                            </div>
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
                                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 space-x-3">
                                                        <button class="inline-flex items-center text-blue-600 hover:text-blue-800" title="Cargar borrador" onclick="cargarBorrador(${borrador.id})">
                                                            <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                                                            <span>Cargar</span>
                                                        </button>
                                                        <button class="inline-flex items-center text-red-600 hover:text-red-800" title="Eliminar borrador" onclick="eliminarBorrador(${borrador.id})">
                                                            <svg class="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                                            <span>Eliminar</span>
                                                        </button>
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

            // Exportación simulada
            window.exportarDocumentos = (formato, dataset) => {
                const pref = dataset === 'emitidos' ? 'emitidos' : 'proformas';
                const desde = document.getElementById(`${pref}-desde`)?.value || 'N/A';
                const hasta = document.getElementById(`${pref}-hasta`)?.value || 'N/A';
                showNotification(`Exportando ${dataset} (${formato.toUpperCase()}) desde ${desde} hasta ${hasta}...`, 'Procesando');
                setTimeout(() => showNotification(`Exportación ${formato.toUpperCase()} completada.`, 'Éxito'), 1200);
            };

            // Funciones globales para borradores
            window.cargarBorrador = (id) => {
                const borrador = db.borradores.find(b => b.id === id);
                if (!borrador) return;
                
                // Cambiar a página de facturación
                showPage('facturacion');
                
                // Cargar datos
                document.getElementById('invoice-client').value = borrador.clienteId;
                const cliente = db.clientes.find(c => c.id === borrador.clienteId);
                if (cliente) {
                    const clientSearch = document.getElementById('invoice-client-search');
                    if (clientSearch) clientSearch.value = cliente.nombre;
                    const clientInfoBox = document.getElementById('client-info');
                    if (clientInfoBox) clientInfoBox.textContent = `Cédula: ${cliente.cedula} | Email: ${cliente.email}`;
                }
                
                // Limpiar líneas existentes
                document.getElementById('invoice-items-container').innerHTML = '';
                
                // Agregar líneas
                borrador.lineas.forEach(linea => {
                    addInvoiceItem();
                    const rows = document.querySelectorAll('.invoice-item-row');
                    const lastRow = rows[rows.length - 1];
                    selectProduct(lastRow, parseInt(linea.productoId));
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
                const clientHidden = document.getElementById('invoice-client');
                const clientSearch = document.getElementById('invoice-client-search');
                const clientSug = document.getElementById('invoice-client-suggestions');
                clientHidden.value = '';
                clientSearch.value = '';
                if (clientSug) clientSug.classList.add('hidden');

                // Resetear líneas
                invoiceItemCounter = 0;
                document.getElementById('invoice-items-container').innerHTML = '';
                addInvoiceItem(); // Agregar la primera línea

                // Resetear totales
                updateTotals();

                // Limpiar info de cliente
                document.getElementById('client-info').textContent = '';
            }

            // --- AUTOCOMPLETE CLIENTE ---
            function renderClientSuggestions(query) {
                const box = document.getElementById('invoice-client-suggestions');
                if (!box) return;
                const q = (query || '').trim().toLowerCase();
                if (!q) {
                    box.classList.add('hidden');
                    box.innerHTML = '';
                    return;
                }
                const results = db.clientes.filter(c => c.nombre.toLowerCase().includes(q) || c.cedula.toLowerCase().includes(q)).slice(0, 8);
                if (results.length === 0) {
                    box.innerHTML = '<div class="px-3 py-2 text-sm text-gray-500">Sin resultados</div>';
                    box.classList.remove('hidden');
                    return;
                }
                box.innerHTML = results.map(c => `
                    <div class="px-3 py-2 hover:bg-gray-100 cursor-pointer" data-client-id="${c.id}">
                        <div class="text-sm text-gray-800">${c.nombre}</div>
                        <div class="text-xs text-gray-500">${c.cedula}</div>
                    </div>
                `).join('');
                box.classList.remove('hidden');
            }

            function selectClient(clientId) {
                const cliente = db.clientes.find(c => c.id === clientId);
                if (!cliente) return;
                const clientHidden = document.getElementById('invoice-client');
                const clientSearch = document.getElementById('invoice-client-search');
                const clientSug = document.getElementById('invoice-client-suggestions');
                clientHidden.value = String(cliente.id);
                clientSearch.value = cliente.nombre;
                document.getElementById('client-info').textContent = `${cliente.nombre} — Cédula: ${cliente.cedula} | Email: ${cliente.email}`;
                if (clientSug) clientSug.classList.add('hidden');
            }

            // Eventos cliente typeahead
            const clientSearchInput = document.getElementById('invoice-client-search');
            const clientSugBox = document.getElementById('invoice-client-suggestions');
            if (clientSearchInput) {
                clientSearchInput.addEventListener('input', (e) => renderClientSuggestions(e.target.value));
            }
            if (clientSugBox) {
                clientSugBox.addEventListener('click', (e) => {
                    const item = e.target.closest('[data-client-id]');
                    if (!item) return;
                    const id = parseInt(item.getAttribute('data-client-id'));
                    selectClient(id);
                });
            }
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#invoice-client-suggestions') && e.target.id !== 'invoice-client-search') {
                    const box = document.getElementById('invoice-client-suggestions');
                    if (box) box.classList.add('hidden');
                }
            });

            // Lógica del formulario de factura
            document.getElementById('invoice-client').addEventListener('change', (e) => {
                const clientId = e.target.value;
                const clientInfoBox = document.getElementById('client-info');
                if (!clientId) {
                    clientInfoBox.textContent = '';
                    return;
                }
                const cliente = db.clientes.find(c => c.id == clientId);
                clientInfoBox.textContent = `${cliente.nombre} — Cédula: ${cliente.cedula} | Email: ${cliente.email}`;
            });

            document.getElementById('add-invoice-item').addEventListener('click', addInvoiceItem);
            
            function addInvoiceItem() {
                invoiceItemCounter++;
                const itemHtml = `
                    <div class="grid grid-cols-12 gap-x-4 gap-y-2 invoice-item-row" data-id="${invoiceItemCounter}">
                        <div class="col-span-12 md:col-span-6">
                            <label class="block text-sm font-medium text-gray-700">Producto/Servicio</label>
                            <div class="relative">
                                <input type="text" class="invoice-item-product-search mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Escribe para buscar..." autocomplete="off">
                                <input type="hidden" class="invoice-item-product">
                                <div class="invoice-item-product-suggestions absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 hidden"></div>
                            </div>
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
                newRow.querySelector('.invoice-item-product-search').addEventListener('input', (ev) => renderProductSuggestions(newRow, ev.target.value));
                newRow.querySelector('.invoice-item-product-suggestions').addEventListener('click', (ev) => {
                    const item = ev.target.closest('[data-product-id]');
                    if (!item) return;
                    const id = item.getAttribute('data-product-id');
                    selectProduct(newRow, parseInt(id));
                });
                newRow.querySelector('.invoice-item-qty').addEventListener('input', updateTotals);
                newRow.querySelector('.remove-invoice-item').addEventListener('click', removeInvoiceItem);
            }
            
            function updateLinePrice(e) {
                const row = e.target.closest('.invoice-item-row');
                const productId = row.querySelector('.invoice-item-product').value;
                const priceInput = row.querySelector('.invoice-item-price');
                if (!productId) {
                    priceInput.value = '';
                    updateTotals();
                    return;
                }
                const producto = db.productos.find(p => p.id == productId);
                priceInput.value = producto.precio;
                const nameInput = row.querySelector('.invoice-item-product-search');
                if (nameInput) nameInput.value = producto.nombre;
                updateTotals();
            }

            // --- AUTOCOMPLETE PRODUCTO POR FILA ---
            function renderProductSuggestions(row, query) {
                const box = row.querySelector('.invoice-item-product-suggestions');
                const input = row.querySelector('.invoice-item-product-search');
                const q = (query || '').trim().toLowerCase();
                if (!q) {
                    box.classList.add('hidden');
                    box.innerHTML = '';
                    row.querySelector('.invoice-item-product').value = '';
                    row.querySelector('.invoice-item-price').value = '';
                    updateTotals();
                    return;
                }
                const results = db.productos.filter(p => p.nombre.toLowerCase().includes(q)).slice(0, 10);
                if (results.length === 0) {
                    box.innerHTML = '<div class="px-3 py-2 text-sm text-gray-500">Sin resultados</div>';
                    box.classList.remove('hidden');
                    return;
                }
                box.innerHTML = results.map(p => `
                    <div class="px-3 py-2 hover:bg-gray-100 cursor-pointer" data-product-id="${p.id}">
                        <div class="text-sm text-gray-800">${p.nombre}</div>
                        <div class="text-xs text-gray-500">Precio: ${p.precio}</div>
                    </div>
                `).join('');
                box.classList.remove('hidden');
            }

            function selectProduct(row, productId) {
                const producto = db.productos.find(p => p.id === productId);
                if (!producto) return;
                row.querySelector('.invoice-item-product').value = String(producto.id);
                row.querySelector('.invoice-item-product-search').value = producto.nombre;
                row.querySelector('.invoice-item-price').value = producto.precio;
                const box = row.querySelector('.invoice-item-product-suggestions');
                if (box) box.classList.add('hidden');
                updateTotals();
            }

            // Cerrar sugerencias de producto al hacer click fuera
            document.addEventListener('click', (e) => {
                document.querySelectorAll('.invoice-item-row').forEach(row => {
                    if (!e.target.closest('.invoice-item-product-suggestions') && !e.target.classList.contains('invoice-item-product-search')) {
                        const box = row.querySelector('.invoice-item-product-suggestions');
                        if (box) box.classList.add('hidden');
                    }
                });
            });

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
                const totalEl = document.getElementById('total-general');
                totalEl.textContent = formatCurrency(subtotal + iva);
                // flash feedback
                totalEl.classList.remove('flash-total');
                void totalEl.offsetWidth;
                totalEl.classList.add('flash-total');
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
                
                const clientHidden = document.getElementById('invoice-client');
                const clientSearch = document.getElementById('invoice-client-search');
                if (!clientHidden.value) {
                    showNotification("Por favor, seleccione un cliente.", "Error");
                    if (clientSearch) {
                        clientSearch.classList.add('border-red-500', 'ring-red-500');
                        setTimeout(() => clientSearch.classList.remove('border-red-500', 'ring-red-500'), 2000);
                    }
                    return;
                }
                
                showNotification("Enviando a Hacienda...", "Procesando", true);
                
                // Simulación de API de Hacienda
                setTimeout(() => {
                    const total = document.getElementById('total-general').textContent;
                    const newInvoiceId = Math.floor(2024000 + Math.random() * 100);
                    
                    // Agregar a facturas
                    const clienteId = parseInt(clientHidden.value);
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
                const clientHidden = document.getElementById('invoice-client');
                const clientSearch = document.getElementById('invoice-client-search');
                if (!clientHidden.value) {
                    showNotification("Por favor, seleccione un cliente.", "Error");
                    if (clientSearch) {
                        clientSearch.classList.add('border-red-500', 'ring-red-500');
                        setTimeout(() => clientSearch.classList.remove('border-red-500', 'ring-red-500'), 2000);
                    }
                    return;
                }
                
                const draft = {
                    id: Date.now(), // Usar timestamp como ID único
                    clienteId: parseInt(clientHidden.value),
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
                const clientHidden = document.getElementById('invoice-client');
                const clientSearch = document.getElementById('invoice-client-search');
                if (!clientHidden.value) {
                    showNotification("Por favor, seleccione un cliente.", "Error");
                    if (clientSearch) {
                        clientSearch.classList.add('border-red-500', 'ring-red-500');
                        setTimeout(() => clientSearch.classList.remove('border-red-500', 'ring-red-500'), 2000);
                    }
                    return;
                }
                
                const proforma = {
                    id: Date.now(),
                    clienteId: parseInt(clientHidden.value),
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
            let addClientContext = null; // 'facturacion' | 'clientes' | null

            function showAddClientModal() {
                addClientModal.classList.remove('hidden');
                // Limpiar formulario
                addClientForm.reset();
            }

            function hideAddClientModal() {
                addClientModal.classList.add('hidden');
            }

            addClientBtn.addEventListener('click', () => { addClientContext = 'facturacion'; showAddClientModal(); });
            addClientCloseBtn.addEventListener('click', hideAddClientModal);
            addClientCancelBtn.addEventListener('click', hideAddClientModal);
            // Botón en la pestaña Clientes
            const addClientPageBtn = document.getElementById('add-client-page-btn');
            if (addClientPageBtn) addClientPageBtn.addEventListener('click', () => { addClientContext = 'clientes'; showAddClientModal(); });

            // Toggle de apellidos según tipo de identificación
            const tipoIdSelect = document.getElementById('client-tipo-id');
            const primerApeInput = document.getElementById('client-primer-apellido');
            const segundoApeInput = document.getElementById('client-segundo-apellido');
            if (tipoIdSelect) {
                tipoIdSelect.addEventListener('change', () => {
                    // Según requerimiento: bloquear apellidos si es Persona Física
                    const isFisica = tipoIdSelect.value === 'Persona Física';
                    primerApeInput.disabled = isFisica;
                    segundoApeInput.disabled = isFisica;
                    if (isFisica) {
                        primerApeInput.value = '';
                        segundoApeInput.value = '';
                    }
                });
            }

            addClientForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const tipoId = document.getElementById('client-tipo-id').value.trim();
                const identificacion = document.getElementById('client-identificacion').value.trim();
                const nombre = document.getElementById('client-nombre').value.trim();
                const primerApellido = document.getElementById('client-primer-apellido').value.trim();
                const segundoApellido = document.getElementById('client-segundo-apellido').value.trim();
                const nombreComercial = document.getElementById('client-nombre-comercial').value.trim();
                const email = document.getElementById('client-email').value.trim();
                const emailCopia = document.getElementById('client-email-copia').value.trim();
                const actividad = document.getElementById('client-actividad').value.trim();
                const direccion = document.getElementById('client-direccion').value.trim();
                const provincia = document.getElementById('client-provincia').value.trim();
                const canton = document.getElementById('client-canton').value.trim();
                const distrito = document.getElementById('client-distrito').value.trim();

                // Validación básica
                if (!tipoId || !identificacion || !nombre || !email) {
                    showNotification('Por favor, complete los campos obligatorios.', 'Error');
                    return;
                }
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    showNotification('Por favor, ingrese un correo electrónico válido.', 'Error');
                    return;
                }
                if (emailCopia && !emailRegex.test(emailCopia)) {
                    showNotification('El correo de copia no es válido.', 'Error');
                    return;
                }

                // Construir nombre para mostrar (retro-compatibilidad)
                let displayName = nombre;
                if (primerApellido) displayName += ` ${primerApellido}`;
                if (segundoApellido) displayName += ` ${segundoApellido}`;
                if (nombreComercial) displayName += ` (${nombreComercial})`;

                // Crear nuevo cliente
                const newId = db.clientes.length > 0 ? Math.max(...db.clientes.map(c => c.id)) + 1 : 1;
                const newClient = {
                    id: newId,
                    nombre: displayName,
                    cedula: identificacion,
                    email: email,
                    telefono: '',
                    // Campos adicionales
                    tipoIdentificacion: tipoId,
                    primerApellido,
                    segundoApellido,
                    nombreComercial,
                    emailCopia,
                    actividad,
                    direccion,
                    provincia,
                    canton,
                    distrito
                };

                db.clientes.push(newClient);

                // Refrescar tabla de clientes si corresponde
                if (!document.getElementById('page-clientes').classList.contains('hidden')) {
                    const currentFilter = document.getElementById('client-search').value;
                    renderClientes(currentFilter);
                }

                // Si venimos de Facturación, seleccionar inmediatamente el cliente en la factura
                if (addClientContext === 'facturacion') {
                    selectClient(newClient.id);
                }

                addClientContext = null;

                hideAddClientModal();
                showNotification(`Cliente "${newClient.nombre}" agregado exitosamente.`, 'Éxito');
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
                
                // No es necesario actualizar selects; las líneas usan buscador y db.productos
                
                // Si estamos en la página de productos, re-renderizar la tabla
                if (!document.getElementById('page-productos').classList.contains('hidden')) {
                    renderProductos();
                }
                
                // Cerrar modal y mostrar notificación
                hideAddProductModal();
                showNotification(`Producto "${newProduct.nombre}" agregado exitosamente.`, "Éxito");
            });

            // (Eliminado) Lógica modal de edición de producto antigua

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
