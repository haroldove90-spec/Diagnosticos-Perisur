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
type UserRole = "ADMINISTRADOR" | "RECEPCIÓN" | "QUÍMICO" | "INVENTARIO" | "PACIENTE" | "MÉDICO";

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
  tat?: number; // Turnaround time in hours
  history?: { date: string, value: number, metric: string }[];
}

interface Reagent {
  id: string;
  name: string;
  stock: number;
  min: number;
  unit: string;
  expiry: string;
  category: "Reactivos" | "Insumos";
}

// --- Mock Data ---
const INITIAL_RECORDS: PatientRecord[] = [
  { id: "PX-001", name: "Juan Pérez García", study: "Biometría Hemática", status: "En Proceso", payment: "Pagado", date: "2024-05-05", age: 45, gender: "H", doctor: "Dr. Morales", tat: 4 },
  { id: "PX-002", name: "María Elena García", study: "Química Sanguínea (36)", status: "Completado", payment: "Pagado", date: "2024-05-05", age: 38, gender: "M", doctor: "Dra. Ortiz", tat: 12, history: [{date: "2024-01-10", value: 95, metric: "Glucosa"}] },
  { id: "PX-003", name: "Alejandro Hernández", study: "Perfil Lipídico", status: "Pendiente", payment: "Pendiente", date: "2024-05-05", age: 29, gender: "H", doctor: "Dr. Morales" },
  { id: "PX-004", name: "Sofía López Portillo", study: "Perfil Tiroideo", status: "Completado", payment: "Pagado", date: "2024-05-05", age: 52, gender: "M", doctor: "Dr. Sánchez", tat: 24 },
  { id: "PX-005", name: "Ricardo Martínez Ruiz", study: "Perfil Hepático", status: "En Proceso", payment: "Pagado", date: "2024-05-05", age: 24, gender: "M", doctor: "Dr. Morales" },
  { id: "PX-021", name: "Gabriel Soto", study: "Glucosa", status: "Completado", payment: "Pagado", date: "2024-05-04", age: 50, gender: "H", doctor: "Dr. Sánchez", history: [{date: "2024-02-15", value: 110, metric: "Glucosa"}] },
  { id: "PX-022", name: "Monica Naranjo", study: "Perfil Tiroideo", status: "Pendiente", payment: "Pagado", date: "2024-05-05", age: 35, gender: "M", doctor: "Dr. Morales" },
];

const REAGENTS: Reagent[] = [
  { id: "RG-001", name: "Reactivo Biometría A", stock: 15, min: 20, unit: "Cajas", expiry: "2024-06-15", category: "Reactivos" },
  { id: "RG-002", name: "Solución Salina 0.9%", stock: 45, min: 30, unit: "Frascos", expiry: "2025-12-01", category: "Insumos" },
  { id: "RG-003", name: "Tiras Reactivas Glucosa", stock: 8, min: 50, unit: "Paquetes", expiry: "2024-05-20", category: "Reactivos" },
  { id: "RG-004", name: "Tubos de Recolección (Lila)", stock: 220, min: 100, unit: "Piezas", expiry: "2026-08-10", category: "Insumos" },
  { id: "RG-005", name: "Muestreadores Estériles", stock: 120, min: 100, unit: "Piezas", expiry: "2025-01-15", category: "Insumos" },
];

const TOP_STUDIES = [
  { name: "Glucosa", count: 145 },
  { name: "Biometría Hemática", count: 132 },
  { name: "Química Sanguínea", count: 98 },
  { name: "EGO", count: 85 },
  { name: "Perfil Lipídico", count: 72 },
  { name: "Coproparasitoscópico", count: 45 },
];

