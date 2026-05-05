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
  ChevronRight,
  UserCircle,
  Stethoscope,
  TrendingUp,
  CreditCard,
  History,
  Info,
  Settings
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
  Cell,
  LineChart,
  Line
} from "recharts";

// --- Types ---
type Status = "En Proceso" | "Completado" | "Pendiente";
type PaymentStatus = "Pagado" | "Pendiente";
type UserRole = "ADMINISTRADOR" | "RECEPCIÓN" | "QUÍMICO" | "INVENTARIO" | "PACIENTE";

interface PatientRecord {
  id: string;
  name: string;
  study: string;
  status: Status;
  payment: PaymentStatus;
  date: string;
  age: number;
  gender: string;
  doctor?: string;
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
  { id: "PX-001", name: "Juan Pérez García", study: "Biometría Hemática", status: "En Proceso", payment: "Pagado", date: "2024-05-05", age: 45, gender: "H", doctor: "Dr. Morales" },
  { id: "PX-002", name: "María Elena García", study: "Química Sanguínea (36)", status: "Completado", payment: "Pagado", date: "2024-05-05", age: 38, gender: "M", doctor: "Dra. Ortiz" },
  { id: "PX-003", name: "Alejandro Hernández", study: "Perfil Lipídico", status: "Pendiente", payment: "Pendiente", date: "2024-05-05", age: 29, gender: "H", doctor: "Dr. Morales" },
  { id: "PX-004", name: "Sofía López Portillo", study: "Perfil Tiroideo", status: "Completado", payment: "Pagado", date: "2024-05-05", age: 52, gender: "M", doctor: "Dr. Sánchez" },
  { id: "PX-005", name: "Ricardo Martínez Ruiz", study: "Perfil Hepático", status: "En Proceso", payment: "Pagado", date: "2024-05-05", age: 24, gender: "M", doctor: "Dr. Morales" },
  { id: "PX-006", name: "Elena Rodríguez", study: "Hemoglobina Glicosilada", status: "Completado", payment: "Pagado", date: "2024-05-04", age: 41, gender: "M", doctor: "Dr. Morales" },
  { id: "PX-007", name: "Diego González", study: "Glucosa en Ayunas", status: "En Proceso", payment: "Pendiente", date: "2024-05-04", age: 60, gender: "H", doctor: "Dra. Ortiz" },
  { id: "PX-008", name: "Patricia Moreno", study: "Electrolitos Sanguíneos", status: "Completado", payment: "Pagado", date: "2024-05-04", age: 33, gender: "M", doctor: "Dr. Morales" },
  { id: "PX-010", name: "Patricia Smith", study: "Biometría Hemática", status: "Completado", payment: "Pagado", date: "2024-05-03", age: 33, gender: "M", doctor: "Dr. Morales" },
  { id: "PX-011", name: "Roberto Gómez", study: "Antígeno Prostático", status: "En Proceso", payment: "Pagado", date: "2024-05-05", age: 62, gender: "H", doctor: "Dra. Ortiz" },
  { id: "PX-012", name: "Lucía Méndez", study: "Examen de Orina", status: "Completado", payment: "Pagado", date: "2024-05-05", age: 25, gender: "M", doctor: "Dr. Sánchez" },
  { id: "PX-013", name: "Fernando Ortiz", study: "Prueba de Embarazo", status: "Pendiente", payment: "Pagado", date: "2024-05-05", age: 28, gender: "M", doctor: "Dra. Ortiz" },
  { id: "PX-014", name: "Carmen Salinas", study: "Perfil de Lípidos", status: "En Proceso", payment: "Pendiente", date: "2024-05-04", age: 47, gender: "M", doctor: "Dr. Morales" },
  { id: "PX-015", name: "Gabriel Soto", study: "Ácido Úrico", status: "Completado", payment: "Pagado", date: "2024-05-04", age: 50, gender: "H", doctor: "Dr. Sánchez" },
  { id: "PX-016", name: "Monica Naranjo", study: "Química Sanguínea (6)", status: "Pendiente", payment: "Pagado", date: "2024-05-05", age: 35, gender: "M", doctor: "Dr. Morales" },
  { id: "PX-017", name: "Luis Miguel Gallego", study: "Perfil Coronario", status: "Completado", payment: "Pagado", date: "2024-05-03", age: 54, gender: "H" },
  { id: "PX-018", name: "Paulina Rubio", study: "Examen General de Orina", status: "En Proceso", payment: "Pagado", date: "2024-05-05", age: 52, gender: "M" },
  { id: "PX-019", name: "Enrique Iglesias", study: "Antígeno Carcinoembrionario", status: "Pendiente", payment: "Pendiente", date: "2024-05-05", age: 48, gender: "H" },
  { id: "PX-020", name: "Thalía Sodi", study: "Perfil Hormonal Femenino", status: "Completado", payment: "Pagado", date: "2024-04-30", age: 51, gender: "M" },
];

