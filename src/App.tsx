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
  Home,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  CreditCard,
  History,
  Info,
  Settings,
  Shield,
  Gift,
  Target,
  MessageSquare,
  Truck,
  Star,
  Bug,
  Wrench,
  QrCode,
  Cpu,
  FileSignature,
  Map,
  Mail,
  AlertCircle,
  ArrowDownToLine
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
  Line,
  ReferenceLine
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
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"summary" | "processing" | "success">("summary");
  const [invoiceStatus, setInvoiceStatus] = useState<"idle" | "generating" | "sent">("idle");
  const [showCashLogModal, setShowCashLogModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
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

  const getModulesForRole = (role: UserRole): { id: string, label: string, icon: React.ReactNode }[] => {
    switch (role) {
      case "ADMINISTRADOR":
        return [
          { id: "Dashboard", label: "Dashboard Analítico", icon: <LayoutDashboard /> },
          { id: "Auditoria", label: "Auditoría (Logs)", icon: <Shield /> },
          { id: "Marketing", label: "Marketing y Lealtad", icon: <Gift /> },
          { id: "Metas", label: "Metas Sucursal", icon: <Target /> },
          { id: "RRHH", label: "Recursos Humanos", icon: <Users /> },
          { id: "Finanzas", label: "Finanzas", icon: <DollarSign /> },
        ];
      case "RECEPCIÓN":
        return [
          { id: "Dashboard", label: "Registro Pacientes", icon: <Users /> },
          { id: "Notificaciones", label: "Notificaciones Omnicanal", icon: <MessageSquare /> },
          { id: "Maquila", label: "Recepción Maquila", icon: <Truck /> },
          { id: "Satisfaccion", label: "Encuestas Satisfacción", icon: <Star /> },
          { id: "Caja", label: "Caja y Cotizaciones", icon: <CreditCard /> },
          { id: "Agenda", label: "Agenda Citas", icon: <Calendar /> },
        ];
      case "QUÍMICO":
        return [
          { id: "Dashboard", label: "Gestión de Muestras", icon: <FlaskConical /> },
          { id: "Calidad", label: "Control de Calidad (QC)", icon: <Activity /> },
          { id: "Microbiologia", label: "Microbiología", icon: <Bug /> },
          { id: "Repeticiones", label: "Gestión de Repeticiones", icon: <History /> },
          { id: "Validacion", label: "Firma Digital", icon: <CheckCircle2 /> },
        ];
      case "INVENTARIO":
        return [
          { id: "Dashboard", label: "Control de Stock", icon: <Package /> },
          { id: "Mantenimiento", label: "Mantenimiento Preventivo", icon: <Wrench /> },
          { id: "Requisiciones", label: "Requisiciones Internas", icon: <ClipboardList /> },
          { id: "Caducidades", label: "Caducidades", icon: <AlertTriangle /> },
          { id: "Proveedores", label: "Proveedores", icon: <Users /> },
        ];
      case "PACIENTE":
        return [
          { id: "Dashboard", label: "Resultados Online", icon: <FileText /> },
          { id: "PreRegistro", label: "Pre-registro QR", icon: <QrCode /> },
          { id: "IAInterpretacion", label: "Interpretación IA", icon: <Cpu /> },
          { id: "Preparacion", label: "Preparación", icon: <Info /> },
        ];
      case "MÉDICO":
        return [
          { id: "Dashboard", label: "Seguimiento", icon: <Users /> },
          { id: "Solicitud", label: "Solicitud Electrónica", icon: <FileSignature /> },
          { id: "Epidemiologia", label: "Epidemiología Local", icon: <Map /> },
          { id: "Estadisticas", label: "Estadísticas Salud", icon: <TrendingUp /> },
        ];
      default:
        return [];
    }
  };

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

  const renderModule = () => {
    switch (currentRole) {
      case "ADMINISTRADOR":
        if (activeModule === "Auditoria") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-perisur-gray">Bitácora de Auditoría (Logs)</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert("Generando reporte de auditoría en formato Excel/CSV...")}
                      className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-colors"
                    ><ArrowDownToLine className="w-4 h-4" /> Exportar</button>
                    <button 
                      onClick={() => alert("Abriendo filtros avanzados de auditoría...")}
                      className="px-4 py-2 bg-perisur-blue text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                    >Filtro Avanzado</button>
                  </div>
                </div>
                <div className="overflow-x-auto -mx-8 px-8">
                  <div className="min-w-[600px] space-y-4">
                    {[
                      { user: "Jesús Armengol", action: "Modificó resultado Glucosa", patient: "PX-001", time: "14:22:10", ip: "189.210.34.12", risk: "low" },
                      { user: "María Ortiz", action: "Eliminó registro de pago", patient: "PX-005", time: "13:45:05", ip: "189.210.34.15", risk: "high" },
                      { user: "Carlos Pérez", action: "Liberó firma digital lote #44", patient: "N/A", time: "12:30:12", ip: "189.210.34.18", risk: "low" },
                    ].map((log, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-6">
                          <div className={`w-1 h-10 rounded-full ${log.risk === 'high' ? 'bg-red-500' : 'bg-green-500'}`} />
                          <div>
                            <p className="text-sm font-black text-perisur-gray">{log.user}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.action} • {log.patient}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-perisur-blue">{log.time}</p>
                          <p className="text-[10px] text-slate-300 font-mono">IP: {log.ip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Marketing") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-perisur-gray mb-8">Programas de Lealtad</h3>
                  <div className="space-y-6">
                    <div className="p-6 bg-perisur-blue/5 rounded-3xl border border-perisur-blue/10">
                      <p className="text-[10px] font-black text-perisur-blue uppercase mb-2">Campaña Activa</p>
                      <h4 className="text-lg font-black text-perisur-gray mb-4">Check-up Primaveral</h4>
                      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-500">20% Descuento en Perfil Bio</p>
                        <span className="text-[10px] font-black text-perisur-blue">84 Canjeados</span>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Pacientes Frecuentes (VIP)</p>
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />)}
                        </div>
                        <p className="text-xs font-bold text-slate-400">+128 pacientes Premium</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-perisur-gray mb-8">Seguimiento de Conversión</h3>
                  <div className="h-48 flex items-end gap-3 justify-between">
                    {[65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-xl bg-perisur-blue/20 relative group hover:bg-perisur-blue transition-all" style={{ height: `${h}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-perisur-gray text-white text-[10px] px-2 py-1 rounded font-black whitespace-nowrap">{h}% Conv.</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-6">Rendimiento Últimos 7 Días</p>
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Metas") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-perisur-gray mb-10">Metas de Sucursal • Mayo 2026</h3>
                <div className="space-y-12">
                  {[
                    { label: "Volumen de Ventas", current: "$450k", target: "$600k", progress: 75, color: "bg-perisur-blue" },
                    { label: "Nuevos Pacientes", current: "1,240", target: "1,500", progress: 82, color: "bg-emerald-500" },
                    { label: "Estudios Especializados", current: "84", target: "200", progress: 42, color: "bg-orange-500" },
                  ].map((meta, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex justify-between items-end">
                        <p className="font-black text-perisur-gray">{meta.label}</p>
                        <p className="text-xs font-black text-slate-400">{meta.current} <span className="text-slate-300">/</span> {meta.target}</p>
                      </div>
                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${meta.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${meta.color} rounded-full`} 
                        />
                      </div>
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{meta.progress}% Alcanzado</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "RRHH") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-perisur-gray">Control de Asistencia y Turnos</h3>
                  <button 
                    onClick={() => setShowRoleModal(true)}
                    className="bg-perisur-blue text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-[1.02] transition-all"
                  >
                    Gestionar Roles
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ATTENDANCE.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-perisur-blue font-black border border-slate-100">
                          {p.staff.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-perisur-gray">{p.staff}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.role} • Turno Matutino</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                          p.status === "Presente" ? "bg-green-100 text-green-700" : p.status === "Retraso" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"
                        }`}>
                          {p.status}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-2 font-mono">Entrada: {p.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Finanzas") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-perisur-gray mb-8">Reporte de Gastos e Inversión</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-red-50/50 rounded-3xl border border-red-100">
                      <div>
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Compra de Reactivos</p>
                        <p className="text-2xl font-black text-perisur-gray">$34,200 <span className="text-xs font-normal text-slate-400">MXN</span></p>
                      </div>
                      <ArrowUpRight className="w-8 h-8 text-red-200" />
                    </div>
                    <div className="flex items-center justify-between p-6 bg-green-50/50 rounded-3xl border border-green-100">
                      <div>
                        <p className="text-[10px] font-black text-green-400 uppercase tracking-widest mb-1">Ventas Brutas</p>
                        <p className="text-2xl font-black text-perisur-gray">${stats.revenue} <span className="text-xs font-normal text-slate-400">MXN</span></p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-200" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h3 className="text-xl font-black text-perisur-gray mb-8">Convenios y Aseguradoras</h3>
                  <div className="space-y-4">
                    {[
                      { name: "AXA Seguros", status: "Activo", coverage: "350 estudios/mes" },
                      { name: "MetLife", status: "Activo", coverage: "120 estudios/mes" },
                      { name: "GNP Médica", status: "Renovación", coverage: "Saldo Pte." },
                    ].map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-2xl group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-perisur-blue group-hover:text-white transition-all">
                            <Package className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-perisur-gray">{c.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{c.coverage}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${c.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {c.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }

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
        if (activeModule === "Notificaciones") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-3xl">
                <h3 className="text-xl font-black text-perisur-gray mb-8">Notificación de Resultados Omnicanal</h3>
                <div className="space-y-6">
                  {[
                    { id: 1, patient: "Juan Pérez García", study: "Biometría Hemática", status: "Liberado", phone: "+52 55 1234 5678", email: "juan@example.com" },
                    { id: 2, patient: "Sofía López Portillo", study: "Perfil Tiroideo", status: "Liberado", phone: "+52 55 8765 4321", email: "sofia@example.com" },
                  ].map((notif, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-black text-perisur-gray text-sm">{notif.patient}</p>
                          <span className="text-[10px] font-black uppercase text-green-600 bg-green-100 px-2 py-0.5 rounded">Listo</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">{notif.study}</p>
                        <div className="flex gap-4">
                          <button 
                            disabled={isDownloading}
                            onClick={() => {
                              setIsDownloading(true);
                              setTimeout(() => {
                                setIsDownloading(false);
                                alert("¡WhatsApp enviado con éxito a " + notif.phone + "!");
                              }, 1500);
                            }}
                            className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl hover:bg-emerald-100 transition-all disabled:opacity-50"
                          >
                             <MessageSquare className="w-3.5 h-3.5" /> {isDownloading ? "Enviando..." : "WhatsApp"}
                          </button>
                          <button 
                            disabled={isDownloading}
                            onClick={() => {
                              setIsDownloading(true);
                              setTimeout(() => {
                                setIsDownloading(false);
                                alert("Reporte enviado al correo: " + notif.email);
                              }, 1500);
                            }}
                            className="flex items-center gap-2 text-[10px] font-black text-perisur-blue bg-blue-50 px-3 py-2 rounded-xl hover:bg-blue-100 transition-all disabled:opacity-50"
                          >
                             <Mail className="w-3.5 h-3.5" /> {isDownloading ? "Enviando..." : "E-mail"}
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Último Aviso</p>
                         <p className="text-[10px] text-slate-400">Hace 2 horas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Maquila") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-perisur-gray">Gestión de Maquila</h3>
                  <button 
                    onClick={() => setShowNewMaquilaModal(true)}
                    className="px-5 py-2 bg-perisur-blue text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Nueva Salida
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { lab: "Laboratorios Centralizados", study: "TAMIZ METABOLICO", tracking: "TRK-847291-A", date: "Hoy 14:00" },
                    { lab: "Genética Especializada", study: "ESTUDIO CITOGENETICO", tracking: "TRK-229381-C", date: "Ayer 10:30" },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-perisur-blue shadow-sm">
                          <Truck className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-perisur-gray">{m.lab}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{m.study}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-perisur-blue mb-1">{m.tracking}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Recolectado: {m.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Satisfaccion") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl mx-auto text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-50 rounded-[2.5rem] flex items-center justify-center text-amber-500 mx-auto mb-6">
                  <Star className="w-8 h-8 sm:w-10 sm:h-10 fill-amber-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-perisur-gray mb-4">Encuesta de Satisfacción</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-10 font-bold uppercase tracking-widest">¿Cómo calificaría su atención hoy?</p>
                <div className="flex justify-center gap-2 sm:gap-4 mb-10">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} className="p-3 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-3xl hover:bg-perisur-blue hover:text-white group transition-all border border-transparent hover:border-blue-100">
                       <Star className="w-6 h-6 sm:w-10 sm:h-10 group-hover:fill-white text-perisur-blue transition-colors" />
                       <span className="block mt-2 text-[10px] sm:text-xs font-black">{star}</span>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => alert("¡Gracias por su opinión! Hemos registrado su calificación.")}
                  className="w-full py-4 sm:py-5 bg-perisur-gray text-white rounded-[2rem] text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-100"
                >
                  Finalizar Atención
                </button>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm max-w-4xl mx-auto">
                <h3 className="text-lg font-black text-perisur-gray mb-6">Resultados Recientes</h3>
                <div className="space-y-4">
                  {[
                    { patient: "A. García", rating: 5, comment: "Excelente atención y rapidez.", date: "Hoy" },
                    { patient: "M. Soto", rating: 4, comment: "Todo bien, solo un poco de espera en caja.", date: "Ayer" },
                    { patient: "L. Mendoza", rating: 5, comment: "Muy profesionales los químicos.", date: "03 May" }
                  ].map((rev, i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 rounded-2xl gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className={`w-3 h-3 ${idx < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <p className="text-xs font-black text-perisur-gray">{rev.patient}</p>
                      </div>
                      <p className="text-xs text-slate-500 italic">"{rev.comment}"</p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase">{rev.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Caja") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-perisur-gray mb-8">Caja y Procesamiento de Pagos</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total a Cobrar</p>
                      <p className="text-5xl font-black text-perisur-gray">$1,250.00</p>
                    </div>
                    {paymentStep === "summary" && (
                      <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => {
                            setPaymentStep("processing");
                            setTimeout(() => setPaymentStep("success"), 2500);
                          }}
                          className="p-6 border-2 border-perisur-blue/20 rounded-3xl flex flex-col items-center gap-3 hover:bg-perisur-blue/5 transition-all group"
                        >
                          <CreditCard className="w-8 h-8 text-perisur-blue group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-black uppercase tracking-wider">Tarjeta</span>
                        </button>
                        <button 
                          onClick={() => {
                             setPaymentStep("processing");
                             setTimeout(() => setPaymentStep("success"), 1500);
                          }}
                          className="p-6 border-2 border-slate-200 rounded-3xl flex flex-col items-center gap-3 hover:bg-slate-50 transition-all group"
                        >
                          <DollarSign className="w-8 h-8 text-slate-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-black uppercase tracking-wider">Efectivo</span>
                        </button>
                      </div>
                    )}
                    {paymentStep === "processing" && (
                      <div className="flex flex-col items-center justify-center p-12 bg-perisur-blue/5 rounded-3xl border border-dashed border-perisur-blue/20">
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="mb-4"
                        >
                          <Activity className="w-10 h-10 text-perisur-blue" />
                        </motion.div>
                        <p className="text-sm font-black text-perisur-blue uppercase tracking-widest">Procesando Transacción...</p>
                      </div>
                    )}
                    {paymentStep === "success" && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center justify-center p-12 bg-green-50 rounded-3xl border border-green-100"
                      >
                        <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                        <p className="text-sm font-black text-green-700 uppercase tracking-widest mb-6">¡Venta Exitosa!</p>
                        <button 
                          onClick={() => setPaymentStep("summary")}
                          className="px-6 py-2 bg-white text-green-700 rounded-xl text-[10px] font-black uppercase shadow-sm"
                        >
                          Nuevo Cobro
                        </button>
                      </motion.div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Resumen de Cotización</h4>
                    <div className="space-y-2 bg-slate-50 p-6 rounded-3xl">
                      {[
                        { item: "Biometría Hemática", price: "$450" },
                        { item: "Química Sanguínea (6)", price: "$800" },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between py-3 border-b border-white/50 last:border-0 text-sm">
                          <span className="font-bold text-slate-600">{item.item}</span>
                          <span className="font-black text-perisur-gray">{item.price}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-slate-100">
                      {invoiceStatus === "idle" && (
                        <button 
                          disabled={paymentStep !== "success"}
                          onClick={() => {
                            setInvoiceStatus("generating");
                            setTimeout(() => setInvoiceStatus("sent"), 3000);
                          }}
                          className={`${paymentStep !== "success" ? "bg-slate-100 text-slate-400 grayscale" : "bg-perisur-blue text-white shadow-lg shadow-blue-100"} w-full py-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:scale-[1.01]`}
                        >
                          <FileText className="w-4 h-4" /> Emitir Factura Electrónica
                        </button>
                      )}
                      {invoiceStatus === "generating" && (
                        <div className="w-full py-5 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center gap-3">
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Activity className="w-4 h-4" /></motion.div>
                          <span className="text-xs font-black uppercase tracking-widest">Generando Timbrado CFDI...</span>
                        </div>
                      )}
                      {invoiceStatus === "sent" && (
                        <motion.div 
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center"
                        >
                          <p className="text-xs font-black text-emerald-700 uppercase tracking-widest mb-1">Factura Enviada</p>
                          <p className="text-[10px] text-emerald-600 font-medium mb-4">PDF y XML enviados al correo del paciente.</p>
                          <button onClick={() => setInvoiceStatus("idle")} className="text-[10px] font-black text-emerald-700 underline uppercase">Emitir otra</button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Agenda") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                  <h3 className="text-xl font-black text-perisur-gray">Agenda de Citas y Tomas</h3>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-50 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:text-perisur-blue transition-colors">Hoy</button>
                    <button 
                      onClick={() => setShowNewAppointmentModal(true)}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-perisur-blue text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-100 hover:scale-[1.05] transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Nueva Cita
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto -mx-8 px-8">
                  <div className="min-w-[600px] space-y-4">
                    {[
                      { time: "09:00 AM", patient: "Lucía Torres", study: "Domicilio", status: "Confirmado" },
                      { time: "10:30 AM", patient: "Eduardo Ruiz", study: "Sucursal", status: "En Camino" },
                      { time: "11:15 AM", patient: "Rosa Ibarra", study: "Sucursal", status: "Pendiente" },
                    ].map((cite, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100">
                        <div className="flex items-center gap-6">
                          <div className="text-center w-24">
                            <p className="text-sm font-black text-perisur-blue">{cite.time}</p>
                            <p className="text-[9px] font-bold text-slate-300 uppercase">05 MAY 2026</p>
                          </div>
                          <div className="w-px h-10 bg-slate-200" />
                          <div>
                            <p className="text-sm font-black text-perisur-gray">{cite.patient}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{cite.study}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full ${cite.status === 'Confirmado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                          {cite.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        }

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
              <button 
                onClick={() => setShowNewPatientModal(true)}
                className="bg-perisur-blue p-6 rounded-3xl shadow-lg shadow-blue-100 flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.02] transition-all text-white border-none"
              >
                <Plus className="w-6 h-6" />
                <span className="font-black text-sm uppercase">Nuevo Registro</span>
              </button>
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
              <div className="overflow-x-auto -mx-8 px-8">
                <table className="w-full text-left min-w-[800px]">
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
                <button 
                  onClick={() => setShowCashLogModal(true)}
                  className="text-xs font-black text-perisur-blue flex items-center gap-2 hover:underline"
                >
                  Ver Bitácora de Caja del Día <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );

      case "QUÍMICO":
        if (activeModule === "Calidad") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-perisur-gray mb-10">Control de Calidad Diario (QC)</h3>
                <div className="h-64 mb-10 border-b border-slate-50">
                   <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { x: 1, val: 98 }, { x: 2, val: 102 }, { x: 3, val: 95 }, 
                      { x: 4, val: 105 }, { x: 5, val: 110 }, { x: 6, val: 97 }, 
                      { x: 7, val: 100 }, { x: 8, val: 92 }, { x: 9, val: 103 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis hide />
                      <YAxis domain={[80, 120]} />
                      <ReferenceLine y={100} stroke="#3b82f6" strokeWidth={2} label={{ position: 'right', value: 'Media', fill: '#3b82f6', fontSize: 10 }} />
                      <ReferenceLine y={110} stroke="#f59e0b" strokeDasharray="5 5" />
                      <ReferenceLine y={90} stroke="#f59e0b" strokeDasharray="5 5" />
                      <ReferenceLine y={120} stroke="#ef4444" strokeDasharray="5 5" />
                      <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="5 5" />
                      <Line type="monotone" dataKey="val" stroke="#000" strokeWidth={3} dot={{ r: 5, fill: "#000" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Glucosa LVJ", status: "OK", sd: "0.8" },
                    { label: "Colesterol LVJ", status: "OK", sd: "1.2" },
                    { label: "Triglicéridos LVJ", status: "Alerta 1S", sd: "2.1" },
                    { label: "Ácido Úrico LVJ", status: "OK", sd: "0.5" },
                  ].map((qc, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-black text-perisur-gray uppercase mb-1">{qc.label}</p>
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${qc.status === 'OK' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{qc.status}</span>
                        <p className="text-[10px] font-mono font-bold text-slate-400">{qc.sd} SD</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => alert("Registrando corrida de calidad... Los resultados se reflejarán en las gráficas de Levey-Jennings.")}
                  className="w-full py-4 mt-8 bg-perisur-blue text-white rounded-2xl text-xs font-black uppercase hover:bg-blue-700 transition-all"
                >
                  Registrar Corrida de Calidad
                </button>
              </div>
            </div>
          );
        }

        if (activeModule === "Microbiologia") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-perisur-gray mb-8">Gestión de Cultivos y Antibiogramas</h3>
                <div className="space-y-4">
                  {[
                    { patient: "Ismael Vega", sample: "Urocultivo", day: "2", status: "Crecimiento Detectado", info: "Posible E. Coli" },
                    { patient: "Carmen Solis", sample: "Exudado Faríngeo", day: "1", status: "Sin Crecimiento", info: "Incubando 37°C" },
                  ].map((c, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-perisur-blue shadow-lg rounded-2xl flex items-center justify-center text-white"><Bug className="w-6 h-6" /></div>
                        <div>
                          <p className="font-black text-perisur-gray text-sm">{c.patient}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{c.sample}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="text-center">
                            <p className="text-[10px] font-black text-slate-300 uppercase mb-1">Día Incubación</p>
                            <p className="text-sm font-black text-perisur-blue">{c.day}</p>
                         </div>
                         <div className="text-right">
                           <span className={`text-[10px] font-black px-3 py-1 rounded-full ${c.status.includes('Detectado') ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                             {c.status}
                           </span>
                           <p className="text-[10px] text-slate-400 mt-2 font-medium">{c.info}</p>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Repeticiones") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-perisur-gray mb-8">Control Interno de Repeticiones y Mermas</h3>
                <div className="space-y-4">
                   {[
                    { reason: "Muestra Hemolizada", count: 12, cost: "$580.00", trend: "+2%" },
                    { reason: "Dilución Insuficiente", count: 8, cost: "$340.00", trend: "-10%" },
                    { reason: "Valor Incoherente", count: 15, cost: "$1,100.00", trend: "0%" },
                   ].map((m, i) => (
                     <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl group hover:bg-white transition-all border border-transparent hover:border-slate-100">
                        <div>
                           <p className="text-sm font-black text-perisur-gray">{m.reason}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase">{m.count} Eventos en el Mes</p>
                        </div>
                        <div className="flex items-center gap-6">
                           <div className="text-right">
                              <p className="text-xs font-black text-perisur-gray">Costo Merma</p>
                              <p className="text-[10px] text-red-400 font-black tracking-widest">{m.cost} MXN</p>
                           </div>
                           <TrendingDown className="w-5 h-5 text-red-200" />
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Validacion") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-perisur-gray mb-2">Validación y Firma Digital</h3>
                <p className="text-slate-500 mb-8 font-medium">Hay 12 reportes pendientes de revisión técnica para liberación final.</p>
                <div className="space-y-4 text-left">
                  <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Certificado Activo</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center text-slate-300 italic font-serif">
                        JA
                      </div>
                      <div>
                        <p className="text-sm font-black text-perisur-gray">Q.F.B. Jesús Armengol</p>
                        <p className="text-[10px] text-slate-400 font-bold">Cédula: 847293-A • Vigente</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsSigning(true);
                      setTimeout(() => {
                        setIsSigning(false);
                        alert("Lote de 12 reportes validado y firmado digitalmente.");
                      }, 2000);
                    }}
                    disabled={isSigning}
                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 overflow-hidden relative"
                  >
                    {isSigning ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Activity className="w-4 h-4" /></motion.div>
                        Firmando con Certificado...
                      </>
                    ) : (
                      <>Liberar Lote con mi Firma <Save className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        }

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
        if (activeModule === "Mantenimiento") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-perisur-gray mb-8">Mantenimiento de Activos Fijos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { asset: "Analizador Bioq. Siemens", next: "15 Mayo", status: "Vigente", color: "bg-green-100 text-green-700" },
                    { asset: "Frigo #2 (Biológicos)", next: "Hoy", status: "URGENTE", color: "bg-red-100 text-red-700 shadow-lg shadow-red-50" },
                    { asset: "Centrifuga Clinica B", next: "28 Mayo", status: "Vigente", color: "bg-green-100 text-green-700" },
                  ].map((a, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:scale-[1.02] transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-perisur-blue"><Wrench className="w-5 h-5" /></div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${a.color}`}>{a.status}</span>
                      </div>
                      <h4 className="font-black text-perisur-gray text-sm mb-1">{a.asset}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Próxima Fecha: {a.next}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Requisiciones") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-perisur-gray">Requisiciones Internas Digitales</h3>
                  <div className="flex bg-slate-50 p-1 rounded-xl">
                    <button className="px-4 py-2 bg-white rounded-lg text-[10px] font-black uppercase shadow-sm">Pendientes (4)</button>
                    <button className="px-4 py-2 text-[10px] font-black uppercase text-slate-300">Surtidas</button>
                  </div>
                </div>
                <div className="space-y-4">
                   {[
                    { source: "Área de Químicos", items: "Tiras Reactivas (20), Tubos EDTA (50)", priority: "Normal", time: "10:15 AM" },
                    { source: "Microbiología", items: "Cajas de Petri (100), Agar Sangre (50)", priority: "Urgente", time: "09:30 AM" },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl group hover:border-blue-100 border border-transparent transition-all">
                      <div className="flex items-center gap-4">
                        <input type="checkbox" className="w-5 h-5 accent-perisur-blue rounded-lg border-slate-300" defaultChecked />
                        <div className="w-12 h-12 bg-white rounded-[1.5rem] flex items-center justify-center text-perisur-blue shadow-sm"><ClipboardList className="w-6 h-6" /></div>
                        <div>
                          <p className="text-sm font-black text-perisur-gray">{req.source}</p>
                          <p className="text-[10px] text-slate-400 font-bold max-w-sm">{req.items}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <span className={`text-[10px] font-black px-3 py-1 rounded-full ${req.priority === 'Urgente' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-200 text-slate-600'}`}>{req.priority}</span>
                         <p className="text-[10px] text-slate-400 mt-2 font-mono">{req.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  disabled={isDownloading}
                  onClick={() => {
                    setIsDownloading(true);
                    setTimeout(() => {
                      setIsDownloading(false);
                      alert("¡Material liberado del almacén! Valide la recepción física con el área solicitante.");
                    }, 2000);
                  }}
                  className="w-full py-4 mt-8 bg-perisur-blue text-white rounded-3xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-100 disabled:opacity-50"
                >
                  {isDownloading ? "REGISTRANDO SALIDA..." : "Liberar Material Seleccionado"}
                </button>
              </div>
            </div>
          );
        }

        if (activeModule === "Caducidades") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-perisur-gray mb-8">Alertas de Caducidad Crítica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {EXPIRATIONS.map((e, i) => (
                    <div key={i} className={`p-6 rounded-3xl border ${e.severity === 'high' ? 'bg-red-50 border-red-100' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl ${e.severity === 'high' ? 'bg-red-100 text-red-600' : 'bg-white text-slate-400'}`}>
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${e.severity === 'high' ? 'bg-red-200 text-red-700' : 'bg-slate-200 text-slate-600'}`}>
                          {e.date}
                        </span>
                      </div>
                      <h4 className="font-black text-perisur-gray mb-1">{e.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-4">Lote: L-84729A</p>
                      <button className="text-[10px] font-black text-perisur-blue uppercase hover:underline">Solicitar Reposición</button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setShowPOModal(true)}
                  className="w-full py-5 bg-perisur-blue text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-100 flex items-center justify-center gap-3 hover:scale-[1.01] transition-all"
                >
                  <Plus className="w-5 h-5" /> Generar Órdenes de Compra
                </button>
              </div>
            </div>
          );
        }

        if (activeModule === "Proveedores") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-perisur-gray">Directorio de Proveedores</h3>
                  <button 
                    onClick={() => setShowPOModal(true)}
                    className="px-5 py-2.5 bg-perisur-blue text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-100 hover:scale-[1.05] transition-all"
                  >
                    Nueva Orden de Compra
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Sistemas Diagnósticos MX", contact: "Ventas (55) 1234-5678", email: "ventas@diagmex.com" },
                    { name: "Equipos Médicos Perisur", contact: "Soporte (55) 8765-4321", email: "tech@perisurequip.com" },
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-perisur-blue font-black border border-slate-100">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-perisur-gray">{p.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{p.contact}</p>
                        </div>
                      </div>
                      <button className="text-xs font-bold text-perisur-blue hover:underline">{p.email}</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

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
                <div className="overflow-x-auto -mx-8 px-8">
                  <table className="w-full text-left min-w-[700px]">
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
                  <button 
                    onClick={() => setShowPOModal(true)}
                    className="w-full py-4 bg-perisur-blue text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-100 mt-4"
                  >
                    Generar Órdenes de Compra
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case "PACIENTE":
        if (activeModule === "PreRegistro") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm max-w-md mx-auto text-center border-b-8 border-b-perisur-blue">
                <div className="w-24 h-24 bg-slate-50 flex items-center justify-center rounded-[2rem] mx-auto mb-10 shadow-inner overflow-hidden">
                  {isDownloading ? (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-white p-2 rounded-xl border border-slate-100"
                    >
                      <QrCode className="w-full h-full text-perisur-gray" />
                    </motion.div>
                  ) : (
                    <QrCode className="w-16 h-16 text-slate-200" />
                  )}
                </div>
                <h3 className="text-2xl font-black text-perisur-gray mb-2">Pase Express QR</h3>
                <p className="text-sm text-slate-400 mb-8 font-medium italic">De clic para generar su código y ahorrar tiempo en recepción.</p>
                <div className="p-8 bg-perisur-blue/5 rounded-3xl border border-dashed border-perisur-blue/20 mb-8">
                  <p className="text-[11px] font-black text-perisur-blue uppercase leading-relaxed tracking-wider">Muestre este código al llegar a su sucursal de Perisur para un registro inmediato.</p>
                </div>
                <button 
                   disabled={isDownloading}
                   onClick={() => {
                     setIsDownloading(true);
                     setTimeout(() => {
                       alert("¡Código QR generado con éxito! Puede descargarlo o presentarlo directamente en tableta.");
                     }, 1000);
                   }}
                   className="w-full py-5 bg-perisur-blue text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-50"
                >
                   {isDownloading ? "GENERANDO..." : "Generar Mi QR"}
                </button>
              </div>
            </div>
          );
        }

        if (activeModule === "IAInterpretacion") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm overflow-hidden border-t-8 border-t-emerald-500">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-100 shadow-sm animate-pulse">
                     <Cpu className="w-8 h-8" />
                   </div>
                   <div>
                     <h3 className="text-xl font-black text-perisur-gray">Explicación Simplificada (IA)</h3>
                     <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest leading-none">Powered by Gemini Medical Insights</p>
                   </div>
                </div>
                <div className="space-y-8">
                   <div className="space-y-4">
                     <h4 className="font-black text-perisur-gray flex items-center gap-2">
                       <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Glucosa 95 mg/dL
                     </h4>
                     <p className="text-sm border-l-4 border-emerald-500 pl-4 py-2 bg-slate-50/50 rounded-r-2xl leading-relaxed text-slate-600 italic">
                        "Sus niveles de glucosa están en rangos óptimos. Esto indica un excelente metabolismo del azúcar en sangre de acuerdo a un ayuno de 12h."
                     </p>
                   </div>
                   <div className="space-y-4">
                     <h4 className="font-black text-perisur-gray flex items-center gap-2">
                       <AlertCircle className="w-5 h-5 text-amber-500" /> Colesterol Total 240 mg/dL
                     </h4>
                     <p className="text-sm border-l-4 border-amber-500 pl-4 py-2 bg-slate-50/50 rounded-r-2xl leading-relaxed text-slate-600 italic">
                        "Detectamos una leve elevación en grasas. No es crítico, pero le sugerimos reducir el consumo de alimentos procesados y llevar este reporte a su cardiólogo pronto."
                     </p>
                   </div>
                </div>
                <div className="mt-12 p-6 bg-perisur-gray rounded-3xl text-white">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">Nota Importante</p>
                   <p className="text-[10px] italic leading-relaxed text-slate-100 opacity-80">Esta interpretación es informativa y no sustituye un diagnóstico médico. Siempre consulte a su especialista antes de tomar decisiones sobre su salud.</p>
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Preparacion") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-perisur-gray mb-6">Instrucciones de Preparación</h3>
                <div className="space-y-6">
                  <div className="p-6 bg-perisur-blue/5 rounded-3xl border border-perisur-blue/10">
                    <h4 className="font-black text-perisur-blue mb-2 flex items-center gap-2">
                       <Info className="w-5 h-5" /> Perfil Bioquímico
                    </h4>
                    <ul className="text-sm font-medium text-slate-600 space-y-3">
                      <li>• Ayuno estricto de 12 horas (puede beber solo agua simple).</li>
                      <li>• No realizar ejercicio intenso 24 horas antes.</li>
                      <li>• Informar al químico si está tomando algún medicamento.</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl">
                    <h4 className="font-black text-slate-400 mb-2 uppercase text-[10px] tracking-widest">Recolecta de Orina (EGO)</h4>
                    <p className="text-sm font-medium text-slate-600">Primer chorro de la primera orina de la mañana. Frasco estéril solicitado en mostrador.</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

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
                        <button 
                          onClick={() => {
                            setIsDownloading(true);
                            setTimeout(() => {
                              setIsDownloading(false);
                              alert("Descargando resultado: " + a.study + ".pdf");
                            }, 2000);
                          }}
                          disabled={isDownloading}
                          className="px-4 py-2 bg-perisur-blue text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-blue-50 transition-all flex items-center gap-2"
                        >
                          {isDownloading ? "DESCARGANDO..." : "Descargar PDF"}
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
        if (activeModule === "Solicitud") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-perisur-gray mb-8">Nueva Solicitud de Laboratorio Digital</h3>
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Nombre del Paciente</label>
                         <input type="text" placeholder="Ej: Pedro Infante" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold" />
                      </div>
                      <div>
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Cédula del Médico</label>
                         <input type="text" disabled defaultValue="MED-847291" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold opacity-60" />
                      </div>
                   </div>
                   <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Estudios Solicitados</p>
                      <div className="grid grid-cols-3 gap-2">
                        {["QUIMICA 6", "BIOMETRIA", "EGO", "PERFIL LIPIDOS", "COPRO", "ANTIGENO PSA"].map(study => (
                          <button key={study} className="p-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black hover:border-perisur-blue hover:text-perisur-blue transition-all uppercase">{study}</button>
                        ))}
                      </div>
                   </div>
                   <button 
                     onClick={() => alert("Solicitud digital enviada. El paciente puede acudir a cualquier sucursal Perisur.")}
                     className="w-full py-5 bg-perisur-blue text-white rounded-3xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-100"
                   >
                     Generar Orden Electrónica <FileSignature className="w-4 h-4 ml-2 inline-block" />
                   </button>
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Epidemiologia") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                <h3 className="text-xl font-black text-perisur-gray mb-8">Epidemiología Local • Mapa de Calor</h3>
                <div className="grid grid-cols-10 gap-1 h-64 mb-8">
                   {Array.from({length: 100}).map((_, i) => {
                     const intensity = i % 7 === 0 ? "bg-red-500/80" : i % 5 === 0 ? "bg-amber-400/60" : "bg-emerald-400/20";
                     return <div key={i} className={`rounded-sm ${intensity} hover:scale-110 transition-transform cursor-pointer`} />
                   })}
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-6 rounded-3xl">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patología Prevalente</p>
                      <p className="font-black text-perisur-gray">Diabetes Tipo II (+15%)</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zona Crítica</p>
                      <p className="font-black text-red-500">Perisur SurEste</p>
                   </div>
                </div>
              </div>
            </div>
          );
        }

        if (activeModule === "Estadisticas") {
          return (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xl font-black text-perisur-gray mb-8">Tendencias de Salud Poblacional</h3>
                <div className="h-64 mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 10}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: "#94a3b8", fontSize: 10}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="volumen" stroke="#0056b3" strokeWidth={4} dot={{r: 6}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Prevalencia de Diabetes</p>
                    <p className="text-xl font-black text-perisur-gray">12.5%</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Control de Lípidos</p>
                    <p className="text-xl font-black text-perisur-gray">68% OK</p>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <KPICard icon={<ClipboardList className="w-5 h-5" />} label="Pacientes Referidos" value="156" color="bg-blue-50 text-perisur-blue" />
              <KPICard icon={<Activity className="w-5 h-5" />} label="Estudios Críticos" value="4" color="bg-red-50 text-red-600" />
              <KPICard icon={<CheckCircle2 className="w-5 h-5" />} label="Resultados Listos" value="12" color="bg-green-50 text-green-600" />
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-50">
                  <h2 className="text-xl font-black text-perisur-gray">Pacientes Referidos</h2>
                  <p className="text-sm text-slate-400">Seguimiento de resultados de población asignada</p>
               </div>
               <div className="overflow-x-auto -mx-8 px-8">
                  <table className="w-full text-left min-w-[700px]">
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
            <p className="text-[10px] uppercase font-black text-slate-300 tracking-widest px-3 mb-4">Módulos de {(currentRole as string).toLowerCase()}</p>
            {getModulesForRole(currentRole as UserRole).map((m) => (
              <React.Fragment key={m.id}>
                <SidebarLink 
                  icon={React.cloneElement(m.icon as React.ReactElement, { className: "w-5 h-5" })} 
                  label={m.label} 
                  active={activeModule === m.id} 
                  onClick={() => setActiveModule(m.id)}
                />
              </React.Fragment>
            ))}
          </nav>
        </div>

        <div className="p-8 bg-slate-50 shadow-[0_-1px_0_0_rgba(0,0,0,0.05)] space-y-2">
          <button 
            onClick={() => setCurrentRole(null)}
            className="flex items-center justify-center gap-2 w-full py-4 bg-perisur-blue text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-100 hover:scale-[1.02] transition-all"
          >
            <Home className="w-4 h-4" /> Regresar al Home
          </button>
          <button className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-slate-100 text-xs font-black text-slate-400 hover:text-red-500 hover:border-red-100 transition-all uppercase">
            <LogOut className="w-4 h-4" />
            Salir del Sistema
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 sm:h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
            <button className="lg:hidden p-2 sm:p-3 bg-slate-50 rounded-xl" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-perisur-blue" />
            </button>
            <div className="lg:hidden flex items-center flex-shrink-0">
              <img src="https://cossma.com.mx/diagnosticos.png" alt="Logo" className="h-8 sm:h-10 object-contain mr-2" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm sm:text-xl font-black text-perisur-gray uppercase tracking-tight truncate">{currentRole as string}</h2>
              <div className="flex items-center gap-1 sm:gap-2 text-[8px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-0.5 sm:mt-1">
                <span className="hidden xs:inline">Perisur</span>
                <ChevronRight className="w-2 sm:w-2.5 h-2 sm:h-2.5 hidden xs:inline" />
                <span className="text-perisur-blue">{(currentRole as string).charAt(0) + (currentRole as string).slice(1).toLowerCase()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 sm:p-3 hover:bg-slate-50 rounded-2xl relative text-slate-400 hover:text-perisur-blue transition-all">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-2.5 sm:top-3 right-2.5 sm:right-3 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full border-2 sm:border-4 border-white shadow-sm"></span>
            </button>
            <div className="h-8 sm:h-10 w-px bg-slate-100" />
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-slate-900 leading-none">Jesús Armengol</p>
                <p className="text-[10px] font-black text-perisur-blue uppercase tracking-wider mt-1">{currentRole as string}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-blue-500 to-perisur-blue flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 flex-shrink-0">
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
              className="fixed inset-y-0 left-0 w-80 bg-white z-50 p-8 flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <img src="https://cossma.com.mx/diagnosticos.png" alt="Logo" className="h-10 w-auto" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 space-y-8">
                <div>
                  <p className="text-[10px] uppercase font-black text-slate-300 tracking-widest px-3 mb-4">Navegación</p>
                  <div className="space-y-1">
                    {getModulesForRole(currentRole as UserRole).map((m) => (
                      <React.Fragment key={m.id}>
                        <SidebarLink 
                          icon={React.cloneElement(m.icon as React.ReactElement, { className: "w-5 h-5" })} 
                          label={m.label} 
                          active={activeModule === m.id} 
                          onClick={() => { setActiveModule(m.id); setIsMobileMenuOpen(false); }}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 space-y-2">
                <button 
                  onClick={() => { setCurrentRole(null); setIsMobileMenuOpen(false); }}
                  className="w-full py-4 bg-perisur-blue text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" /> Regresar al Home
                </button>
                <button className="w-full py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" /> Salir del Sistema
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {selectedPatient && <ChemistModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />}
        
        {/* Modal RRHH Roles */}
        {showRoleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-perisur-gray/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl p-10 max-w-xl w-full shadow-2xl overflow-hidden relative">
              <button onClick={() => setShowRoleModal(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
              <h3 className="text-2xl font-black text-perisur-gray mb-2">Gestión de Roles y Permisos</h3>
              <p className="text-sm text-slate-400 mb-8 font-medium">Asigne roles y niveles de acceso al personal clínico.</p>
              
              <div className="space-y-4">
                {["ADMINISTRADOR", "RECEPCIÓN", "QUÍMICO", "INVENTARIO"].map((role) => (
                  <div key={role} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-perisur-blue shadow-sm">{role === "QUÍMICO" ? <FlaskConical className="w-5 h-5" /> : <Users className="w-5 h-5" />}</div>
                      <div>
                        <p className="text-sm font-black text-perisur-gray uppercase tracking-wider">{role}</p>
                        <p className="text-[10px] text-slate-400 font-bold">Acceso Total al Módulo</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="w-12 h-6 bg-blue-100 rounded-full relative"><span className="absolute right-1 top-1 w-4 h-4 bg-perisur-blue rounded-full"></span></span>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => { alert("Configuración de roles guardada"); setShowRoleModal(false); }} className="w-full py-4 bg-perisur-blue text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-100 mt-8">Guardar Cambios</button>
            </motion.div>
          </div>
        )}

        {/* Modal Nuevo Registro Reception */}
        {showNewPatientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-perisur-gray/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} className="bg-white rounded-3xl p-10 max-w-2xl w-full shadow-2xl relative">
              <button onClick={() => setShowNewPatientModal(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full"><X className="w-5 h-5" /></button>
              <h3 className="text-2xl font-black text-perisur-gray mb-1">Nuevo Registro de Paciente</h3>
              <p className="text-sm text-slate-400 mb-8 font-medium">Complete los datos básicos para abrir expediente.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Nombre Completo</label>
                  <input type="text" placeholder="Ej: Mariana Rodríguez" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-perisur-blue transition-all" />
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Edad</label>
                   <input type="number" placeholder="25" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-perisur-blue transition-all" />
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Género</label>
                   <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-perisur-blue transition-all appearance-none uppercase">
                      <option>Femenino</option>
                      <option>Masculino</option>
                   </select>
                </div>
              </div>
              <button onClick={() => { alert("Paciente registrado correctamente"); setShowNewPatientModal(false); }} className="w-full py-5 bg-perisur-blue text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-100">Crear Expediente y Continuar</button>
            </motion.div>
          </div>
        )}

        {/* Modal Nueva Salida Maquila */}
        {showNewMaquilaModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-perisur-gray/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
              <button onClick={() => setShowNewMaquilaModal(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
              <h3 className="text-xl font-black text-perisur-gray mb-6">Nueva Salida a Maquila</h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-[10px] font-black text-slate-300 uppercase block mb-1">Destino</label>
                  <select className="w-full p-4 bg-slate-50 rounded-2xl border-none text-xs font-bold text-perisur-gray">
                    <option>Laboratorios Centralizados</option>
                    <option>Genética Especializada</option>
                    <option>Patología Integral</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-300 uppercase block mb-1">Muestras / Lote</label>
                  <input type="text" placeholder="Ej: 15 Tubos EDTA, 5 Frascos" className="w-full p-4 bg-slate-50 rounded-2xl border-none text-xs font-bold text-perisur-gray" />
                </div>
              </div>

              <button 
                onClick={() => { 
                  setIsDownloading(true);
                  setTimeout(() => {
                    alert("Salida a Maquila registrada con éxito."); 
                    setIsDownloading(false);
                    setShowNewMaquilaModal(false); 
                  }, 1500);
                }} 
                className="w-full py-4 bg-perisur-blue text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-blue-100"
              >
                {isDownloading ? "REGISTRANDO..." : "Registrar Salida"}
              </button>
            </motion.div>
          </div>
        )}

        {/* Modal Nueva Cita Agenda */}
        {showNewAppointmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-perisur-gray/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl p-6 sm:p-10 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowNewAppointmentModal(false)} className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-slate-50 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
              <h3 className="text-xl sm:text-2xl font-black text-perisur-gray mb-1 text-center">Programar Cita</h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-6 sm:mb-8 font-medium text-center italic">Seleccione fecha y hora disponible</p>
              
              <div className="grid grid-cols-7 gap-1 mb-6 text-center bg-slate-50 p-4 rounded-3xl">
                 {["D", "L", "M", "M", "J", "V", "S"].map((day, idx) => <div key={`${day}-${idx}`} className="text-[10px] font-black text-slate-300 py-2">{day}</div>)}
                 {Array.from({length: 31}).map((_, i) => (
                   <button 
                    key={i} 
                    onClick={() => setSelectedDate(i + 1)}
                    className={`h-8 sm:h-10 text-[10px] sm:text-[11px] font-bold rounded-xl transition-all ${selectedDate === i + 1 ? "bg-perisur-blue text-white shadow-md" : "hover:bg-white text-slate-600"}`}
                   >
                      {i + 1}
                   </button>
                 ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
                 {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00"].map(t => (
                   <button 
                    key={t} 
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 sm:py-3 rounded-xl text-[10px] font-black border transition-all ${selectedTime === t ? "border-perisur-blue text-perisur-blue bg-blue-50" : "border-slate-100 text-slate-400 hover:border-slate-200"}`}
                   >
                      {t} AM
                   </button>
                 ))}
              </div>

              <button 
                onClick={() => { 
                  if (!selectedDate || !selectedTime) {
                    alert("Por favor seleccione fecha y hora.");
                    return;
                  }
                  setIsDownloading(true);
                  setTimeout(() => {
                    alert(`Cita agendada con éxito para el ${selectedDate} de Mayo a las ${selectedTime} AM`); 
                    setIsDownloading(false);
                    setShowNewAppointmentModal(false); 
                  }, 1500);
                }} 
                disabled={isDownloading}
                className="w-full py-4 bg-perisur-blue text-white rounded-2xl text-[10px] sm:text-xs font-black uppercase shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isDownloading ? "PROCESANDO..." : "Confirmar Reservación"}
              </button>
            </motion.div>
          </div>
        )}

        {/* Modal Bitácora de Caja */}
        {showCashLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-perisur-gray/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl p-10 max-w-2xl w-full shadow-2xl relative">
              <button onClick={() => setShowCashLogModal(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
              <h3 className="text-2xl font-black text-perisur-gray mb-1">Bitácora de Caja del Día</h3>
              <p className="text-sm text-slate-400 mb-8 font-medium italic">Resumen de transacciones del turno actual</p>
              
              <div className="space-y-3 mb-8 max-h-96 overflow-y-auto pr-2">
                {[
                  { time: "08:12 AM", concept: "Venta: PX-001 - Juan Pérez", amount: "$450.00", method: "Tarjeta" },
                  { time: "09:30 AM", concept: "Venta: PX-002 - María Elena", amount: "$1,200.00", method: "Efectivo" },
                  { time: "10:15 AM", concept: "Venta: PX-004 - Sofía López", amount: "$800.00", method: "Tarjeta" },
                  { time: "11:45 AM", concept: "Apertura de Caja", amount: "$3,000.00", method: "Base" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                       <p className="text-[10px] font-black text-perisur-blue mb-1">{log.time} • {log.method}</p>
                       <p className="text-sm font-bold text-perisur-gray">{log.concept}</p>
                    </div>
                    <p className="text-sm font-black text-perisur-gray">{log.amount}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-perisur-blue/5 rounded-3xl flex justify-between items-center">
                 <p className="text-xs font-black text-perisur-blue uppercase tracking-widest">Total en Caja</p>
                 <p className="text-2xl font-black text-perisur-blue">$5,450.00</p>
              </div>
            </motion.div>
          </div>
        )}

        {/* Modal Orden de Compra Inventory */}
        {showPOModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-perisur-gray/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-3xl p-10 max-w-2xl w-full shadow-2xl relative">
              <button onClick={() => setShowPOModal(false)} className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full"><X className="w-5 h-5 text-slate-400" /></button>
              <h3 className="text-2xl font-black text-perisur-gray mb-1">Nueva Orden de Compra</h3>
              <p className="text-sm text-slate-400 mb-8 font-medium">Genere una solicitud de abastecimiento para proveedores.</p>
              
              <div className="space-y-6 mb-8">
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 mb-2 block">Proveedor</label>
                   <select className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-perisur-blue transition-all">
                      <option>Sistemas Diagnósticos MX</option>
                      <option>Equipos Médicos Perisur</option>
                   </select>
                </div>
                <div className="p-6 border-2 border-dashed border-slate-100 rounded-3xl">
                   <p className="text-[10px] font-black text-slate-300 uppercase text-center mb-4">Ítems Críticos Recomendados</p>
                   <div className="space-y-2">
                     <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                        <span>Tiras Reactivas Glucosa</span>
                        <input type="number" defaultValue={50} className="w-16 bg-slate-100 border-none rounded-lg px-2 py-1 text-center" />
                     </div>
                     <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                        <span>Reactivo Biometría A</span>
                        <input type="number" defaultValue={20} className="w-16 bg-slate-100 border-none rounded-lg px-2 py-1 text-center" />
                     </div>
                   </div>
                </div>
              </div>

              <button onClick={() => { alert("Orden de compra generada y enviada al proveedor"); setShowPOModal(false); }} className="w-full py-5 bg-perisur-blue text-white rounded-2xl text-xs font-black uppercase shadow-lg shadow-blue-100">Emitir Orden de Compra</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
