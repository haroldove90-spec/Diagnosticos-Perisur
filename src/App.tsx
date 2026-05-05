/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Users, 
  ClipboardList, 
  Activity, 
  DollarSign, 
  FlaskConical, 
  Search, 
  Filter, 
  ChevronRight, 
  Bell, 
  UserCircle,
  LayoutDashboard,
  Calendar,
  FileText,
  Settings,
  LogOut,
  MoreVertical,
  CheckCircle2,
  Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
type Status = "En Proceso" | "Completado";
type Role = "Admin" | "Recepción" | "Químico";

interface PatientRecord {
  id: string;
  name: string;
  study: string;
  status: Status;
  date: string;
}

// Mock Data (Mexico context)
const INITIAL_RECORDS: PatientRecord[] = [
  { id: "LAB-001", name: "Juan Pérez García", study: "Biometría Hemática", status: "En Proceso", date: "05/05/2026" },
  { id: "LAB-002", name: "María Elena García", study: "Química Sanguínea (36 elementos)", status: "Completado", date: "05/05/2026" },
  { id: "LAB-003", name: "Alejandro Hernández", study: "Examen General de Orina", status: "En Proceso", date: "05/05/2026" },
  { id: "LAB-004", name: "Sofía López Portillo", study: "Perfil Lipídico", status: "Completado", date: "05/05/2026" },
  { id: "LAB-005", name: "Ricardo Martínez Ruiz", study: "Prueba de Embarazo (HCG)", status: "En Proceso", date: "04/05/2026" },
  { id: "LAB-006", name: "Elena Rodríguez", study: "Perfil Tiroideo", status: "Completado", date: "04/05/2026" },
  { id: "LAB-007", name: "Diego González", study: "Glucosa en Ayunas", status: "En Proceso", date: "04/05/2026" },
  { id: "LAB-008", name: "Patricia Moreno", study: "Electrolitos Sanguíneos", status: "Completado", date: "04/05/2026" },
  { id: "LAB-009", name: "Javier Sánchez", study: "Hemoglobina Glicosilada", status: "En Proceso", date: "04/05/2026" },
  { id: "LAB-010", name: "Gabriela Torres", study: "Coproparasitoscópico", status: "Completado", date: "04/05/2026" },
];

const ROLES: Role[] = ["Admin", "Recepción", "Químico"];

