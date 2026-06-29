export interface SubjectResult {
  code: string;
  name: string;
  internalMarks: number; // Max 30
  examMarks: number;     // Max 70
  totalMarks: number;    // Max 100
  grade: string;         // French Mentions (Très Bien, Bien, Assez Bien, Passable, Insuffisant)
  gpa: number;           // Note out of 20 (totalMarks / 5)
  status: 'Pass' | 'Fail';
  remarks: string;
}

export interface StudentRecord {
  id: string;
  rollNumber: string;
  name: string;
  classSection: string; // e.g. "Grade 10-A", "Grade 11-B"
  semester: string;     // e.g. "Term 1", "Term 2", "Finals"
  attendance: number;   // e.g. 94.5 (percentage)
  gpa: number;          // Moyenne Générale out of 20 (average of subject notes)
  rank: number;
  totalStudents: number;
  results: SubjectResult[];
  generalRemarks: string;
  advisorName: string;
}

export interface ClassStats {
  classSection: string;
  semester: string;
  averageGpa: number;     // Average Moyenne Générale out of 20
  passRate: number;       // percentage of students passing (Moyenne >= 10/20)
  highestGpa: number;
  lowestGpa: number;
  subjectAverages: { [subjectName: string]: number }; // Still on 100-point scale for details
  gradeDistribution: { grade: string; count: number }[];
}

