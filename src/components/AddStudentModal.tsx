import React, { useState } from 'react';
import { StudentRecord, SubjectResult, getGradeFromTotal } from '../data/academicData';
import { X, Plus, AlertCircle } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: StudentRecord) => void;
  existingCount: number;
}

const DEFAULT_SUBJECTS = [
  { name: "Mathématiques", code: "MAT" },
  { name: "Physique", code: "PHY" },
  { name: "Chimie", code: "CHM" },
  { name: "Sciences de la Vie et de la Terre (SVT)", code: "SVT" },
  { name: "Français", code: "FRA" },
  { name: "Anglais", code: "ANG" },
  { name: "Histoire-Géographie", code: "HIS" },
  { name: "Informatique", code: "INF" },
  { name: "Éducation Civique et Morale (ECM)", code: "ECM" }
];

const getCoeffForSubject = (name: string, isSerieD: boolean): number => {
  switch (name) {
    case "Mathématiques":
      return isSerieD ? 4 : 5;
    case "Physique":
      return isSerieD ? 2 : 3;
    case "Chimie":
      return 2;
    case "Sciences de la Vie et de la Terre (SVT)":
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
      return 1;
    default:
      return 2;
  }
};

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, onSave, existingCount }) => {
  const [name, setName] = useState('');
  const [classSection, setClassSection] = useState('Première C');
  const [attendance, setAttendance] = useState('95.0');
  const [advisor, setAdvisor] = useState('Dr. Sarah Jenkins');
  const [remarks, setRemarks] = useState('');
  
  // Subject marks state: { [subjectName]: string } (representing Note / 20)
  const [subjectMarks, setSubjectMarks] = useState<{ [sub: string]: string }>(
    DEFAULT_SUBJECTS.reduce((acc, sub) => {
      acc[sub.name] = '12.0'; // Default grade on 20
      return acc;
    }, {} as { [sub: string]: string })
  );

  const [errors, setErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleMarkChange = (subject: string, value: string) => {
    setSubjectMarks(prev => ({
      ...prev,
      [subject]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    // Basic Validation
    if (!name.trim()) newErrors.push("Le nom de l'élève est obligatoire.");
    
    const attNum = parseFloat(attendance);
    if (isNaN(attNum) || attNum < 0 || attNum > 100) {
      newErrors.push("La présence doit être un pourcentage valide entre 0 et 100.");
    }

    const results: SubjectResult[] = [];
    let anyFails = false;

    // Validate marks for all subjects
    DEFAULT_SUBJECTS.forEach(sub => {
      const noteStr = subjectMarks[sub.name];
      const note = parseFloat(noteStr);

      if (isNaN(note) || note < 0 || note > 20) {
        newErrors.push(`${sub.name} : La note doit être un nombre valide entre 0 et 20.`);
      }

      if (newErrors.length === 0) {
        const total = Math.round(note * 5); // scale up to 100
        const internal = Math.round(note * 1.5); // scale to 30
        const exam = Math.round(note * 3.5); // scale to 70

        const { grade, status } = getGradeFromTotal(total);
        if (status === 'Fail') anyFails = true;

        const remarksOptions = [
          "Démontre une excellente compréhension du cours.",
          "Travail sérieux et régulier tout au long du trimestre.",
          "Bonne maîtrise théorique. Devoirs ponctuels.",
          "Élève actif et appliqué, de bons résultats.",
          "Progression solide et constante.",
          "Très bon investissement personnel."
        ];
        // pseudo-random remark based on total score
        const remarkIdx = Math.abs((total + sub.name.length) % remarksOptions.length);
        const autoRemark = total < 50 ? "Difficultés notables. Nécessite un soutien de proximité." : remarksOptions[remarkIdx];

        results.push({
          code: `${sub.code}11`,
          name: sub.name,
          internalMarks: internal,
          examMarks: exam,
          totalMarks: total,
          grade,
          gpa: note,
          status,
          remarks: autoRemark
        });
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      // Scroll to error list
      document.getElementById('modal-errors-container')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Calculations
    let weightedSum = 0;
    let coeffSum = 0;
    const isSerieD = classSection === "Première D";
    results.forEach(res => {
      const coeff = getCoeffForSubject(res.name, isSerieD);
      weightedSum += res.gpa * coeff;
      coeffSum += coeff;
    });
    const finalGpa = parseFloat((weightedSum / coeffSum).toFixed(2));
    const rollNum = `2026-${classSection.includes("C") ? "11C" : "11D"}-0${existingCount + 1}`;

    const newRecord: StudentRecord = {
      id: `STU${Date.now()}`,
      rollNumber: rollNum,
      name: name.trim(),
      classSection,
      semester: "Term 1",
      attendance: attNum,
      gpa: finalGpa,
      rank: 0, // calculated in App.tsx dynamically
      totalStudents: existingCount + 1,
      advisorName: advisor,
      generalRemarks: remarks.trim() || `${name} a complété avec succès le programme du premier trimestre. Fait preuve de belles qualités personnelles et est bien adapté à l'environnement académique du Probatoire.`,
      results
    };

    onSave(newRecord);
    // Reset form
    setName('');
    setRemarks('');
    setErrors([]);
    onClose();
  };

  const isSerieD = classSection === "Première D";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="add-student-modal-overlay">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-full max-w-2xl border border-slate-200 flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
            <div>
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider" id="modal-heading">Ajouter un Dossier Académique</h2>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Saisir les détails et les notes pour générer un relevé officiel du Probatoire</p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-150 transition-colors"
              id="close-modal-btn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6" id="add-student-form">
            
            {/* Error Notifications */}
            {errors.length > 0 && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded space-y-1.5" id="modal-errors-container">
                <div className="flex items-center text-rose-800 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                  Veuillez corriger les erreurs de validation suivantes :
                </div>
                <ul className="list-disc list-inside text-[11px] text-rose-600 space-y-0.5 pl-1 font-medium">
                  {errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}

            {/* Part 1: Student Demographics */}
            <div>
              <h3 className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest mb-3">1. Informations sur l'Élève</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Nom Complet *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: Kota Franck Steve"
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-indigo-700 focus:border-indigo-700 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Classe / Série *</label>
                  <select
                    value={classSection}
                    onChange={(e) => {
                      setClassSection(e.target.value);
                      setAdvisor(e.target.value === 'Première C' ? 'Dr. Sarah Jenkins' : 'Prof. Marcus Vance');
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm bg-white focus:ring-1 focus:ring-indigo-700 focus:border-indigo-700 outline-none transition-all text-slate-800 font-medium"
                  >
                    <option value="Première C">Première C (Série C - Sciences Exactes)</option>
                    <option value="Première D">Première D (Série D - Sciences de la Vie)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Taux de Présence (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={attendance}
                    onChange={(e) => setAttendance(e.target.value)}
                    placeholder="ex: 95.4"
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-indigo-700 focus:border-indigo-700 outline-none transition-all font-mono font-bold text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conseiller de Classe</label>
                  <input
                    type="text"
                    value={advisor}
                    disabled
                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm bg-slate-50 text-slate-400 font-medium cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Part 2: Academic Scores Grid */}
            <div className="border-t border-slate-250 pt-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">2. Saisie des Notes</h3>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">Note maximale : 20,00 / Max : 20</span>
              </div>
              
              <div className="bg-slate-50 rounded border border-slate-200 p-4 space-y-4">
                <div className="grid grid-cols-12 gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest pb-2 border-b border-slate-200">
                  <div className="col-span-6">Matière</div>
                  <div className="col-span-3 text-center">Coeff.</div>
                  <div className="col-span-3 text-center">Note / 20</div>
                </div>

                {DEFAULT_SUBJECTS.map((sub) => {
                  const coeff = getCoeffForSubject(sub.name, isSerieD);
                  return (
                    <div key={sub.name} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6">
                        <div className="text-xs font-semibold text-slate-800">{sub.name}</div>
                        <span className="font-mono text-[9px] text-slate-400">{sub.code}11</span>
                      </div>
                      
                      <div className="col-span-3 text-center">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {coeff}
                        </span>
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.1"
                          value={subjectMarks[sub.name]}
                          onChange={(e) => handleMarkChange(sub.name, e.target.value)}
                          className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-center font-mono focus:ring-1 focus:ring-indigo-700 outline-none font-bold text-slate-800 bg-white"
                          placeholder="12.0"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Part 3: Advisor Remarks */}
            <div className="border-t border-slate-250 pt-5">
              <h3 className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest mb-3">3. Appréciation Générale</h3>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Commentaires Généraux du Conseiller (Optionnel)</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Laisser vide pour générer automatiquement une appréciation basée sur les notes..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded text-sm focus:ring-1 focus:ring-indigo-700 focus:border-indigo-700 outline-none transition-all text-slate-800 font-medium placeholder:text-slate-400 placeholder:font-normal bg-white"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="border-t border-slate-200 pt-5 flex items-center justify-end space-x-3 bg-white sticky bottom-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
                id="cancel-modal-btn"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded text-[10px] font-bold uppercase tracking-wider shadow-xs flex items-center transition-colors"
                id="save-student-btn"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Générer le Dossier
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
