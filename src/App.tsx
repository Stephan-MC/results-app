/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  INITIAL_STUDENTS, 
  StudentRecord, 
  calculateClassStats, 
  ClassStats 
} from './data/academicData';
import { PerformanceChart } from './components/PerformanceChart';
import { AddStudentModal } from './components/AddStudentModal';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Award, 
  User, 
  Calendar, 
  BookOpen, 
  Printer, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  Clock,
  UserCheck,
  Percent,
  ChevronRight
} from 'lucide-react';

const getSubjectCoefficient = (subjectName: string, classSection: string): number => {
  const isSerieD = classSection.includes("D") || classSection.includes("11-B") || classSection.includes("Grade 11-B");
  switch (subjectName) {
    case "Mathématiques":
      return isSerieD ? 4 : 5;
    case "Physique":
      return isSerieD ? 2 : 3;
    case "Chimie":
      return 2;
    case "Sciences de la Vie et de la Terre (SVT)":
    case "SVT":
      return isSerieD ? 4 : 2;
    case "Français":
      return 3;
    case "Anglais":
      return 2;
    case "Histoire-Géographie":
      return 2;
    case "Informatique":
      return 2;
    case "Éducation Civique et Morale (ECM)":
    case "ECM":
      return 1;
    default:
      return 2;
  }
};