export const INITIAL_STUDENTS: StudentRecord[] = [
  {
    id: "STU101",
    rollNumber: "2026-10A-01",
    name: "Kota Franck Steve",
    classSection: "Grade 10-A",
    semester: "Term 1",
    attendance: 96.2,
    gpa: 17.27,
    rank: 2,
    totalStudents: 28,
    advisorName: "Dr. Sarah Jenkins",
    generalRemarks: "Alexander continue d'exceller dans toutes les disciplines scientifiques. Son raisonnement logique et ses compétences de laboratoire sont très avancés. Il est encouragé à s'exprimer davantage lors des débats en classe.",
    results: [
      { code: "MTH10", name: "Mathématiques", internalMarks: 28, examMarks: 65, totalMarks: 93, grade: "Très Bien", gpa: 18.6, status: "Pass", remarks: "Excellente rigueur analytique. Copie d'examen parfaite." },
      { code: "PHY10", name: "Physique", internalMarks: 27, examMarks: 62, totalMarks: 89, grade: "Très Bien", gpa: 17.8, status: "Pass", remarks: "Très bonne maîtrise de la cinématique." },
      { code: "CHM10", name: "Chimie", internalMarks: 26, examMarks: 58, totalMarks: 84, grade: "Très Bien", gpa: 16.8, status: "Pass", remarks: "Excellent travail pratique et respect des consignes de sécurité." },
      { code: "ENG10", name: "Littérature Anglaise", internalMarks: 25, examMarks: 53, totalMarks: 78, grade: "Bien", gpa: 15.6, status: "Pass", remarks: "Style d'écriture créatif, nécessite des arguments plus structurés." },
      { code: "HST10", name: "Histoire-Géographie", internalMarks: 24, examMarks: 55, totalMarks: 79, grade: "Bien", gpa: 15.8, status: "Pass", remarks: "Participation très active aux tables rondes." },
      { code: "CMP10", name: "Informatique", internalMarks: 29, examMarks: 66, totalMarks: 95, grade: "Très Bien", gpa: 19.0, status: "Pass", remarks: "Structure de code impeccable et conception d'algorithmes brillante." }
    ]
  },
  {
    id: "STU102",
    rollNumber: "2026-10A-02",
    name: "Sophia Rodriguez",
    classSection: "Grade 10-A",
    semester: "Term 1",
    attendance: 98.5,
    gpa: 18.17,
    rank: 1,
    totalStudents: 28,
    advisorName: "Dr. Sarah Jenkins",
    generalRemarks: "Sophia est une élève exceptionnelle et un modèle pour ses camarades. Ses résultats académiques sont d'une régularité remarquable et elle montre une profonde curiosité intellectuelle.",
    results: [
      { code: "MTH10", name: "Mathématiques", internalMarks: 29, examMarks: 66, totalMarks: 95, grade: "Très Bien", gpa: 19.0, status: "Pass", remarks: "Précision de calcul et rigueur admirables." },
      { code: "PHY10", name: "Physique", internalMarks: 28, examMarks: 65, totalMarks: 93, grade: "Très Bien", gpa: 18.6, status: "Pass", remarks: "Saisie exceptionnelle des concepts physiques complexes." },
      { code: "CHM10", name: "Chimie", internalMarks: 27, examMarks: 64, totalMarks: 91, grade: "Très Bien", gpa: 18.2, status: "Pass", remarks: "Meilleure note de la classe en chimie physique." },
      { code: "ENG10", name: "Littérature Anglaise", internalMarks: 28, examMarks: 61, totalMarks: 89, grade: "Très Bien", gpa: 17.8, status: "Pass", remarks: "Dissertations analytiques très élaborées." },
      { code: "HST10", name: "Histoire-Géographie", internalMarks: 26, examMarks: 60, totalMarks: 86, grade: "Très Bien", gpa: 17.2, status: "Pass", remarks: "Excellente analyse des grandes réformes historiques." },
      { code: "CMP10", name: "Informatique", internalMarks: 28, examMarks: 63, totalMarks: 91, grade: "Très Bien", gpa: 18.2, status: "Pass", remarks: "Excellentes capacités en pensée computationnelle." }
    ]
  },
  {
    id: "STU103",
    rollNumber: "2026-10A-03",
    name: "Ethan Chen",
    classSection: "Grade 10-A",
    semester: "Term 1",
    attendance: 92.0,
    gpa: 14.37,
    rank: 15,
    totalStudents: 28,
    advisorName: "Dr. Sarah Jenkins",
    generalRemarks: "Ethan possède un fort potentiel mais se laisse parfois distraire en cours. Avec plus de rigueur dans son travail personnel, il peut viser l'excellence au second trimestre.",
    results: [
      { code: "MTH10", name: "Mathématiques", internalMarks: 22, examMarks: 45, totalMarks: 67, grade: "Assez Bien", gpa: 13.4, status: "Pass", remarks: "Capable de mieux, à travailler en algèbre." },
      { code: "PHY10", name: "Physique", internalMarks: 20, examMarks: 48, totalMarks: 68, grade: "Assez Bien", gpa: 13.6, status: "Pass", remarks: "Comprend la théorie mais a du mal à appliquer les formules." },
      { code: "CHM10", name: "Chimie", internalMarks: 23, examMarks: 50, totalMarks: 73, grade: "Bien", gpa: 14.6, status: "Pass", remarks: "Bonne implication lors des séances pratiques." },
      { code: "ENG10", name: "Littérature Anglaise", internalMarks: 24, examMarks: 52, totalMarks: 76, grade: "Bien", gpa: 15.2, status: "Pass", remarks: "Compréhension de lecture très perspicace." },
      { code: "HST10", name: "Histoire-Géographie", internalMarks: 22, examMarks: 46, totalMarks: 68, grade: "Assez Bien", gpa: 13.6, status: "Pass", remarks: "Doit approfondir les repères chronologiques dans ses rédactions." },
      { code: "CMP10", name: "Informatique", internalMarks: 25, examMarks: 54, totalMarks: 79, grade: "Bien", gpa: 15.8, status: "Pass", remarks: "Très réactif pour le débogage de ses programmes." }
    ]
  },
  {
    id: "STU104",
    rollNumber: "2026-10A-04",
    name: "Mia Thompson",
    classSection: "Grade 10-A",
    semester: "Term 1",
    attendance: 94.1,
    gpa: 13.00,
    rank: 22,
    totalStudents: 28,
    advisorName: "Dr. Sarah Jenkins",
    generalRemarks: "Mia est une élève consciencieuse et travailleuse qui fait face à des difficultés passagères en mathématiques et en physique. Sa progression constante et sa persévérance sont encourageantes.",
    results: [
      { code: "MTH10", name: "Mathématiques", internalMarks: 18, examMarks: 32, totalMarks: 50, grade: "Passable", gpa: 10.0, status: "Pass", remarks: "Nécessite des séances de soutien supplémentaires." },
      { code: "PHY10", name: "Physique", internalMarks: 17, examMarks: 35, totalMarks: 52, grade: "Passable", gpa: 10.4, status: "Pass", remarks: "Quelques difficultés avec les équations numériques, mais s'accroche." },
      { code: "CHM10", name: "Chimie", internalMarks: 21, examMarks: 44, totalMarks: 65, grade: "Assez Bien", gpa: 13.0, status: "Pass", remarks: "Travail d'évaluation continue tout à fait satisfaisant." },
      { code: "ENG10", name: "Littérature Anglaise", internalMarks: 26, examMarks: 55, totalMarks: 81, grade: "Très Bien", gpa: 16.2, status: "Pass", remarks: "Excellentes qualités d'écriture et figures de style maîtrisées." },
      { code: "HST10", name: "Histoire-Géographie", internalMarks: 25, examMarks: 52, totalMarks: 77, grade: "Bien", gpa: 15.4, status: "Pass", remarks: "Intérêt marqué pour l'histoire politique." },
      { code: "CMP10", name: "Informatique", internalMarks: 22, examMarks: 43, totalMarks: 65, grade: "Assez Bien", gpa: 13.0, status: "Pass", remarks: "Doit se concentrer davantage sur les structures logiques." }
    ]
  },
  {
    id: "STU105",
    rollNumber: "2026-10A-05",
    name: "Liam O'Connor",
    classSection: "Grade 10-A",
    semester: "Term 1",
    attendance: 88.0,
    gpa: 10.50,
    rank: 27,
    totalStudents: 28,
    advisorName: "Dr. Sarah Jenkins",
    generalRemarks: "Les absences répétées de Liam ont lourdement affecté son niveau académique. Il a manqué des notions clés. Une présence régulière est indispensable pour éviter d'échouer au prochain trimestre.",
    results: [
      { code: "MTH10", name: "Mathématiques", internalMarks: 15, examMarks: 28, totalMarks: 43, grade: "Insuffisant", gpa: 8.6, status: "Fail", remarks: "Devoirs non rendus. Nécessite une mise à niveau immédiate." },
      { code: "PHY10", name: "Physique", internalMarks: 16, examMarks: 31, totalMarks: 47, grade: "Insuffisant", gpa: 9.4, status: "Fail", remarks: "Échec de justesse. Doit réviser les formules fondamentales." },
      { code: "CHM10", name: "Chimie", internalMarks: 18, examMarks: 35, totalMarks: 53, grade: "Passable", gpa: 10.6, status: "Pass", remarks: "L'absentéisme a fragilisé les rapports pratiques." },
      { code: "ENG10", name: "Littérature Anglaise", internalMarks: 21, examMarks: 42, totalMarks: 63, grade: "Assez Bien", gpa: 12.6, status: "Pass", remarks: "Montre de la compréhension de lecture mais manque d'essais rédigés." },
      { code: "HST10", name: "Histoire-Géographie", internalMarks: 20, examMarks: 38, totalMarks: 58, grade: "Passable", gpa: 11.6, status: "Pass", remarks: "Peut mieux faire, souvent pénalisé par le non-respect des dates." },
      { code: "CMP10", name: "Informatique", internalMarks: 19, examMarks: 32, totalMarks: 51, grade: "Passable", gpa: 10.2, status: "Pass", remarks: "Projets de programmation souvent rendus en retard ou incomplets." }
    ]
  },
  // Grade 11-B Students
  {
    id: "STU201",
    rollNumber: "2026-11B-01",
    name: "Oliver Vance",
    classSection: "Grade 11-B",
    semester: "Term 1",
    attendance: 97.4,
    gpa: 17.67,
    rank: 1,
    totalStudents: 25,
    advisorName: "Prof. Marcus Vance",
    generalRemarks: "Oliver montre une performance exemplaire en analyse et en informatique. Ses compétences analytiques et son attention aux détails sont remarquables. Continuez ainsi !",
    results: [
      { code: "MTH11", name: "Mathématiques", internalMarks: 29, examMarks: 65, totalMarks: 94, grade: "Très Bien", gpa: 18.8, status: "Pass", remarks: "Clarté analytique exceptionnelle." },
      { code: "PHY11", name: "Physique", internalMarks: 28, examMarks: 62, totalMarks: 90, grade: "Très Bien", gpa: 18.0, status: "Pass", remarks: "Excellente maîtrise des applications thermodynamiques." },
      { code: "CHM11", name: "Chimie", internalMarks: 27, examMarks: 61, totalMarks: 88, grade: "Très Bien", gpa: 17.6, status: "Pass", remarks: "Excellente compréhension de la synthèse organique." },
      { code: "ENG11", name: "Littérature Anglaise", internalMarks: 24, examMarks: 55, totalMarks: 79, grade: "Bien", gpa: 15.8, status: "Pass", remarks: "Très bonnes analyses littéraires." },
      { code: "HST11", name: "Histoire-Géographie", internalMarks: 25, examMarks: 58, totalMarks: 83, grade: "Très Bien", gpa: 16.6, status: "Pass", remarks: "Analyse historiographique critique et rigoureuse." },
      { code: "CMP11", name: "Informatique", internalMarks: 29, examMarks: 67, totalMarks: 96, grade: "Très Bien", gpa: 19.2, status: "Pass", remarks: "Structure logique exemplaire. Note parfaite sur les projets." }
    ]
  },
  {
    id: "STU202",
    rollNumber: "2026-11B-02",
    name: "Isabella Martinez",
    classSection: "Grade 11-B",
    semester: "Term 1",
    attendance: 95.0,
    gpa: 16.33,
    rank: 5,
    totalStudents: 25,
    advisorName: "Prof. Marcus Vance",
    generalRemarks: "Isabella est une élève complète qui équilibre parfaitement les matières scientifiques et la littérature. Elle a d'excellentes compétences en communication et aide volontiers ses pairs.",
    results: [
      { code: "MTH11", name: "Mathématiques", internalMarks: 25, examMarks: 52, totalMarks: 77, grade: "Bien", gpa: 15.4, status: "Pass", remarks: "Doit acquérir plus de rapidité lors des évaluations." },
      { code: "PHY11", name: "Physique", internalMarks: 24, examMarks: 50, totalMarks: 74, grade: "Bien", gpa: 14.8, status: "Pass", remarks: "Exécution rigoureuse des travaux expérimentaux." },
      { code: "CHM11", name: "Chimie", internalMarks: 26, examMarks: 54, totalMarks: 80, grade: "Très Bien", gpa: 16.0, status: "Pass", remarks: "Cahier de laboratoire de grande tenue." },
      { code: "ENG11", name: "Littérature Anglaise", internalMarks: 28, examMarks: 63, totalMarks: 91, grade: "Très Bien", gpa: 18.2, status: "Pass", remarks: "Qualités de rédaction et d'expression remarquables." },
      { code: "HST11", name: "Histoire-Géographie", internalMarks: 27, examMarks: 59, totalMarks: 86, grade: "Très Bien", gpa: 17.2, status: "Pass", remarks: "Devoirs très structurés et approfondis." },
      { code: "CMP11", name: "Informatique", internalMarks: 26, examMarks: 56, totalMarks: 82, grade: "Très Bien", gpa: 16.4, status: "Pass", remarks: "Excellent travail d'équipe lors des projets collectifs." }
    ]
  },
  {
    id: "STU203",
    rollNumber: "2026-11B-03",
    name: "Lucas Bennett",
    classSection: "Grade 11-B",
    semester: "Term 1",
    attendance: 91.5,
    gpa: 13.67,
    rank: 16,
    totalStudents: 25,
    advisorName: "Prof. Marcus Vance",
    generalRemarks: "Lucas montre d'excellentes aptitudes, notamment en TP d'informatique, mais doit consacrer plus de temps à l'apprentissage de ses formules de mathématiques et de physique.",
    results: [
      { code: "MTH11", name: "Mathématiques", internalMarks: 20, examMarks: 38, totalMarks: 58, grade: "Passable", gpa: 11.6, status: "Pass", remarks: "Des difficultés à résoudre les problèmes sans aide." },
      { code: "PHY11", name: "Physique", internalMarks: 19, examMarks: 41, totalMarks: 60, grade: "Assez Bien", gpa: 12.0, status: "Pass", remarks: "Travaillez les exercices d'application avec plus d'assiduité." },
      { code: "CHM11", name: "Chimie", internalMarks: 22, examMarks: 46, totalMarks: 68, grade: "Assez Bien", gpa: 13.6, status: "Pass", remarks: "Progression constante en travaux pratiques." },
      { code: "ENG11", name: "Littérature Anglaise", internalMarks: 25, examMarks: 48, totalMarks: 73, grade: "Bien", gpa: 14.6, status: "Pass", remarks: "Participation orale active, rédactions structurées." },
      { code: "HST11", name: "Histoire-Géographie", internalMarks: 23, examMarks: 47, totalMarks: 70, grade: "Bien", gpa: 14.0, status: "Pass", remarks: "Bonne compréhension globale." },
      { code: "CMP11", name: "Informatique", internalMarks: 27, examMarks: 54, totalMarks: 81, grade: "Très Bien", gpa: 16.2, status: "Pass", remarks: "Impressionnant projet de programmation orientée objet." }
    ]
  },
  {
    id: "STU204",
    rollNumber: "2026-11B-04",
    name: "Ava Fitzgerald",
    classSection: "Grade 11-B",
    semester: "Term 1",
    attendance: 99.1,
    gpa: 15.57,
    rank: 7,
    totalStudents: 25,
    advisorName: "Prof. Marcus Vance",
    generalRemarks: "La présence quasi parfaite d'Ava témoigne de sa rigueur et de son implication. Elle réagit très positivement aux conseils et montre une solide progression.",
    results: [
      { code: "MTH11", name: "Mathématiques", internalMarks: 24, examMarks: 48, totalMarks: 72, grade: "Bien", gpa: 14.4, status: "Pass", remarks: "Résolution structurée et présentation soignée." },
      { code: "PHY11", name: "Physique", internalMarks: 23, examMarks: 51, totalMarks: 74, grade: "Bien", gpa: 14.8, status: "Pass", remarks: "Excellentes analyses dans le cahier de TP." },
      { code: "CHM11", name: "Chimie", internalMarks: 25, examMarks: 50, totalMarks: 75, grade: "Bien", gpa: 15.0, status: "Pass", remarks: "Bonne compréhension des mécanismes chimiques." },
      { code: "ENG11", name: "Littérature Anglaise", internalMarks: 27, examMarks: 58, totalMarks: 85, grade: "Très Bien", gpa: 17.0, status: "Pass", remarks: "Style recherché et références bibliographiques soignées." },
      { code: "HST11", name: "Histoire-Géographie", internalMarks: 26, examMarks: 59, totalMarks: 85, grade: "Très Bien", gpa: 17.0, status: "Pass", remarks: "Recherche approfondie et de grande qualité dans son mémoire." },
      { code: "CMP11", name: "Informatique", internalMarks: 24, examMarks: 52, totalMarks: 76, grade: "Bien", gpa: 15.2, status: "Pass", remarks: "Code très propre, bien structuré et commenté." }
    ]
  }
];

