import React, { useState, useMemo } from "react";
import { 
  Users, 
  ClipboardList, 
  Activity, 
  DollarSign, 
  FlaskConical, 
  Search, 
  Bell, 
  LayoutDashboard,
  Calendar,
  FileText,
  LogOut,
  MoreVertical,
  CheckCircle2,
  Clock,
  Menu,
  X,
  Plus,
  ArrowUpRight,
  Package,
  AlertTriangle,
  Beaker,
  Save,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

// --- Types ---
type Status = "En Proceso" | "Completado" | "Pendiente";
type Module = "Dashboard" | "Recepción" | "Laboratorio" | "Inventario";

interface PatientRecord {
  id: string;
  name: string;
  study: string;
  status: Status;
  date: string;
  age?: number;
  gender?: string;
}

interface Reagent {
  id: string;
  name: string;
  stock: number;
  min: number;
  unit: string;
}

// --- Mock Data ---
const INITIAL_RECORDS: PatientRecord[] = [
  { id: "MX-2026-001", name: "Juan Pérez García", study: "Biometría Hemática", status: "En Proceso", date: "05/05/2026", age: 45, gender: "H" },
  { id: "MX-2026-002", name: "María Elena García", study: "Química Sanguínea (36 elementos)", status: "Completado", date: "05/05/2026", age: 38, gender: "M" },
  { id: "MX-2026-003", name: "Alejandro Hernández", study: "Examen General de Orina", status: "Pendiente", date: "05/05/2026", age: 29, gender: "H" },
  { id: "MX-2026-004", name: "Sofía López Portillo", study: "Perfil Lipídico", status: "Completado", date: "05/05/2026", age: 52, gender: "M" },
  { id: "MX-2026-005", name: "Ricardo Martínez Ruiz", study: "Prueba de Embarazo (HCG)", status: "En Proceso", date: "05/05/2026", age: 24, gender: "M" },
  { id: "MX-2026-006", name: "Elena Rodríguez", study: "Perfil Tiroideo", status: "Completado", date: "04/05/2026", age: 41, gender: "M" },
  { id: "MX-2026-007", name: "Diego González", study: "Glucosa en Ayunas", status: "En Proceso", date: "04/05/2026", age: 60, gender: "H" },
  { id: "MX-2026-008", name: "Patricia Moreno", study: "Electrolitos Sanguíneos", status: "Completado", date: "04/05/2026", age: 33, gender: "M" },
  { id: "MX-2026-009", name: "Javier Sánchez", study: "Hemoglobina Glicosilada", status: "Pendiente", date: "04/05/2026", age: 55, gender: "H" },
  { id: "MX-2026-010", name: "Gabriela Torres", study: "Coproparasitoscópico", status: "Completado", date: "04/05/2026", age: 27, gender: "M" },
];

const REAGENTS: Reagent[] = [
  { id: "RG-001", name: "Reactivo Biometría A", stock: 15, min: 20, unit: "Cajas" },
  { id: "RG-002", name: "Solución Salina 0.9%", stock: 45, min: 30, unit: "Frascos" },
  { id: "RG-003", name: "Tiras Reactivas Glucosa", stock: 8, min: 50, unit: "Paquetes" },
  { id: "RG-004", name: "Reactivo Perfil Lipídico", stock: 22, min: 15, unit: "Kits" },
  { id: "RG-005", name: "Muestreadores Estériles", stock: 120, min: 100, unit: "Piezas" },
];

const CHART_DATA = [
  { name: "Lun", ventas: 12400, citas: 32 },
  { name: "Mar", ventas: 15500, citas: 38 },
  { name: "Mie", ventas: 11200, citas: 28 },
  { name: "Jue", ventas: 18900, citas: 45 },
  { name: "Vie", ventas: 14200, citas: 35 },
];

// --- Components ---

const SidebarLink = ({ 
  icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean,
  onClick: () => void
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group ${
      active 
        ? "bg-perisur-blue text-white shadow-lg shadow-blue-100 font-medium" 
        : "text-perisur-gray hover:bg-slate-50 opacity-80 hover:opacity-100"
    }`}
  >
    <span className={active ? "text-white" : "text-slate-400 group-hover:text-perisur-blue"}>{icon}</span>
    {label}
  </button>
);

const KPICard = ({ icon, label, value, trend, trendUp, color }: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  trend: string, 
  trendUp: boolean,
  color: string
}) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group"
  >
    <div className={`p-2.5 rounded-xl w-fit mb-4 ${color}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</h3>
      <p className="text-2xl font-black text-perisur-gray tracking-tight">{value}</p>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
        trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
      }`}>
        {trendUp ? "↑" : "↓"} {trend}
      </span>
    </div>
  </motion.div>
);

const StatusBadge = ({ status }: { status: Status }) => {
  if (status === "Completado") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">
        LISTO
      </span>
    );
  }
  if (status === "En Proceso") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
        PROCESANDO
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 uppercase tracking-wider">
      PENDIENTE
    </span>
  );
};

const ResultModal = ({ patient, onClose }: { patient: PatientRecord, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-perisur-gray/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-100"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-black text-perisur-gray">Captura de Resultados</h2>
            <p className="text-sm text-slate-500">{patient.name} • {patient.study}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Métrica 1: Eritrocitos</label>
              <input type="text" placeholder="Ej. 4.5 M/µL" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-perisur-blue outline-none text-sm" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Métrica 2: Hemoglobina</label>
              <input type="text" placeholder="Ej. 14.2 g/dL" className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-perisur-blue outline-none text-sm" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Observaciones</label>
              <textarea rows={4} className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-perisur-blue outline-none resize-none text-sm"></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border border-slate-100 text-sm font-bold text-slate-400 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button onClick={() => { alert("Resultados guardados exitosamente"); onClose(); }} className="px-6 py-3 rounded-xl bg-perisur-blue text-white text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2">
            <Save className="w-4 h-4" />
            Guardar Resultados
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>("Dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);

  const filteredPatients = useMemo(() => {
    return INITIAL_RECORDS.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.study.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const renderModule = () => {
    switch (activeModule) {
      case "Dashboard":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard 
                icon={<Calendar className="w-5 h-5" />} 
                label="Citas Hoy" 
                value="48" 
                trend="12% vs ayer" 
                trendUp={true} 
                color="bg-blue-50 text-perisur-blue" 
              />
              <KPICard 
                icon={<DollarSign className="w-5 h-5" />} 
                label="Ventas Hoy" 
                value="$24,850" 
                trend="8% vs ayer" 
                trendUp={true} 
                color="bg-green-50 text-green-600" 
              />
              <KPICard 
                icon={<Clock className="w-5 h-5" />} 
                label="Pendientes" 
                value="14" 
                trend="2 prioritarios" 
                trendUp={false} 
                color="bg-orange-50 text-orange-600" 
              />
              <KPICard 
                icon={<Package className="w-5 h-5" />} 
                label="Reactivos Bajos" 
                value="3" 
                trend="Alerta Stock" 
                trendUp={false} 
                color="bg-red-50 text-red-600" 
              />
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-xl font-black text-perisur-gray">Ventas Semanales</h3>
                    <p className="text-xs text-slate-400">Rendimiento comparativo de ingresos (Pesos MXN)</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-500">
                    Últimos 5 días <ChevronDown className="w-3 h-3" />
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }} 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                        cursor={{ fill: "#f8fafc" }}
                      />
                      <Bar dataKey="ventas" radius={[8, 8, 0, 0]} barSize={40}>
                        {CHART_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 3 ? "#0056b3" : "#e2e8f0"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-perisur-gray mb-6">Próximas Citas</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-perisur-blue font-bold text-xs">
                        {i === 1 ? "14:00" : i === 2 ? "14:30" : "15:00"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-perisur-gray leading-tight">Paciente {i}</p>
                        <p className="text-[10px] text-slate-400">Estudio General</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </div>
                  ))}
                  <button className="w-full py-3 text-xs font-bold text-perisur-blue bg-blue-50/50 rounded-xl hover:bg-blue-50 transition-colors">
                    Ver Calendario Completo
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "Recepción":
        return (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500">
            <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-perisur-gray">Control de Pacientes</h2>
                <p className="text-sm text-slate-400">Registro y búsqueda de ingresos diarios</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar por nombre o ID..." 
                    className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm w-full sm:w-64 focus:ring-2 focus:ring-perisur-blue transition-all outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="bg-perisur-blue text-white p-2.5 rounded-xl hover:shadow-lg transition-all">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">ID/Paciente</th>
                    <th className="px-8 py-4">Estudio</th>
                    <th className="px-8 py-4">Edad/Sexo</th>
                    <th className="px-8 py-4">Fecha</th>
                    <th className="px-8 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPatients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <div>
                          <p className="text-sm font-bold text-perisur-gray">{p.name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{p.id}</p>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm font-medium text-slate-600">{p.study}</td>
                      <td className="px-8 py-4 text-sm text-slate-400 font-medium">{p.age} años / {p.gender}</td>
                      <td className="px-8 py-4 text-sm text-slate-400">{p.date}</td>
                      <td className="px-8 py-4 text-right">
                        <button className="text-perisur-blue hover:text-blue-800 transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Laboratorio":
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <div>
                <h2 className="text-xl font-black text-perisur-gray">Panel de Laboratorio</h2>
                <p className="text-sm text-slate-400">Captura de resultados y procesos analíticos</p>
              </div>
              <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl">
                {["Pendiente", "En Proceso", "Completado"].map((st, idx) => (
                  <button key={st} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${idx === 1 ? "bg-white shadow-sm text-perisur-blue" : "text-slate-400 hover:text-slate-600"}`}>
                    {st}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INITIAL_RECORDS.filter(p => p.status !== "Completado").map(p => (
                <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${p.status === "Pendiente" ? "bg-red-50 text-red-600" : "bg-blue-50 text-perisur-blue"}`}>
                      <Beaker className="w-5 h-5" />
                    </div>
                    <StatusBadge status={p.status} />
                  </div>
                  <h4 className="text-lg font-black text-perisur-gray mb-1">{p.name}</h4>
                  <p className="text-xs text-slate-500 mb-6">{p.study}</p>
                  <button 
                    onClick={() => setSelectedPatient(p)}
                    className="w-full py-3 bg-perisur-blue text-white rounded-2xl text-xs font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Capturar Resultados
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "Inventario":
        return (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-perisur-gray">Gestión de Inventario</h2>
                <p className="text-sm text-slate-400">Control de reactivos e insumos clínicos</p>
              </div>
              <button className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition-all border border-red-100">
                <AlertTriangle className="w-4 h-4" />
                Alertas Activas (2)
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-8 py-4">Insumo / Reactivo</th>
                    <th className="px-8 py-4">Stock Actual</th>
                    <th className="px-8 py-4">Mínimo</th>
                    <th className="px-8 py-4">Estatus</th>
                    <th className="px-8 py-4 text-right">Pedido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {REAGENTS.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4 font-bold text-sm text-perisur-gray">{r.name}</td>
                      <td className="px-8 py-4 text-sm font-medium text-slate-500">{r.stock} {r.unit}</td>
                      <td className="px-8 py-4 text-sm text-slate-400">{r.min} {r.unit}</td>
                      <td className="px-8 py-4">
                        {r.stock < r.min ? (
                          <span className="flex items-center gap-1.5 text-red-600 text-xs font-black">
                            <AlertTriangle className="w-4 h-4" /> Stock Bajo
                          </span>
                        ) : (
                          <span className="text-green-600 text-xs font-black">Óptimo</span>
                        )}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button className="text-perisur-blue font-bold text-xs hover:underline transition-all">
                          Generar Orden
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/30 text-perisur-gray font-sans overflow-hidden">
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col h-full sticky top-0 z-20">
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="flex flex-col items-center gap-4 mb-10">
            <img 
              src="https://cossma.com.mx/diagnosticos.png" 
              alt="Diagnósticos Perisur Logo" 
              className="h-16 w-auto object-contain"
            />
            <div className="text-center">
              <h1 className="text-lg font-black tracking-tight text-perisur-blue leading-tight">Diagnósticos Perisur</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Smart Cloud System</p>
            </div>
          </div>

          <nav className="space-y-2">
            <p className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em] px-3 mb-4">Navegación</p>
            <SidebarLink 
              icon={<LayoutDashboard className="w-5 h-5" />} 
              label="Dashboard" 
              active={activeModule === "Dashboard"} 
              onClick={() => setActiveModule("Dashboard")}
            />
            <SidebarLink 
              icon={<Users className="w-5 h-5" />} 
              label="Recepción" 
              active={activeModule === "Recepción"} 
              onClick={() => setActiveModule("Recepción")}
            />
            <SidebarLink 
              icon={<FlaskConical className="w-5 h-5" />} 
              label="Laboratorio" 
              active={activeModule === "Laboratorio"} 
              onClick={() => setActiveModule("Laboratorio")}
            />
            <SidebarLink 
              icon={<Package className="w-5 h-5" />} 
              label="Inventario" 
              active={activeModule === "Inventario"} 
              onClick={() => setActiveModule("Inventario")}
            />
          </nav>
        </div>

        <div className="p-8 bg-slate-50/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-perisur-blue flex items-center justify-center text-white font-black shadow-lg shadow-blue-100">
              JA
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-none">Jesús Armengol</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Administrador</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white border border-slate-100 text-sm font-black text-slate-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* --- Mobile Menu Overlay --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-perisur-gray/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <img src="https://cossma.com.mx/diagnosticos.png" alt="Logo" className="h-10 w-auto" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              <nav className="space-y-4">
                {(["Dashboard", "Recepción", "Laboratorio", "Inventario"] as Module[]).map((m) => (
                  <button 
                    key={m}
                    onClick={() => { setActiveModule(m); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-6 py-4 rounded-2xl font-black text-lg transition-all ${
                      activeModule === m ? "bg-perisur-blue text-white shadow-lg shadow-blue-100" : "text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-white border-b border-slate-100 px-8 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-perisur-blue" />
            </button>
            <div className="hidden lg:block">
              <h2 className="text-2xl font-black text-perisur-gray underline underline-offset-8 decoration-perisur-blue/20">{activeModule}</h2>
              <nav className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">
                <span className="hover:text-perisur-blue cursor-pointer transition-colors">Diagnósticos Perisur</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-perisur-blue">{activeModule}</span>
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-perisur-blue transition-colors" />
              <input 
                type="text" 
                placeholder="Búsqueda rápida..." 
                className="pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-100 rounded-xl text-xs w-64 focus:ring-2 focus:ring-perisur-blue focus:bg-white transition-all outline-none font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button className="p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 relative group transition-all">
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-perisur-blue" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-4 border-white shadow-sm shadow-red-100"></span>
            </button>

            <div className="h-10 w-px bg-slate-100"></div>

            <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Calendar className="w-4 h-4" />
              {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
          <div className="max-w-7xl mx-auto">
            {renderModule()}
          </div>
        </main>
      </div>

      {/* --- Modals --- */}
      <AnimatePresence>
        {selectedPatient && (
          <ResultModal 
            patient={selectedPatient} 
            onClose={() => setSelectedPatient(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