const EXPIRATIONS = [
  { name: "Tiras Reactivas", date: "En 15 días", severity: "high" },
  { name: "Reactivo Biometría", date: "En 45 días", severity: "medium" },
  { name: "Alcohol Isopropílico", date: "En 90 días", severity: "low" },
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
    const isValid = val === "" || (num >= range.min && num <= range.max);
    
    setResults(prev => ({ ...prev, [key]: val }));
    setValidated(prev => ({ ...prev, [key]: isValid }));
  };

  const hasHistory = patient.history && patient.history.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-perisur-gray/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-slate-100"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-black text-perisur-gray">Captura de Resultados</h2>
              <StatusBadge status={patient.status} />
            </div>
            <p className="text-sm text-slate-500">{patient.name} • {patient.study} • {patient.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest">Entrada de Datos</h3>
            <div className="space-y-4">
              {(Object.keys(RANGES) as Array<keyof typeof results>).map((key) => {
                return (
                  <div key={key}>
                    <div className="flex justify-between mb-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {(key as string).charAt(0).toUpperCase() + (key as string).slice(1)} (mg/dL)
                      </label>
                      <span className="text-[10px] font-bold text-slate-300">Norm: {RANGES[key].min}-{RANGES[key].max}</span>
                    </div>
                    <input 
                      type="number" 
                      value={results[key]}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      className={`w-full px-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold border-2 transition-all outline-none ${
                        !validated[key] ? "border-red-500 bg-red-50" : "border-transparent focus:border-perisur-blue"
                      }`}
                      placeholder="0.00"
                    />
                    {!validated[key] && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">Valor Crítico</p>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 flex flex-col">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-6">Historial Comparativo</h3>
            {hasHistory ? (
              <div className="flex-1 space-y-4">
                {patient.history?.map((h, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{h.metric}</p>
                      <p className="text-sm font-black text-perisur-gray">{h.value} <span className="text-[10px] font-bold text-slate-400">mg/dL</span></p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400">{h.date}</p>
                      <span className="text-[10px] font-black text-green-600">NORMAL</span>
                    </div>
                  </div>
                ))}
                <div className="pt-4 mt-auto border-t border-slate-200 border-dashed">
                  <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed">
                    * El sistema ha detectado una coherencia analítica con registros previos.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 grayscale opacity-30">
                <History className="w-10 h-10 mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Sin Antecedentes</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={onClose} className="px-6 py-4 bg-slate-100 text-slate-400 rounded-2xl text-xs font-black uppercase hover:bg-slate-200 transition-all flex-1">
            Muestra Rechazada
          </button>
          <button onClick={() => { alert("Resultados firmados y liberados"); onClose(); }} className="px-8 py-4 bg-perisur-blue text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-100 hover:scale-[1.02] transition-all flex-[2] flex items-center justify-center gap-2">
            Liberar con Firma Digital <Save className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
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

  if (!currentRole) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <div className="text-center mb-12">
            <img src="https://cossma.com.mx/diagnosticos.png" alt="Logo" className="h-20 mx-auto mb-6" />
            <h1 className="text-3xl font-black text-perisur-gray tracking-tight">Portal Diagnósticos Perisur</h1>
            <p className="text-slate-500 font-medium">Seleccione su perfil de acceso para continuar</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: "ADMINISTRADOR", icon: <LayoutDashboard />, label: "Administración", desc: "Gestión, Finanzas y RRHH", color: "text-blue-600 bg-blue-100" },
              { id: "RECEPCIÓN", icon: <Users />, label: "Recepción", desc: "Caja, Citas y Pacientes", color: "text-indigo-600 bg-indigo-100" },
              { id: "QUÍMICO", icon: <FlaskConical />, label: "Laboratorio", desc: "Worklist y Resultados", color: "text-emerald-600 bg-emerald-100" },
              { id: "INVENTARIO", icon: <Package />, label: "Inventario", desc: "Stock y Caducidades", color: "text-amber-600 bg-amber-100" },
              { id: "PACIENTE", icon: <UserCircle />, label: "Paciente", desc: "Mis Resultados en Línea", color: "text-purple-600 bg-purple-100" },
              { id: "MÉDICO", icon: <Stethoscope />, label: "Médico Referente", desc: "Seguimiento Poblacional", color: "text-rose-600 bg-rose-100" },
            ].map((role) => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setCurrentRole(role.id as UserRole); setActiveModule("Dashboard"); }}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-left group hover:shadow-xl hover:shadow-blue-900/5 transition-all"
              >
                <div className={`w-12 h-12 ${role.color} rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-6`}>
                  {React.cloneElement(role.icon as React.ReactElement, { className: "w-6 h-6" })}
                </div>
                <h3 className="font-black text-perisur-gray text-lg">{role.label}</h3>
                <p className="text-xs text-slate-400 font-medium">{role.desc}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

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
            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard icon={<TrendingUp className="w-5 h-5" />} label="Ingresos Totales" value={`$${stats.revenue}`} trend="+12.5%" trendUp={true} color="bg-blue-50 text-perisur-blue" />
              <KPICard icon={<Activity className="w-5 h-5" />} label="Volumen Semanal" value="279" trend="Óptimo" trendUp={true} color="bg-green-50 text-green-600" />
              <KPICard icon={<Clock className="w-5 h-5" />} label="TAT Promedio" value="14.2 hrs" trend="-2.1h vs mes ant." trendUp={true} color="bg-orange-50 text-orange-600" />
              <KPICard icon={<Users className="w-5 h-5" />} label="Staff Activo" value="12/15" trend="3 en turno" trendUp={true} color="bg-slate-100 text-slate-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Analytics Chart */}
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-perisur-gray mb-6">Rendimiento Financiero Semanal</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 10}} />
                      <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="ventas" fill="#0056b3" radius={[6, 6, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Studies */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-perisur-gray mb-6">Top Estudios</h3>
                <div className="space-y-4">
                  {TOP_STUDIES.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between text-[10px] font-bold uppercase mb-1">
                          <span className="text-slate-600">{s.name}</span>
                          <span className="text-perisur-blue">{s.count}</span>
                        </div>
                        <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-perisur-blue rounded-full" 
                            style={{ width: `${(s.count / TOP_STUDIES[0].count) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Attendance & HR */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-perisur-gray mb-6">Asistencia de Personal</h3>
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

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-black text-perisur-gray mb-6">Balance Financiero</h3>
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl border border-dashed border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Gasto en Reactivos</span>
                      <span className="text-sm font-black text-red-500">$34,200</span>
                    </div>
                    <div className="h-1.5 bg-slate-50 rounded-full">
                      <div className="h-full bg-red-400 w-[65%] rounded-full" />
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl border border-dashed border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Convenios Corporativos</span>
                      <span className="text-sm font-black text-green-500">$18,450</span>
                    </div>
                    <div className="h-1.5 bg-slate-50 rounded-full">
                      <div className="h-full bg-green-400 w-[40%] rounded-full" />
                    </div>
                  </div>
                  <button className="w-full py-4 text-xs font-bold text-perisur-blue bg-blue-50/50 rounded-2xl hover:bg-blue-50 transition-all">
                    Ver Reporte de Auditoría Completo
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "RECEPCIÓN":
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            {/* Reception Header & Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-1">Sala de Espera</h4>
                  <p className="text-2xl font-black text-perisur-gray">8 Pacientes</p>
                </div>
                <Users className="w-8 h-8 text-perisur-blue opacity-20" />
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-1">Próxima Cita</h4>
                  <p className="text-2xl font-black text-perisur-gray">15:30</p>
                </div>
                <Calendar className="w-8 h-8 text-perisur-blue opacity-20" />
              </div>
              <div className="bg-perisur-blue p-6 rounded-3xl shadow-lg shadow-blue-100 flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] transition-all">
                <Plus className="w-6 h-6 text-white" />
                <span className="text-white font-black text-sm uppercase">Nuevo Registro</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-perisur-gray">Buscador Inteligente</h2>
                  <p className="text-sm text-slate-400">Nombre, Teléfono o ID de Expediente</p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Búsqueda rápida..." 
                    className="pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm w-full md:w-80 outline-none focus:ring-2 focus:ring-perisur-blue transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="px-8 py-4">Expediente</th>
                      <th className="px-8 py-4">Servicio</th>
                      <th className="px-8 py-4">Fase/Pago</th>
                      <th className="px-8 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredPatients.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xs">
                              {p.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-black text-perisur-gray leading-tight mb-1">{p.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold tracking-wider">{p.id} • {p.gender} • {p.age}a</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <p className="text-sm font-bold text-slate-600 leading-tight">{p.study}</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">{p.doctor || "Particular"}</p>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <StatusBadge status={p.status} />
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${p.payment === "Pagado" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
                              {p.payment === "Pagado" ? "CAJA OK" : "PTE COBRO"}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            {p.payment === "Pendiente" ? (
                              <button className="p-2 bg-perisur-blue text-white rounded-lg shadow-sm hover:shadow-md transition-all">
                                <CreditCard className="w-4 h-4" />
                              </button>
                            ) : (
                              <button className="p-2 text-slate-300 hover:text-perisur-blue hover:bg-blue-50 rounded-lg transition-all">
                                <FileText className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-2 text-slate-300 hover:text-perisur-blue hover:bg-blue-50 rounded-lg transition-all">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-slate-50/50 flex justify-center">
                <button className="text-xs font-black text-perisur-blue flex items-center gap-2 hover:underline">
                  Ver Bitácora de Caja del Día <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case "QUÍMICO":
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-perisur-gray">Lista de Trabajo (Worklist)</h2>
                <p className="text-sm text-slate-400">Priorización de muestras y captura técnica</p>
              </div>
              <div className="flex bg-slate-50 p-1 rounded-xl">
                {["Todas", "Urgentes", "Rutina"].map(t => (
                  <button key={t} className={`px-4 py-2 rounded-lg text-xs font-bold ${t === "Todas" ? "bg-white shadow-sm text-perisur-blue" : "text-slate-400"}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {INITIAL_RECORDS.filter(p => p.status !== "Completado").map(p => (
                  <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl ${p.study.includes("Glucosa") ? "bg-red-50 text-red-600" : "bg-blue-50 text-perisur-blue"}`}>
                        <Beaker className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-perisur-gray">{p.name}</p>
                          {p.study.includes("Glucosa") && <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded">URGENTE</span>}
                        </div>
                        <p className="text-xs text-slate-400">{p.study} • {p.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={p.status} />
                      <button 
                        onClick={() => setSelectedPatient(p)}
                        className="px-4 py-2 bg-perisur-blue text-white rounded-xl text-xs font-bold hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        Validar <CheckCircle2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-perisur-gray mb-6">Acciones Rápidas</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                      <span className="text-xs font-bold">Imprimir Etiquetas (QR)</span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
                      <span className="text-xs font-bold">Cargar Lote de Equipo</span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 bg-perisur-blue/5 text-perisur-blue rounded-2xl border border-perisur-blue/20">
                      <span className="text-xs font-black">Liberación por Firma Digital</span>
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "INVENTARIO":
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard icon={<Package className="w-5 h-5" />} label="Insumos Totales" value="452 Unidades" color="bg-slate-100 text-slate-600" />
              <KPICard icon={<AlertTriangle className="w-5 h-5" />} label="Stock Crítico" value={REAGENTS.filter(r => r.stock < r.min).length.toString()} color="bg-red-50 text-red-600" />
              <KPICard icon={<Clock className="w-5 h-5" />} label="Caducidades 30d" value="3" color="bg-orange-50 text-orange-600" />
              <KPICard icon={<Users className="w-5 h-5" />} label="Proveedores" value="12 Activos" color="bg-blue-50 text-perisur-blue" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                  <h2 className="text-xl font-black text-perisur-gray">Control de Existencias</h2>
                  <div className="flex gap-2">
                    <button className="p-2.5 bg-slate-50 rounded-xl"><Plus className="w-5 h-5 text-slate-400" /></button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest px-8">
                      <tr>
                        <th className="px-8 py-4">Insumo</th>
                        <th className="px-8 py-4">Existencia</th>
                        <th className="px-8 py-4">Categoría</th>
                        <th className="px-8 py-4 text-right">Estatus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {REAGENTS.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-4">
                            <p className="font-bold text-sm text-perisur-gray">{r.name}</p>
                            <p className="text-[10px] text-slate-300 uppercase font-bold">{r.id}</p>
                          </td>
                          <td className="px-8 py-4">
                            <p className="text-sm font-medium text-slate-500">{r.stock} {r.unit}</p>
                            <p className="text-[10px] text-slate-400 font-bold">Mín: {r.min}</p>
                          </td>
                          <td className="px-8 py-4">
                            <span className="text-[10px] font-black border border-slate-100 px-2 py-0.5 rounded text-slate-400 uppercase">{r.category}</span>
                          </td>
                          <td className="px-8 py-4 text-right">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${r.stock < r.min ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${r.stock < r.min ? "bg-red-500" : "bg-green-500"}`} />
                              <span className="text-[10px] font-black uppercase">{r.stock < r.min ? "Bajo" : "OK"}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-perisur-gray mb-6 text-center">Alertas de Caducidad</h3>
                <div className="space-y-4">
                  {EXPIRATIONS.map((e, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-bold text-perisur-gray">{e.name}</p>
                        <span className={`w-2 h-2 rounded-full ${e.severity === 'high' ? 'bg-red-500 animate-pulse' : e.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{e.date}</p>
                    </div>
                  ))}
                  <button className="w-full py-4 bg-perisur-blue text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-100 mt-4">
                    Generar Órdenes de Compra
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "PACIENTE":
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="bg-gradient-to-r from-perisur-blue to-blue-700 p-10 rounded-3xl text-white shadow-xl shadow-blue-100 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-black mb-2">Bienvenido, Juan Pérez</h2>
                <p className="text-white/80 text-sm">Gestiona tus reportes clínicos y futuras citas.</p>
              </div>
              <div className="absolute right-0 bottom-0 opacity-10">
                <FlaskConical className="w-48 h-48 -mr-10 -mb-10" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-perisur-gray">Mis Resultados</h3>
                  <button className="text-xs font-bold text-perisur-blue flex items-center gap-2">Ver Todo <History className="w-4 h-4" /></button>
                </div>
                {INITIAL_RECORDS.filter(p => p.id === "PX-001" || p.id === "PX-002" || p.id === "PX-021").map(a => (
                  <div key={a.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:text-perisur-blue transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-perisur-gray text-sm leading-none mb-1">{a.study}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{a.date} • {a.doctor || "Particular"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <StatusBadge status={a.status} />
                      {a.status === "Completado" ? (
                        <button className="px-4 py-2 bg-perisur-blue text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-50 transition-all flex items-center gap-2">
                          Descargar PDF
                        </button>
                      ) : (
                        <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase">
                          No Disponible
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-lg font-black text-perisur-gray mb-6">Guía de Preparación</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 rounded-2xl flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-black text-orange-800 mb-1">Próximo Estudio: Perfil de Lípidos</p>
                        <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                          Requiere ayuno mínimo de 12 horas. No consumir alcohol 24 horas antes.
                        </p>
                      </div>
                    </div>
                    <button className="w-full py-4 bg-slate-50 text-perisur-gray rounded-2xl text-[10px] font-black uppercase hover:bg-white border border-transparent hover:border-slate-100 transition-all">
                      Ver Todas las Instrucciones
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "MÉDICO":
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <KPICard icon={<ClipboardList className="w-5 h-5" />} label="Pacientes Referidos" value="156" color="bg-blue-50 text-perisur-blue" />
              <KPICard icon={<Activity className="w-5 h-5" />} label="Estudios Críticos" value="4" color="bg-red-50 text-red-600" />
              <KPICard icon={<CheckCircle2 className="w-5 h-5" />} label="Resultados Listos" value="12" color="bg-green-50 text-green-600" />
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-50">
                  <h2 className="text-xl font-black text-perisur-gray">Pacientes Refiridos</h2>
                  <p className="text-sm text-slate-400">Seguimiento de resultados de población asignada</p>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest px-8">
                      <tr>
                        <th className="px-8 py-4">Paciente</th>
                        <th className="px-8 py-4">Estudio</th>
                        <th className="px-8 py-4">Fecha</th>
                        <th className="px-8 py-4 text-right">Estatus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {INITIAL_RECORDS.filter(p => p.doctor === "Dr. Morales" || !p.doctor).map(p => (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-8 py-4">
                            <span className="font-bold text-sm text-perisur-gray">{p.name}</span>
                          </td>
                          <td className="px-8 py-4 text-sm text-slate-500">{p.study}</td>
                          <td className="px-8 py-4 text-sm text-slate-400">{p.date}</td>
                          <td className="px-8 py-4 text-right">
                            <div className="flex items-center justify-end gap-3 text-right">
                              <StatusBadge status={p.status} />
                              {p.status === "Completado" && (
                                <button className="text-perisur-blue p-2 hover:bg-blue-50 rounded-lg">
                                  <FileText className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
          <button 
            onClick={() => setCurrentRole(null)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-perisur-blue/5 border border-perisur-blue/10 text-xs font-black text-perisur-blue hover:bg-perisur-blue hover:text-white transition-all mb-3"
          >
            <UserCircle className="w-4 h-4" />
            Cambiar de Rol
          </button>
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
            <div className="lg:hidden flex items-center">
              <img src="https://cossma.com.mx/diagnosticos.png" alt="Logo" className="h-10 object-contain mr-2" />
            </div>
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
                {(["ADMINISTRADOR", "RECEPCIÓN", "QUÍMICO", "INVENTARIO", "PACIENTE", "MÉDICO"] as UserRole[]).map(r => (
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