export default function App() {
  // --- Local State & Persistence ---
  const [students, setStudents] = useState<StudentRecord[]>(() => {
    const saved = localStorage.getItem('academic_results_students');
    const rawStudents: StudentRecord[] = saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    return rawStudents.map(student => {
      // Clean and sanitize any legacy lettered grades to official French remarks
      const sanitizedResults = (student.results || []).map(res => {
        let currentGrade = res.grade || '';
        const clean = String(currentGrade).trim().toUpperCase();
        if (['A+', 'A', 'B', 'C', 'D', 'F', 'TRES-BIEN', 'ASSEZ-BIEN', 'PASSABLE', 'INSUFFISANT'].includes(clean) || !currentGrade) {
          if (clean === 'A+' || clean === 'A') currentGrade = 'Très Bien';
          else if (clean === 'B') currentGrade = 'Bien';
          else if (clean === 'C') currentGrade = 'Assez Bien';
          else if (clean === 'D') currentGrade = 'Passable';
          else if (clean === 'F') currentGrade = 'Insuffisant';
          else if (clean === 'TRES-BIEN') currentGrade = 'Très Bien';
          else if (clean === 'ASSEZ-BIEN') currentGrade = 'Assez Bien';
        }
        return {
          ...res,
          grade: currentGrade
        };
      });

      let weightedSum = 0;
      let coeffSum = 0;
      sanitizedResults.forEach(res => {
        const coeff = getSubjectCoefficient(res.name, student.classSection);
        weightedSum += res.gpa * coeff;
        coeffSum += coeff;
      });
      const gpa = coeffSum > 0 ? parseFloat((weightedSum / coeffSum).toFixed(2)) : student.gpa;
      return { ...student, results: sanitizedResults, gpa };
    });
  });

  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    const saved = localStorage.getItem('academic_results_students');
    const initialList = saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    return initialList[0]?.id || '';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'transcript' | 'analytics'>('transcript');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [printTriggered, setPrintTriggered] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('academic_results_students', JSON.stringify(students));
  }, [students]);

  // --- Dynamic Ranking Engine ---
  // Ranks should be dynamically computed whenever students list changes so additions recalculate ranks.
  const rankedStudents = useMemo(() => {
    // Group students by classSection
    const classes: { [section: string]: StudentRecord[] } = {};
    students.forEach(s => {
      if (!classes[s.classSection]) {
        classes[s.classSection] = [];
      }
      classes[s.classSection].push(s);
    });

    // Sort each class by GPA descending and assign ranks
    const finalRankedList: StudentRecord[] = [];
    Object.keys(classes).forEach(section => {
      const sorted = [...classes[section]].sort((a, b) => b.gpa - a.gpa);
      const totalInClass = sorted.length;
      
      sorted.forEach((student, index) => {
        finalRankedList.push({
          ...student,
          rank: index + 1,
          totalStudents: totalInClass
        });
      });
    });

    return finalRankedList;
  }, [students]);

  // --- Filtered Students for the Sidebar ---
  const filteredStudents = useMemo(() => {
    return rankedStudents.filter(student => {
      const matchesClass = classFilter === 'All' || student.classSection === classFilter;
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [rankedStudents, classFilter, searchQuery]);

  // Ensure selected student exists in the ranked list
  const activeStudent = useMemo(() => {
    return rankedStudents.find(s => s.id === selectedStudentId) || rankedStudents[0];
  }, [rankedStudents, selectedStudentId]);

  // Automatically update selected ID if active student is no longer available or if switching class filter
  useEffect(() => {
    if (filteredStudents.length > 0 && !filteredStudents.some(s => s.id === selectedStudentId)) {
      setSelectedStudentId(filteredStudents[0].id);
    }
  }, [filteredStudents, selectedStudentId]);

  // --- Class Performance Stats ---
  // Determine which class stats to display based on either the current filter, or the selected student's class
  const statsClass = classFilter !== 'All' ? classFilter : (activeStudent?.classSection || 'Première C');
  const classStats = useMemo(() => {
    return calculateClassStats(rankedStudents, statsClass, 'Term 1');
  }, [rankedStudents, statsClass]);

  // --- Save New Record handler ---
  const handleAddStudent = (newRecord: StudentRecord) => {
    setStudents(prev => [newRecord, ...prev]);
    setSelectedStudentId(newRecord.id);
  };

  // --- Print Handler ---
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans text-gray-900 selection:bg-indigo-100" id="main-academic-container">
      
      {/* Top Banner Message (Print Invisible) */}
      <div className="bg-slate-900 text-slate-300 px-8 py-2 text-[10px] font-bold tracking-widest uppercase flex items-center justify-between border-b border-slate-800 print:hidden" id="system-banner">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>ESPACE DE TRAVAIL OFFICIEL DU BUREAU DE LA SCOLARITÉ</span>
        </div>
        <div className="flex items-center space-x-4 font-mono text-[10px]">
          <span>1ER TRIMESTRE, 2026</span>
          <span className="text-slate-600">|</span>
          <span>CONNEXION SSL SÉCURISÉE</span>
        </div>
      </div>

      {/* Main Header / Navigation Area (Print Invisible) */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-20 shadow-xs print:hidden" id="app-header">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-700 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-xs">Σ</div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-800 uppercase leading-tight" id="brand-title">Lycée de St. Jude</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold" id="brand-subtitle">Systèmes de Gestion Académique</p>
            </div>
          </div>

          {/* Registrar Actions & Personalized Profile info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">M. Stephane</p>
                <p className="text-xs text-slate-500">mundestephane13@gmail.com</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-indigo-700 text-sm">
                MS
              </div>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold px-4 py-2.5 rounded shadow-sm hover:shadow-md transition-all flex items-center cursor-pointer"
              id="trigger-add-record-btn"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Ajouter un Dossier
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto p-4 md:p-6" id="dashboard-main-content">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================= LEFT COLUMN: Filters, Student List & Quick Aggregate (Print Invisible) ================= */}
          <section className="lg:col-span-4 space-y-6 print:hidden" id="search-sidebar-section">
            
            {/* Search & Filter Panel */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recherche & Filtre</span>
                <span className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-0.5 rounded font-bold font-mono">
                  {filteredStudents.length} ENREGISTREMENTS
                </span>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un nom ou matricule..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition-all text-slate-900 placeholder:text-gray-400"
                  id="student-search-input"
                />
              </div>

              {/* Class Filter Tags */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Cohorte de Classe</label>
                <div className="flex flex-wrap gap-1.5" id="class-filter-container">
                  {['All', 'Première C', 'Première D'].map((cohort) => (
                    <button
                      key={cohort}
                      onClick={() => setClassFilter(cohort)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                        classFilter === cohort 
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs' 
                          : 'bg-white text-gray-600 border border-slate-200 hover:bg-slate-50'
                      }`}
                      id={`filter-btn-${cohort.replace(/\s+/g, '-').toLowerCase()}`}
                    >
                      {cohort === 'All' ? 'Tous' : cohort}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Student List Sidebar Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col max-h-[500px]">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Liste des Élèves</h3>
                <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Trié par Rang</span>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto" id="student-list">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const isSelected = student.id === selectedStudentId;
                    return (
                      <button
                        key={student.id}
                        onClick={() => {
                          setSelectedStudentId(student.id);
                          // Auto scroll to active transcript panel on mobile
                          if (window.innerWidth < 1024) {
                            document.getElementById('transcript-display-section')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className={`w-full text-left px-5 py-3 flex items-center justify-between transition-all hover:bg-slate-50 border-l-4 cursor-pointer group ${
                          isSelected ? 'bg-slate-50 border-indigo-700' : 'border-transparent'
                        }`}
                        id={`student-row-${student.id}`}
                      >
                        <div className="space-y-1 pr-3 truncate">
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-900' : 'text-slate-800 group-hover:text-indigo-700 transition-colors'}`}>
                              {student.name}
                            </span>
                            <span className="text-[9px] font-mono text-gray-400 font-bold shrink-0">
                              Rang {student.rank}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-[10px] font-medium text-gray-400">
                            <span>{student.classSection}</span>
                            <span>•</span>
                            <span className="font-mono">{student.rollNumber}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1.5 shrink-0">
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                            student.gpa >= 16.0 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : student.gpa >= 14.0 
                              ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                              : student.gpa >= 12.0 
                              ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                              : student.gpa >= 10.0
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {student.gpa.toFixed(2)} / 20
                          </span>
                          <ChevronRight className={`w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform ${isSelected ? 'text-indigo-500' : ''}`} />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="p-8 text-center" id="no-students-fallback">
                    <User className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-medium text-gray-400">Aucun dossier trouvé</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Essayez de modifier vos filtres ou votre recherche.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Cohort Overview Card styled with Cumulative Performance theme */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 block">Performance Cumulative ({statsClass === 'All' ? 'Tous' : statsClass})</label>
                <div className="grid grid-cols-2 gap-4" id="cohort-stats-grid">
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Moyenne de Classe</p>
                    <p className="text-2xl font-bold text-indigo-700 font-mono">{classStats.averageGpa.toFixed(2)} / 20</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Taux de Réussite</p>
                    <p className="text-2xl font-bold text-slate-800 font-mono">{classStats.passRate}%</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Statut</label>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Candidats aux Mentions (Moyenne ≥ 12,0) : {students.filter(s => s.classSection === statsClass && s.gpa >= 12.0).length}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                  <p className="text-xs font-semibold text-indigo-900 mb-2 uppercase tracking-wide">Actions du Relevé</p>
                  <button 
                    onClick={handlePrint}
                    className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded shadow-xs mb-2 transition-colors cursor-pointer"
                  >
                    Imprimer / Télécharger le PDF
                  </button>
                  <button 
                    onClick={() => {
                      alert(`Informations certifiées conformes par le Secrétariat du Probatoire du Lycée de St. Jude.\nHachage de vérification : OB-PROB-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);
                    }}
                    className="w-full py-2 bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200 text-xs font-bold rounded transition-colors cursor-pointer mb-2"
                  >
                    Vérifier l'Authenticité
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm("Êtes-vous sûr de vouloir réinitialiser toutes les données ? Cette action rechargera les données par défaut et supprimera vos modifications.")) {
                        localStorage.removeItem('academic_results_students');
                        window.location.reload();
                      }
                    }}
                    className="w-full py-2 bg-rose-50/50 hover:bg-rose-100 text-rose-700 border border-rose-100 text-xs font-bold rounded transition-colors cursor-pointer"
                  >
                    Réinitialiser les Données
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ================= RIGHT COLUMN: Selected Student's Academic Record / Analytics ================= */}
          <section className="lg:col-span-8 space-y-6" id="transcript-display-section">
            
            {/* View Tab Selector (Print Invisible) */}
            <div className="flex bg-slate-200/60 p-1 rounded-lg w-fit print:hidden" id="tab-controls">
              <button
                onClick={() => setActiveTab('transcript')}
                className={`px-4 py-2 rounded text-xs font-bold flex items-center transition-all cursor-pointer ${
                  activeTab === 'transcript' 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id="tab-transcript"
              >
                <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                Bulletin de Notes de l'Élève
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded text-xs font-bold flex items-center transition-all cursor-pointer ${
                  activeTab === 'analytics' 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                id="tab-analytics"
              >
                <BarChart3 className="w-3.5 h-3.5 mr-1.5" />
                Analyses de la Classe
              </button>
            </div>

            {/* TAB CONTENT 1: INDIVIDUAL TRANSCRIPT & REPORT CARD */}
            {activeTab === 'transcript' && (
              <div className="space-y-6">
                {activeStudent ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-xs relative print:border-none print:shadow-none print:p-0" id="academic-report-card">
                    
                    {/* Official Transcript Header Details */}
                    <div className="border-b-2 border-slate-900 pb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6 print:border-b-4 print:pb-4">
                      
                      {/* Left: Institution / Report Name */}
                      <div className="space-y-1.5">
                        <div className="flex items-center space-x-2 text-indigo-700 font-bold tracking-widest text-[10px] uppercase print:text-black">
                          <GraduationCap className="w-4 h-4 text-indigo-700" />
                          <span>RÉPUBLIQUE DU CAMEROUN • OFFICE DU BACCALAURÉAT</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase font-sans print:text-xl">
                          RELEVÉ DE NOTES DE L'EXAMEN DU PROBATOIRE
                        </h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-medium">
                          <span className="flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                            Session : 2026
                          </span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                            Centre d'Examen : Centre Académique de St. Jude
                          </span>
                        </div>
                      </div>

                      {/* Right: Print Actions (Print Invisible) */}
                      <div className="flex items-center space-x-2 self-start md:self-auto print:hidden">
                        <button
                          onClick={handlePrint}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded flex items-center transition-colors cursor-pointer border border-slate-200"
                          id="print-action-btn"
                        >
                          <Printer className="w-4 h-4 mr-1.5" />
                          Imprimer le Relevé
                        </button>
                      </div>
                    </div>

                    {/* Student Metadata Card */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border border-slate-200 bg-slate-50 rounded-lg px-5 mt-6 print:bg-transparent print:border-b-2 print:px-0 print:border-slate-300">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Nom de l'Élève</span>
                        <span className="text-sm font-bold text-slate-800">{activeStudent.name}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Série / Spécialité</span>
                        <span className="text-sm font-bold text-slate-800">
                          {activeStudent.classSection.includes("C") 
                            ? "Série C (Mathématiques & Physiques)" 
                            : "Série D (Sciences de la Vie & de la Terre)"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Numéro de Table / Matricule</span>
                        <span className="text-sm font-mono font-bold text-slate-800">{activeStudent.rollNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Taux d'Assiduité</span>
                        <span className="text-sm font-mono font-bold text-slate-800">{activeStudent.attendance}%</span>
                      </div>
                    </div>

                    {/* Key Core GPA and Rank Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 print:my-4">
                      
                      {/* Overall GPA Card */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between print:border-2 print:border-black print:bg-transparent">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block print:text-black">Moyenne Générale</span>
                          <span className="text-3xl font-bold text-indigo-700 mt-1 block print:text-black font-mono">{activeStudent.gpa.toFixed(2)} / 20</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 print:hidden">
                          <Award className="w-5 h-5 text-indigo-700" />
                        </div>
                      </div>

                      {/* Rank Card */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between print:border-2 print:border-black print:bg-transparent">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block print:text-black font-mono">Rang de l'Élève</span>
                          <span className="text-3xl font-bold text-slate-800 mt-1 block print:text-black font-mono">
                            {activeStudent.rank}<sup className="text-xs">{activeStudent.rank === 1 ? 'er' : 'e'}</sup> <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-sans print:text-black">sur {activeStudent.totalStudents}</span>
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 print:hidden">
                          <TrendingUp className="w-5 h-5 text-emerald-700" />
                        </div>
                      </div>

                      {/* Cumulative Result Status */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between print:border-2 print:border-black print:bg-transparent">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Décision du Jury</span>
                          <div className="flex flex-col gap-0.5 mt-1">
                            {activeStudent.gpa < 10.0 ? (
                              <>
                                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">REFUSÉ (AJOURNÉ)</span>
                                <span className="text-[9px] font-medium text-slate-400">Moyenne inférieure à 10,00</span>
                              </>
                            ) : (
                              <>
                                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">ADMIS (PASSED)</span>
                                <span className="text-[10px] font-bold text-slate-600">
                                  Mention : {activeStudent.gpa >= 16.0 ? 'Très Bien' : activeStudent.gpa >= 14.0 ? 'Bien' : activeStudent.gpa >= 12.0 ? 'Assez Bien' : 'Passable'}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Detailed Marks Statement Table */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden mt-6 print:border-2 print:border-black print:rounded-none shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse" id="grades-table">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-widest print:bg-transparent print:border-b-2 print:border-black print:text-black">
                              <th className="px-5 py-3">Code</th>
                              <th className="px-5 py-3">Matière</th>
                              <th className="px-3 py-3 text-center">Note / 20</th>
                              <th className="px-3 py-3 text-center">Coeff.</th>
                              <th className="px-3 py-3 text-center">Note × Coeff.</th>
                              <th className="px-4 py-3 text-center">Mention</th>
                              <th className="px-5 py-3 text-center">Statut</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs print:divide-y print:divide-black">
                            {activeStudent.results.map((res) => {
                              const coeff = getSubjectCoefficient(res.name, activeStudent.classSection);
                              const weighted = res.gpa * coeff;
                              return (
                                <tr key={res.code} className="hover:bg-slate-50/40 font-medium">
                                  <td className="px-5 py-3.5 font-mono text-slate-500 font-bold">{res.code}</td>
                                  <td className="px-5 py-3.5 text-slate-800">
                                    <div className="font-semibold text-slate-950">{res.name}</div>
                                    <div className="text-[10px] text-slate-400 font-normal italic mt-0.5 print:hidden">{res.remarks}</div>
                                  </td>
                                  <td className="px-3 py-3.5 text-center font-mono text-slate-700 font-bold">{res.gpa.toFixed(2)}</td>
                                  <td className="px-3 py-3.5 text-center font-mono text-slate-500">{coeff}</td>
                                  <td className="px-3 py-3.5 text-center font-mono font-bold text-slate-800">{weighted.toFixed(2)}</td>
                                  <td className="px-4 py-3.5 text-center">
                                    <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold ${
                                      res.grade === 'Très Bien'
                                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' 
                                        : res.grade === 'Bien' 
                                        ? 'text-indigo-700 bg-indigo-50 border border-indigo-100' 
                                        : res.grade === 'Assez Bien' 
                                        ? 'text-amber-700 bg-amber-50 border border-amber-100' 
                                        : res.grade === 'Passable'
                                        ? 'text-orange-700 bg-orange-50 border border-orange-100'
                                        : 'text-rose-700 bg-rose-50 border border-rose-100'
                                    }`}>
                                      {res.grade}
                                    </span>
                                  </td>
                                  <td className="px-5 py-3.5 text-center">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                      res.gpa >= 10.0 
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                                    }`}>
                                      {res.gpa >= 10.0 ? 'Validé' : 'Échoué'}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Semester Summary footer block from Professional Polish */}
                      <div className="bg-slate-50 p-6 flex justify-end gap-12 border-t border-slate-200">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total des Coefficients</p>
                          <p className="text-xl font-bold text-slate-800 font-mono">
                            {activeStudent.results.reduce((acc, res) => acc + getSubjectCoefficient(res.name, activeStudent.classSection), 0)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Points Totaux</p>
                          <p className="text-xl font-bold text-slate-800 font-mono">
                            {activeStudent.results.reduce((acc, res) => acc + (res.gpa * getSubjectCoefficient(res.name, activeStudent.classSection)), 0).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-indigo-700 font-semibold">Moyenne Générale</p>
                          <p className="text-xl font-bold text-indigo-700 font-mono">
                            {activeStudent.gpa.toFixed(2)} / 20
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Performance Comparison Visualizer (Print Invisible) */}
                    <div className="mt-8 print:hidden">
                      <PerformanceChart 
                        results={activeStudent.results} 
                        classAverages={classStats.subjectAverages} 
                      />
                    </div>

                    {/* Sign-offs & General Advisor Remarks */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8 pt-8 border-t border-slate-200 items-start print:grid-cols-2 print:border-t-2 print:border-black print:mt-6 print:pt-4">
                      
                      {/* Left: General remarks */}
                      <div className="md:col-span-8 space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest print:text-xs">
                          Appréciation du Conseiller de Classe
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-4 font-normal print:bg-transparent print:border-none print:p-0">
                          "{activeStudent.generalRemarks}"
                        </p>
                      </div>

                      {/* Right: Signature blocks */}
                      <div className="md:col-span-4 space-y-6 flex flex-col items-end text-right">
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Conseiller de Classe</div>
                          <div className="font-serif italic text-sm text-slate-800 font-bold pr-2">{activeStudent.advisorName}</div>
                          <div className="w-48 h-[1px] bg-slate-300 mt-6 block print:bg-black"></div>
                          <div className="text-[9px] font-medium text-slate-400 block pr-2">Signature Autorisée</div>
                        </div>
                      </div>

                    </div>

                    {/* Official Stamp Footer (Print Only) */}
                    <div className="hidden print:flex items-center justify-between border-t border-black pt-6 mt-12 text-[10px] font-mono text-black uppercase tracking-[0.2em]">
                      <div>
                        RÉFÉRENCE : {activeStudent.id.substring(0, 8).toUpperCase()}
                      </div>
                      <div>
                        SCEAU OFFICIEL DU LYCÉE DE ST. JUDE
                      </div>
                      <div>
                        GÉNÉRÉ LE : {new Date().toLocaleDateString()}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-2xs" id="empty-dashboard-state">
                    <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-sm font-semibold text-gray-900">Aucun Élève Sélectionné</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Sélectionnez un élève dans la liste à gauche, ou utilisez l'option « Ajouter un Dossier » pour créer de nouveaux enregistrements.
                    </p>
                  </div>
                )}
              </div>
            )}
 
            {/* TAB CONTENT 2: COHORT-WIDE PERFORMANCE ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-6" id="analytics-tab-panel">
                
                {/* Cohort Summary Headline */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Aperçu de la Cohorte : {statsClass === 'All' ? 'Tous' : statsClass}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Agrégat statistique des performances académiques des élèves de cette catégorie.</p>
                  </div>
                  <div className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded border border-indigo-100 font-mono">
                    1ER TRIMESTRE • {classStats.gradeDistribution.reduce((acc, d) => acc + d.count, 0)} ÉLÈVES
                  </div>
                </div>
 
                {/* Grid 1: Subject Averages Table vs Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Subject Average Scores bar chart */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col">
                    <div className="mb-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Moyenne des Notes par Matière</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Moyennes obtenues pour chaque matière au sein de cette cohorte</p>
                    </div>
 
                    <div className="space-y-3.5 flex-1 justify-center flex flex-col">
                      {Object.keys(classStats.subjectAverages).length > 0 ? (
                        Object.entries(classStats.subjectAverages).map(([subj, avg]) => (
                          <div key={subj} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                              <span>{subj}</span>
                              <span className="font-mono font-bold text-slate-900">{avg} / 100 ({(Number(avg) / 5).toFixed(2)} / 20)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded overflow-hidden">
                              <div 
                                className="bg-indigo-700 h-full rounded transition-all duration-500" 
                                style={{ width: `${avg}%` }}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs font-medium text-slate-400 text-center py-6">Aucune donnée de moyenne par matière disponible</p>
                      )}
                    </div>
                  </div>
 
                  {/* Grade Distribution Block */}
                  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col">
                    <div className="mb-4">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Distribution des Mentions</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Nombre d'élèves par mention au sein de la cohorte</p>
                    </div>
 
                    <div className="space-y-3.5 flex-1 justify-center flex flex-col">
                      {classStats.gradeDistribution.map((dist) => {
                        const totalStudents = classStats.gradeDistribution.reduce((acc, d) => acc + d.count, 0);
                        const pct = totalStudents > 0 ? Math.round((dist.count / totalStudents) * 100) : 0;
                        return (
                          <div key={dist.grade} className="flex items-center justify-between text-xs font-medium">
                            <div className="w-1/3 text-slate-600">{dist.grade}</div>
                            <div className="w-1/2 bg-slate-100 h-4 rounded overflow-hidden relative mx-3">
                              <div 
                                className="bg-indigo-400 h-full rounded transition-all duration-500" 
                                style={{ width: `${pct}%` }}
                              />
                              <span className="absolute inset-0 flex items-center justify-center font-mono text-[9px] font-bold text-slate-700">
                                {pct}%
                              </span>
                            </div>
                            <div className="w-10 text-right font-mono font-bold text-slate-800">{dist.count}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
 
                </div>
 
                {/* Grade Distribution Chart (Interactive Roster Ranking) */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Courbe de Comparaison des Moyennes</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Distribution des moyennes des élèves sélectionnés</p>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 px-2.5 py-0.5 rounded text-slate-600 font-bold">
                      MAX : 20,00
                    </span>
                  </div>
 
                  <div className="space-y-3">
                    {filteredStudents.map((stud) => (
                      <div key={stud.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 w-1/3 truncate">
                          <span className="font-mono text-slate-400 font-bold shrink-0 w-6 text-right">
                            #{stud.rank}
                          </span>
                          <span className="font-bold text-slate-700 truncate">{stud.name}</span>
                        </div>
                        <div className="w-1/2 bg-slate-50 rounded h-3 relative mx-4 overflow-hidden border border-slate-100">
                          <div 
                            className={`h-full rounded transition-all duration-500 ${
                              stud.gpa >= 16.0 
                                ? 'bg-emerald-500' 
                                : stud.gpa >= 14.0 
                                ? 'bg-blue-500' 
                                : stud.gpa >= 12.0 
                                ? 'bg-amber-500' 
                                : stud.gpa >= 10.0
                                ? 'bg-indigo-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${(stud.gpa / 20.0) * 100}%` }}
                          />
                        </div>
                        <div className="w-16 text-right font-mono font-bold text-slate-800">
                          {stud.gpa.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
 
              </div>
            )}
 
          </section>
 
        </div>
      </main>
 
      {/* Footer Area (Print Invisible) */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-12 text-center text-xs text-slate-400 print:hidden" id="app-footer">
        <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold gap-4">
          <p>© 2026 BUREAU DE LA SCOLARITÉ • LYCÉE DE ST. JUDE</p>
          <div className="flex gap-6">
            <span>CONFORME AUX NORMES ACADÉMIQUES</span>
            <span>PORTAIL SÉCURISÉ</span>
          </div>
        </div>
      </footer>

      {/* Form Dialog Modal */}
      <AddStudentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddStudent}
        existingCount={students.length}
      />

    </div>
  );
}