export function calculateClassStats(students: StudentRecord[], classSection: string, semester: string): ClassStats {
  const filtered = students.filter(s => s.classSection === classSection && s.semester === semester);
  
  if (filtered.length === 0) {
    return {
      classSection,
      semester,
      averageGpa: 0,
      passRate: 0,
      highestGpa: 0,
      lowestGpa: 0,
      subjectAverages: {},
      gradeDistribution: []
    };
  }

  const totalStudents = filtered.length;
  const gpas = filtered.map(s => s.gpa);
  const averageGpa = parseFloat((gpas.reduce((a, b) => a + b, 0) / totalStudents).toFixed(2));
  const highestGpa = Math.max(...gpas);
  const lowestGpa = Math.min(...gpas);

  // In the French system, a student passes (Admis) if their overall GPA (Moyenne Générale) is >= 10.00
  let passCount = 0;
  filtered.forEach(student => {
    if (student.gpa >= 10.0) {
      passCount++;
    }
  });
  const passRate = Math.round((passCount / totalStudents) * 100);

  // Subject averages
  const subjectTotals: { [name: string]: number } = {};
  const subjectCounts: { [name: string]: number } = {};
  
  filtered.forEach(student => {
    student.results.forEach(res => {
      subjectTotals[res.name] = (subjectTotals[res.name] || 0) + res.totalMarks;
      subjectCounts[res.name] = (subjectCounts[res.name] || 0) + 1;
    });
  });

  const subjectAverages: { [name: string]: number } = {};
  Object.keys(subjectTotals).forEach(subj => {
    subjectAverages[subj] = parseFloat((subjectTotals[subj] / subjectCounts[subj]).toFixed(1));
  });

  // Grade distributions (Moyenne brackets based on French scale)
  const dist = { 'TBien': 0, 'Bien': 0, 'ABien': 0, 'Passable': 0, 'Ajourne': 0 };
  filtered.forEach(student => {
    if (student.gpa >= 16.0) dist['TBien']++;
    else if (student.gpa >= 14.0) dist['Bien']++;
    else if (student.gpa >= 12.0) dist['ABien']++;
    else if (student.gpa >= 10.0) dist['Passable']++;
    else dist['Ajourne']++;
  });

  const gradeDistribution = [
    { grade: 'Très Bien (16.0 - 20.0)', count: dist['TBien'] },
    { grade: 'Bien (14.0 - 15.99)', count: dist['Bien'] },
    { grade: 'Assez Bien (12.0 - 13.99)', count: dist['ABien'] },
    { grade: 'Passable (10.0 - 11.99)', count: dist['Passable'] },
    { grade: 'Insuffisant (< 10.0)', count: dist['Ajourne'] }
  ];

  return {
    classSection,
    semester,
    averageGpa,
    passRate,
    highestGpa,
    lowestGpa,
    subjectAverages,
    gradeDistribution
  };
}

export const SUBJECT_CODES: { [name: string]: string } = {
  "Mathématiques": "MTH",
  "Physique": "PHY",
  "Chimie": "CHM",
  "Littérature Anglaise": "ENG",
  "Histoire-Géographie": "HST",
  "Informatique": "CMP"
};

export function getGradeFromTotal(total: number): { grade: string; gpa: number; status: 'Pass' | 'Fail' } {
  // French scale: 0 to 20
  const note20 = parseFloat((total / 5).toFixed(2));
  let status: 'Pass' | 'Fail' = 'Pass';
  let grade = "Passable";

  if (note20 >= 16) {
    grade = "Très Bien";
  } else if (note20 >= 14) {
    grade = "Bien";
  } else if (note20 >= 12) {
    grade = "Assez Bien";
  } else if (note20 >= 10) {
    grade = "Passable";
  } else {
    grade = "Insuffisant";
    status = "Fail";
  }

  return { grade, gpa: note20, status };
}