const REAGENTS: Reagent[] = [
  { id: "RG-001", name: "Reactivo Biometría A", stock: 15, min: 20, unit: "Cajas" },
  { id: "RG-002", name: "Solución Salina 0.9%", stock: 45, min: 30, unit: "Frascos" },
  { id: "RG-003", name: "Tiras Reactivas Glucosa", stock: 8, min: 50, unit: "Paquetes" },
  { id: "RG-004", name: "Reactivo Perfil Lipídico", stock: 22, min: 15, unit: "Kits" },
  { id: "RG-005", name: "Muestreadores Estériles", stock: 120, min: 100, unit: "Piezas" },
  { id: "RG-006", name: "Alcohol Etílico 70%", stock: 5, min: 10, unit: "Lts" },
];

const CHART_DATA = [
  { name: "Lun", ventas: 12400, citas: 32, volumen: 45 },
  { name: "Mar", ventas: 15500, citas: 38, volumen: 52 },
  { name: "Mie", ventas: 11200, citas: 28, volumen: 40 },
  { name: "Jue", ventas: 18900, citas: 45, volumen: 65 },
  { name: "Vie", ventas: 14200, citas: 35, volumen: 50 },
  { name: "Sab", ventas: 8900, citas: 20, volumen: 25 },
];

const ATTENDANCE = [
  { staff: "Jesús Armengol", role: "Químico", status: "Presente", time: "08:00 AM" },
  { staff: "María Ortiz", role: "Recepción", status: "Presente", time: "08:15 AM" },
  { staff: "Carlos Pérez", role: "Químico", status: "Retraso", time: "08:45 AM" },
  { staff: "Lucía Méndez", role: "Soporte", status: "Ausente", time: "--" },
];

// --- Shared Components ---