export default function App() {
  const [activeRole, setActiveRole] = useState<Role>("Admin");
  const [filter, setFilter] = useState<Status | "Todos">("Todos");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecords = useMemo(() => {
    return INITIAL_RECORDS.filter((record) => {
      const matchesFilter = filter === "Todos" || record.status === filter;
      const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           record.study.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchTerm]);

  return (
    <div className="flex h-screen bg-[#fdfdfd] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-slate-100 flex flex-col h-full sticky top-0 hidden md:flex">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-sm shadow-blue-200">
              L
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">LabFlow</span>
          </div>

          <nav className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 px-3">Vistas del Sistema</p>
            <SidebarLink icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active />
            <SidebarLink icon={<Calendar className="w-4 h-4" />} label="Citas" />
            <SidebarLink icon={<Users className="w-4 h-4" />} label="Pacientes" />
            <SidebarLink icon={<FileText className="w-4 h-4" />} label="Reportes" />
            <SidebarLink icon={<Activity className="w-4 h-4" />} label="Inventario" />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-50">
          <div className="mb-6">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 block px-3">
              Rol de Usuario
            </label>
            <div className="flex flex-col gap-1">
              {ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role)}
                  className={`text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                    activeRole === role 
                      ? "bg-blue-50 text-blue-700 font-medium" 
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 px-3 py-4 border-t border-slate-50 mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Dr. Alejandro M.</p>
              <p className="text-[10px] text-slate-400">Director Médico</p>
            </div>
          </div>
          <button className="flex items-center gap-3 text-slate-400 hover:text-red-500 transition-colors py-2 px-3 text-sm w-full">
            <LogOut className="w-4 h-4" />
            Salir
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Panel de Control</h1>
            <p className="text-sm text-slate-500">Bienvenido, sesión activa como <span className="font-medium text-blue-600 underline underline-offset-4 decoration-blue-200">{activeRole}</span></p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Buscar paciente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50/50 border border-slate-100 rounded-lg text-sm w-64 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
              />
            </div>
            <button className="p-2 h-10 w-10 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-500 relative border border-transparent hover:border-slate-100 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-100"></div>
            <div className="px-3 py-1.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 shadow-sm">
              {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard 
              icon={<ClipboardList className="w-5 h-5" />}
              label="Citas hoy" 
              value="42" 
              trend="+12% vs ayer" 
              trendUp={true}
              color="blue"
            />
            <KPICard 
              icon={<Clock className="w-5 h-5" />}
              label="Pendientes" 
              value="18" 
              trend="Prioridad alta: 5" 
              trendUp={false}
              color="orange"
            />
            <KPICard 
              icon={<DollarSign className="w-5 h-5" />}
              label="Ingresos Hoy" 
              value="$12,450" 
              trend="Ver desglose" 
              trendUp={true}
              color="green"
            />
            <KPICard 
              icon={<FlaskConical className="w-5 h-5" />}
              label="Reactivos Bajos" 
              value="3" 
              trend="Reordenar ahora" 
              trendUp={false}
              color="red"
            />
          </section>

          {/* Central Table */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-700">Estudios Recientes</h3>
              
              <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                {(["Todos", "En Proceso", "Completado"] as const).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilter(opt)}
                    className={`px-4 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all ${
                      filter === opt 
                        ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {opt === "En Proceso" ? "Pendientes" : opt === "Completado" ? "Completados" : opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-white border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Paciente</th>
                    <th className="px-6 py-4">Estudio Solicitado</th>
                    <th className="px-6 py-4">Estatus</th>
                    <th className="px-6 py-4">Hora/Fecha</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {filteredRecords.map((record, idx) => (
                      <motion.tr 
                        key={record.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-slate-50/80 group transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-slate-800">{record.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">{record.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                          {record.study}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={record.status} />
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
                          {idx % 2 === 0 ? "08:30" : "10:15"} / {record.date}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-blue-600 hover:text-blue-800 font-bold text-xs transition-colors hover:underline underline-offset-4">
                            Ver Reporte
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-slate-100 bg-white text-[10px] text-slate-400 font-medium">
              Mostrando {filteredRecords.length} de {INITIAL_RECORDS.length} registros
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all group ${
      active 
        ? "bg-blue-50 text-blue-700 font-medium" 
        : "text-slate-500 hover:bg-slate-50"
    }`}>
      <span className={active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600 transition-colors"}>{icon}</span>
      {label}
    </button>
  );
}

function KPICard({ icon, label, value, trend, trendUp, color }: { 
  icon: React.ReactNode, 
  label: string, 
  value: string, 
  trend: string, 
  trendUp: boolean,
  color: "blue" | "green" | "orange" | "red"
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50/20 text-red-600 ring-1 ring-red-100",
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`bg-white p-5 rounded-xl border shadow-sm relative overflow-hidden group ${
        color === 'red' ? 'border-red-100 bg-red-50/5' : 'border-slate-100'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</p>
        <div className={`p-1.5 rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-2xl font-bold tracking-tight ${color === 'red' ? 'text-red-700' : 'text-slate-900'}`}>{value}</p>
      </div>
      <div className="mt-2">
        <span className={`text-[10px] font-bold ${
          color === 'red' ? 'text-red-600 underline cursor-pointer' : trendUp ? "text-green-600" : "text-orange-500"
        }`}>
          {trendUp && "↑ "} {trend}
        </span>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  if (status === "Completado") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wider">
        LISTO
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
      PROCESANDO
    </span>
  );
}