const SidebarLink = ({ 
  icon, 
  label, 
  active = false, 
  onClick = () => {} 
}: { 
  icon: React.ReactNode, 
  label: string, 
  active?: boolean,
  onClick?: () => void
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
  trend?: string, 
  trendUp?: boolean,
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
    {trend && (
      <div className="mt-4 flex items-center gap-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
        }`}>
          {trendUp ? "↑" : "↓"} {trend}
        </span>
      </div>
    )}
  </motion.div>
);

const StatusBadge = ({ status }: { status: Status }) => {
  const styles = {
    "Completado": "bg-green-100 text-green-700",
    "En Proceso": "bg-blue-100 text-blue-700",
    "Pendiente": "bg-orange-100 text-orange-700",
  };
  const labels = {
    "Completado": "LISTO",
    "En Proceso": "PROCESANDO",
    "Pendiente": "PENDIENTE",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// --- Sub-Module Components ---

const ChemistModal = ({ patient, onClose }: { patient: PatientRecord, onClose: () => void }) => {
  const [results, setResults] = useState({ glucose: "", cholesterol: "", triglycerides: "" });
  const [validated, setValidated] = useState({ glucose: true, cholesterol: true, triglycerides: true });

  const RANGES = {
    glucose: { min: 70, max: 100 },
    cholesterol: { min: 0, max: 200 },
    triglycerides: { min: 0, max: 150 },
  };

  const handleInputChange = (key: keyof typeof results, val: string) => {
    const num = parseFloat(val);
    const range = RANGES[key];
    const isValid = isNaN(num) || (num >= range.min && num <= range.max);
    
    setResults(prev => ({ ...prev, [key]: val }));
    setValidated(prev => ({ ...prev, [key]: isValid }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-perisur-gray/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-slate-100"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-black text-perisur-gray">Captura de Resultados</h2>
            <p className="text-sm text-slate-500">{patient.name} • {patient.study}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="space-y-6 mb-8">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Glucosa (mg/dL)</label>
                <span className="text-[10px] font-bold text-slate-300">Norm: 70-100</span>
              </div>
              <input 
                type="number" 
                value={results.glucose}
                onChange={(e) => handleInputChange("glucose", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all ${
                  validated.glucose ? "bg-slate-50 border-transparent focus:ring-2 focus:ring-perisur-blue" : "bg-red-50 border-red-200 text-red-700"
                }`}
                placeholder="Ingresar valor"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Colesterol Total (mg/dL)</label>
                <span className="text-[10px] font-bold text-slate-300">Norm: &lt; 200</span>
              </div>
              <input 
                type="number" 
                value={results.cholesterol}
                onChange={(e) => handleInputChange("cholesterol", e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl text-sm outline-none transition-all ${
                  validated.cholesterol ? "bg-slate-50 border-transparent focus:ring-2 focus:ring-perisur-blue" : "bg-red-50 border-red-200 text-red-700"
                }`}
                placeholder="Ingresar valor"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border border-slate-100 text-sm font-bold text-slate-400 hover:bg-slate-50">
            Cancelar
          </button>
          <button onClick={() => { alert("Resultados validados y guardados"); onClose(); }} className="px-6 py-3 rounded-xl bg-perisur-blue text-white text-sm font-bold hover:shadow-lg transition-all flex items-center gap-2">
            <Save className="w-4 h-4" />
            Finalizar Reporte
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>("ADMINISTRADOR");
  const [activeModule, setActiveModule] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filters
  const filteredPatients = useMemo(() => {
    return INITIAL_RECORDS.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const stats = useMemo(() => {
    return {
      revenue: CHART_DATA.reduce((acc, curr) => acc + curr.ventas, 0).toLocaleString(),
      pending: INITIAL_RECORDS.filter(p => p.status !== "Completado").length,
      appointments: 48,
      stockAlerts: REAGENTS.filter(r => r.stock < r.min).length
    };
  }, []);

  const renderModule = () => {
    switch (currentRole) {
      case "ADMINISTRADOR":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard icon={<TrendingUp className="w-5 h-5" />} label="Ingresos Totales" value={`$${stats.revenue}`} trend="+12.5%" trendUp={true} color="bg-blue-50 text-perisur-blue" />
              <KPICard icon={<Activity className="w-5 h-5" />} label="Volumen Semanal" value="279" trend="Óptimo" trendUp={true} color="bg-green-50 text-green-600" />
              <KPICard icon={<Users className="w-5 h-5" />} label="Nuevos Pacientes" value="14" trend="+4" trendUp={true} color="bg-orange-50 text-orange-600" />
              <KPICard icon={<ClipboardList className="w-5 h-5" />} label="Eficiencia" value="94%" trend="Estable" trendUp={true} color="bg-slate-100 text-slate-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-perisur-gray mb-6">Análisis de Ingresos</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 10}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Line type="monotone" dataKey="ventas" stroke="#0056b3" strokeWidth={4} dot={{r: 6, fill: "#0056b3", strokeWidth: 2, stroke: "#fff"}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-perisur-gray mb-6">Control de Asistencia</h3>
                <div className="space-y-4">
                  {ATTENDANCE.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-perisur-blue font-bold">
                          {p.staff.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-perisur-gray leading-none mb-1">{p.staff}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{p.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                          p.status === "Presente" ? "bg-green-100 text-green-700" : p.status === "Retraso" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                        }`}>
                          {p.status}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">{p.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "RECEPCIÓN":
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-perisur-gray">Recepción y Caja</h2>
                  <p className="text-sm text-slate-400">Gestión de citas y cobros actuales</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar paciente/ID..." 
                      className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm w-64 outline-none focus:ring-2 focus:ring-perisur-blue"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="bg-perisur-blue text-white p-2.5 rounded-xl"><Plus className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                    <tr>
                      <th className="px-8 py-4">Paciente</th>
                      <th className="px-8 py-4">Estudio</th>
                      <th className="px-8 py-4">Pago</th>
                      <th className="px-8 py-4">Estatus</th>
                      <th className="px-8 py-4 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredPatients.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-4 font-bold text-sm text-perisur-gray">
                          <p>{p.name}</p>
                          <p className="text-[10px] text-slate-300 font-mono">{p.id}</p>
                        </td>
                        <td className="px-8 py-4 text-sm text-slate-500">{p.study}</td>
                        <td className="px-8 py-4">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-full ${p.payment === "Pagado" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                            {p.payment}
                          </span>
                        </td>
                        <td className="px-8 py-4"><StatusBadge status={p.status} /></td>
                        <td className="px-8 py-4 text-right">
                          {p.payment === "Pendiente" ? (
                            <button className="bg-perisur-blue text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2 ml-auto">
                              <CreditCard className="w-4 h-4" /> Cobrar
                            </button>
                          ) : (
                            <button className="text-slate-300 hover:text-perisur-blue transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "QUÍMICO":
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-perisur-gray">Bandeja Analítica</h2>
                <p className="text-sm text-slate-400">Muestras pendientes de procesamiento</p>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl">
                {["Pendientes", "Procesando"].map(t => (
                  <button key={t} className={`px-4 py-2 rounded-lg text-xs font-bold ${t === "Pendientes" ? "bg-white shadow-sm text-perisur-blue" : "text-slate-400"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {INITIAL_RECORDS.filter(p => p.status !== "Completado").map(p => (
                <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-blue-50 text-perisur-blue"><Beaker className="w-5 h-5" /></div>
                    <StatusBadge status={p.status} />
                  </div>
                  <h4 className="font-black text-perisur-gray mb-1">{p.name}</h4>
                  <p className="text-xs text-slate-400 mb-6">{p.study}</p>
                  <button 
                    onClick={() => setSelectedPatient(p)}
                    className="w-full py-3 bg-perisur-blue text-white rounded-2xl text-xs font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Ingresar Resultados
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "INVENTARIO":
        return (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-2 duration-500">
            <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-perisur-gray">Control de Reactivos</h2>
                <p className="text-sm text-slate-400">Gestión de insumos y semáforo de stock</p>
              </div>
              <button className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold border border-red-100">
                <AlertTriangle className="w-4 h-4" /> Stock Critico ({REAGENTS.filter(r => r.stock < r.min).length})
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest px-8">
                  <tr>
                    <th className="px-8 py-4 text-left">Reactivo/Insumo</th>
                    <th className="px-8 py-4 text-left">Existencia</th>
                    <th className="px-8 py-4 text-left">Nivel Mínimo</th>
                    <th className="px-8 py-4 text-left">Estatus</th>
                    <th className="px-8 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {REAGENTS.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-4 font-bold text-sm text-perisur-gray">{r.name}</td>
                      <td className="px-8 py-4 text-sm text-slate-500">{r.stock} {r.unit}</td>
                      <td className="px-8 py-4 text-sm text-slate-400">{r.min} {r.unit}</td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${r.stock < r.min ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                          <span className={`text-[10px] font-black uppercase ${r.stock < r.min ? "text-red-600" : "text-green-600"}`}>
                            {r.stock < r.min ? "Reordenar" : "Óptimo"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <button className="text-perisur-blue font-bold text-xs hover:underline">Solicitar Pedido</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "PACIENTE":
        const userAppointments = INITIAL_RECORDS.filter(p => p.id === "PX-002" || p.id === "PX-001");
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="bg-gradient-to-r from-perisur-blue to-blue-700 p-10 rounded-3xl text-white shadow-xl shadow-blue-100">
              <h2 className="text-2xl font-black mb-2">Hola, Juan Pérez</h2>
              <p className="text-white/80 text-sm">Bienvenido a tu historial clínico en Diagnósticos Perisur.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-lg font-black text-perisur-gray">Mis Estudios Recientes</h3>
                {userAppointments.map(a => (
                  <div key={a.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-blue-50 text-perisur-blue"><History className="w-5 h-5" /></div>
                      <div>
                        <p className="font-black text-perisur-gray leading-none mb-1">{a.study}</p>
                        <p className="text-xs text-slate-400">{a.date} • {a.doctor || "Médico General"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={a.status} />
                      {a.status === "Completado" && (
                        <button className="bg-perisur-blue text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2">
                          <FileText className="w-4 h-4" /> Ver Reporte
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-perisur-gray">Información</h3>
                <div className="p-4 bg-blue-50 rounded-2xl flex gap-3">
                  <Info className="w-5 h-5 text-perisur-blue flex-shrink-0" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sus resultados se publican de forma automática al ser validados por el área técnica.
                  </p>
                </div>
                <button className="w-full py-4 bg-slate-50 text-perisur-gray rounded-2xl text-xs font-bold hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                  Actualizar Datos Médicos
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#fdfdfd] text-perisur-gray font-sans overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-100 flex-col h-full sticky top-0 z-20">
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="flex flex-col items-center gap-4 mb-10">
            <img 
              src="https://cossma.com.mx/diagnosticos.png" 
              alt="Logo" 
              className="h-14 w-auto grayscale-0 brightness-110"
            />
            <div className="text-center">
              <h1 className="text-lg font-black tracking-tight text-perisur-blue leading-tight">Diagnósticos Perisur</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Smart Lab Platform</p>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] uppercase font-black text-slate-300 tracking-widest px-3 mb-4">Navegación</p>
            <SidebarLink icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active />
            <SidebarLink icon={<Calendar className="w-5 h-5" />} label="Agenda" onClick={() => {}} />
            <SidebarLink icon={<Users className="w-5 h-5" />} label="Directorio" onClick={() => {}} />
            <SidebarLink icon={<Settings className="w-5 h-5" />} label="Configuración" onClick={() => {}} />
          </nav>
        </div>

        <div className="p-8 bg-slate-50 shadow-[0_-1px_0_0_rgba(0,0,0,0.05)]">
          <div className="mb-6">
            <label className="text-[10px] font-black uppercase text-slate-400 px-1 mb-3 block">Simular Rol</label>
            <div className="grid grid-cols-1 gap-1">
              {(["ADMINISTRADOR", "RECEPCIÓN", "QUÍMICO", "INVENTARIO", "PACIENTE"] as UserRole[]).map(r => (
                <button 
                  key={r}
                  onClick={() => setCurrentRole(r)}
                  className={`text-[10px] font-black py-2 px-3 rounded-lg text-left transition-all ${
                    currentRole === r ? "bg-perisur-blue text-white shadow-md shadow-blue-100" : "text-slate-400 hover:bg-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white border border-slate-100 text-xs font-black text-slate-400 hover:text-red-500 hover:border-red-100 transition-all">
            <LogOut className="w-4 h-4" />
            Salir del Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-3 bg-slate-50 rounded-xl" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6 text-perisur-blue" />
            </button>
            <div>
              <h2 className="text-xl font-black text-perisur-gray uppercase tracking-tight">{currentRole}</h2>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">
                <span>Perisur</span>
                <ChevronRight className="w-2.5 h-2.5" />
                <span className="text-perisur-blue">{currentRole.charAt(0) + currentRole.slice(1).toLowerCase()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 hover:bg-slate-50 rounded-2xl relative text-slate-400 hover:text-perisur-blue transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-4 border-white shadow-sm"></span>
            </button>
            <div className="h-10 w-px bg-slate-100" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 leading-none">Jesús Armengol</p>
                <p className="text-[10px] font-black text-perisur-blue uppercase tracking-wider mt-1">{currentRole}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-perisur-blue flex items-center justify-center text-white font-black shadow-lg shadow-blue-100">
                JA
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-slate-50/20">
          <div className="max-w-7xl mx-auto pb-20">
            {renderModule()}
          </div>
        </main>
      </div>

      {/* --- Mobile Sidebar Overlay --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-perisur-gray/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 p-8 flex flex-col"
            >
              <div className="flex items-center justify-between mb-10">
                <img src="https://cossma.com.mx/diagnosticos.png" alt="Logo" className="h-10 w-auto" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                {(["ADMINISTRADOR", "RECEPCIÓN", "QUÍMICO", "INVENTARIO", "PACIENTE"] as UserRole[]).map(r => (
                  <button 
                    key={r}
                    onClick={() => { setCurrentRole(r); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left p-4 rounded-2xl font-black transition-all ${currentRole === r ? "bg-perisur-blue text-white shadow-lg" : "text-slate-400 bg-slate-50"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {selectedPatient && <ChemistModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />}
      </AnimatePresence>
    </div>
  );
}
