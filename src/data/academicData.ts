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
  classSection: string; // e.g. "Première C", "Première D"
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
    rollNumber: "2026-11C-01",
    name: "Kota Franck Steve",
    classSection: "Première C",
    semester: "Term 1",
    attendance: 96.2,
    gpa: 16.89,
    rank: 2,
    totalStudents: 28,
    advisorName: "Dr. Sarah Jenkins",
    generalRemarks: "Franck Steve continue d'exceller dans toutes les disciplines scientifiques du Probatoire C. Son raisonnement logique et ses compétences expérimentales sont particulièrement remarquables.",
    results: [
      { code: "MAT11", name: "Mathématiques", internalMarks: 28, examMarks: 65, totalMarks: 93, grade: "Très Bien", gpa: 18.6, status: "Pass", remarks: "Excellente rigueur analytique. Raisonnement brillant." },
      { code: "PHY11", name: "Physique", internalMarks: 27, examMarks: 62, totalMarks: 89, grade: "Très Bien", gpa: 17.8, status: "Pass", remarks: "Très bonne maîtrise des concepts de cinématique." },
      { code: "CHM11", name: "Chimie", internalMarks: 26, examMarks: 58, totalMarks: 84, grade: "Très Bien", gpa: 16.8, status: "Pass", remarks: "Excellent travail pratique en laboratoire." },
      { code: "SVT11", name: "Sciences de la Vie et de la Terre (SVT)", internalMarks: 22, examMarks: 48, totalMarks: 70, grade: "Bien", gpa: 14.0, status: "Pass", remarks: "Bonne compréhension de la géologie." },
      { code: "FRA11", name: "Français", internalMarks: 21, examMarks: 49, totalMarks: 70, grade: "Bien", gpa: 14.0, status: "Pass", remarks: "Analyse littéraire de très bon niveau." },
      { code: "ANG11", name: "Anglais", internalMarks: 25, examMarks: 53, totalMarks: 78, grade: "Bien", gpa: 15.6, status: "Pass", remarks: "Très bonne expression écrite et orale." },
      { code: "HIS11", name: "Histoire-Géographie", internalMarks: 24, examMarks: 55, totalMarks: 79, grade: "Bien", gpa: 15.8, status: "Pass", remarks: "Participation très active aux séances de cartographie." },
      { code: "INF11", name: "Informatique", internalMarks: 29, examMarks: 66, totalMarks: 95, grade: "Très Bien", gpa: 19.0, status: "Pass", remarks: "Algorithmique et pensée logique impeccables." },
      { code: "ECM11", name: "Éducation Civique et Morale (ECM)", internalMarks: 26, examMarks: 58, totalMarks: 84, grade: "Très Bien", gpa: 16.8, status: "Pass", remarks: "Esprit civique et implication remarquable." }
    ]
  },
  {
    id: "STU102",
    rollNumber: "2026-11C-02",
    name: "Sophia Rodriguez",
    classSection: "Première C",
    semester: "Term 1",
    attendance: 98.5,
    gpa: 17.91,
    rank: 1,
    totalStudents: 28,
    advisorName: "Dr. Sarah Jenkins",
    generalRemarks: "Sophia est une élève exceptionnelle et un modèle pour ses camarades. Ses résultats académiques sont d'une régularité remarquable sur l'ensemble du programme de Première C.",
    results: [
      { code: "MAT11", name: "Mathématiques", internalMarks: 29, examMarks: 66, totalMarks: 95, grade: "Très Bien", gpa: 19.0, status: "Pass", remarks: "Précision de calcul et rigueur admirables." },
      { code: "PHY11", name: "Physique", internalMarks: 28, examMarks: 65, totalMarks: 93, grade: "Très Bien", gpa: 18.6, status: "Pass", remarks: "Excellente maîtrise des applications mécaniques." },
      { code: "CHM11", name: "Chimie", internalMarks: 27, examMarks: 64, totalMarks: 91, grade: "Très Bien", gpa: 18.2, status: "Pass", remarks: "Meilleure note de la classe en chimie physique." },
      { code: "SVT11", name: "Sciences de la Vie et de la Terre (SVT)", internalMarks: 25, examMarks: 56, totalMarks: 81, grade: "Très Bien", gpa: 16.2, status: "Pass", remarks: "Remarquable compréhension de la tectonique des plaques." },
      { code: "FRA11", name: "Français", internalMarks: 26, examMarks: 58, totalMarks: 84, grade: "Très Bien", gpa: 16.8, status: "Pass", remarks: "Dissertations analytiques très élaborées." },
      { code: "ANG11", name: "Anglais", internalMarks: 28, examMarks: 61, totalMarks: 89, grade: "Très Bien", gpa: 17.8, status: "Pass", remarks: "Niveau d'anglais exceptionnel." },
      { code: "HIS11", name: "Histoire-Géographie", internalMarks: 26, examMarks: 60, totalMarks: 86, grade: "Très Bien", gpa: 17.2, status: "Pass", remarks: "Excellente analyse des réformes historiques mondiales." },
      { code: "INF11", name: "Informatique", internalMarks: 28, examMarks: 63, totalMarks: 91, grade: "Très Bien", gpa: 18.2, status: "Pass", remarks: "Esprit computationnel très aiguisé." },
      { code: "ECM11", name: "Éducation Civique et Morale (ECM)", internalMarks: 27, examMarks: 61, totalMarks: 88, grade: "Très Bien", gpa: 17.6, status: "Pass", remarks: "Une attitude d'élève leader très appréciée." }
    ]
  },
  {
    id: "STU103",
    rollNumber: "2026-11C-03",
    name: "Ethan Chen",
    classSection: "Première C",
    semester: "Term 1",
    attendance: 92.0,
    gpa: 14.12,
    rank: 15,
    totalStudents: 28,
    advisorName: "Dr. Sarah Jenkins",
    generalRemarks: "Ethan possède un fort potentiel mais se laisse parfois distraire. Avec plus de rigueur dans son travail personnel, il peut viser l'excellence au second trimestre.",
    results: [
      { code: "MAT11", name: "Mathématiques", internalMarks: 20, examMarks: 47, totalMarks: 67, grade: "Assez Bien", gpa: 13.4, status: "Pass", remarks: "Capable de mieux, à travailler en algèbre." },
      { code: "PHY11", name: "Physique", internalMarks: 21, examMarks: 47, totalMarks: 68, grade: "Assez Bien", gpa: 13.6, status: "Pass", remarks: "Comprend la théorie mais a du mal à appliquer les formules." },
      { code: "CHM11", name: "Chimie", internalMarks: 23, examMarks: 50, totalMarks: 73, grade: "Bien", gpa: 14.6, status: "Pass", remarks: "Bonne implication lors des travaux pratiques." },
      { code: "SVT11", name: "Sciences de la Vie et de la Terre (SVT)", internalMarks: 20, examMarks: 45, totalMarks: 65, grade: "Assez Bien", gpa: 13.0, status: "Pass", remarks: "De bonnes analyses en biologie cellulaire." },
      { code: "FRA11", name: "Français", internalMarks: 22, examMarks: 48, totalMarks: 70, grade: "Bien", gpa: 14.0, status: "Pass", remarks: "Compréhension de lecture très perspicace." },
      { code: "ANG11", name: "Anglais", internalMarks: 24, examMarks: 52, totalMarks: 76, grade: "Bien", gpa: 15.2, status: "Pass", remarks: "Participation active et bon vocabulaire." },
      { code: "HIS11", name: "Histoire-Géographie", internalMarks: 22, examMarks: 46, totalMarks: 68, grade: "Assez Bien", gpa: 13.6, status: "Pass", remarks: "Doit approfondir les repères chronologiques." },
      { code: "INF11", name: "Informatique", internalMarks: 25, examMarks: 54, totalMarks: 79, grade: "Bien", gpa: 15.8, status: "Pass", remarks: "Très réactif pour le débogage de ses programmes." },
      { code: "ECM11", name: "Éducation Civique et Morale (ECM)", internalMarks: 23, examMarks: 48, totalMarks: 71, grade: "Bien", gpa: 14.2, status: "Pass", remarks: "Bonne attitude générale." }
    ]
  },
  {
    id: "STU104",
    rollNumber: "2026-11C-04",
    name: "Mia Thompson",
    classSection: "Première C",
    semester: "Term 1",
    attendance: 94.1,
    gpa: 12.56,
    rank: 22,
    totalStudents: 28,
    advisorName: "Dr. Sarah Jenkins",
    generalRemarks: "Mia est une élève consciencieuse et travailleuse qui fait face à des difficultés en mathématiques et physique. Sa persévérance l'aidera à surmonter ces obstacles.",
    results: [
      { code: "MAT11", name: "Mathématiques", internalMarks: 18, examMarks: 32, totalMarks: 50, grade: "Passable", gpa: 10.0, status: "Pass", remarks: "Nécessite des révisions et du soutien supplémentaire." },
      { code: "PHY11", name: "Physique", internalMarks: 17, examMarks: 35, totalMarks: 52, grade: "Passable", gpa: 10.4, status: "Pass", remarks: "Quelques difficultés avec les équations numériques, mais s'accroche." },
      { code: "CHM11", name: "Chimie", internalMarks: 21, examMarks: 44, totalMarks: 65, grade: "Assez Bien", gpa: 13.0, status: "Pass", remarks: "Travail d'évaluation continue satisfaisant." },
      { code: "SVT11", name: "Sciences de la Vie et de la Terre (SVT)", internalMarks: 19, examMarks: 38, totalMarks: 57, grade: "Passable", gpa: 11.4, status: "Pass", remarks: "Efforts constants mais la restitution des connaissances est à perfectionner." },
      { code: "FRA11", name: "Français", internalMarks: 24, examMarks: 51, totalMarks: 75, grade: "Bien", gpa: 15.0, status: "Pass", remarks: "Excellentes qualités d'écriture et figures de style maîtrisées." },
      { code: "ANG11", name: "Anglais", internalMarks: 26, examMarks: 55, totalMarks: 81, grade: "Très Bien", gpa: 16.2, status: "Pass", remarks: "Riche vocabulaire, très bonne fluidité d'expression." },
      { code: "HIS11", name: "Histoire-Géographie", internalMarks: 25, examMarks: 52, totalMarks: 77, grade: "Bien", gpa: 15.4, status: "Pass", remarks: "Intérêt marqué pour l'histoire politique." },
      { code: "INF11", name: "Informatique", internalMarks: 22, examMarks: 43, totalMarks: 65, grade: "Assez Bien", gpa: 13.0, status: "Pass", remarks: "Doit se concentrer davantage sur la modélisation logique." },
      { code: "ECM11", name: "Éducation Civique et Morale (ECM)", internalMarks: 24, examMarks: 46, totalMarks: 70, grade: "Bien", gpa: 14.0, status: "Pass", remarks: "Élève sérieuse et respectueuse." }
    ]
  },
  {
    id: "STU105",
    rollNumber: "2026-11C-05",
    name: "Liam O'Connor",
    classSection: "Première C",
    semester: "Term 1",
    attendance: 88.0,
    gpa: 10.49,
    rank: 27,
    totalStudents: 28,
    advisorName: "Dr. Sarah Jenkins",
    generalRemarks: "Les absences répétées de Liam ont lourdement affecté son niveau académique. Une présence régulière est indispensable pour éviter d'échouer au prochain trimestre.",
    results: [
      { code: "MAT11", name: "Mathématiques", internalMarks: 15, examMarks: 28, totalMarks: 43, grade: "Insuffisant", gpa: 8.6, status: "Fail", remarks: "Lacunes importantes. Nécessite une mise à niveau immédiate." },
      { code: "PHY11", name: "Physique", internalMarks: 16, examMarks: 31, totalMarks: 47, grade: "Insuffisant", gpa: 9.4, status: "Fail", remarks: "Doit réviser les formules de physique fondamentales." },
      { code: "CHM11", name: "Chimie", internalMarks: 18, examMarks: 35, totalMarks: 53, grade: "Passable", gpa: 10.6, status: "Pass", remarks: "L'absentéisme a fragilisé les notions pratiques." },
      { code: "SVT11", name: "Sciences de la Vie et de la Terre (SVT)", internalMarks: 17, examMarks: 30, totalMarks: 47, grade: "Insuffisant", gpa: 9.4, status: "Fail", remarks: "Doit approfondir l'analyse biologique." },
      { code: "FRA11", name: "Français", internalMarks: 19, examMarks: 36, totalMarks: 55, grade: "Passable", gpa: 11.0, status: "Pass", remarks: "Travaillez la structure de la dissertation." },
      { code: "ANG11", name: "Anglais", internalMarks: 21, examMarks: 42, totalMarks: 63, grade: "Assez Bien", gpa: 12.6, status: "Pass", remarks: "Bonne compréhension orale, mais manque d'exercices écrits." },
      { code: "HIS11", name: "Histoire-Géographie", internalMarks: 20, examMarks: 38, totalMarks: 58, grade: "Passable", gpa: 11.6, status: "Pass", remarks: "Peut mieux faire, souvent pénalisé par le non-respect des devoirs." },
      { code: "INF11", name: "Informatique", internalMarks: 19, examMarks: 32, totalMarks: 51, grade: "Passable", gpa: 10.2, status: "Pass", remarks: "Projets de programmation rendus en retard." },
      { code: "ECM11", name: "Éducation Civique et Morale (ECM)", internalMarks: 21, examMarks: 39, totalMarks: 60, grade: "Assez Bien", gpa: 12.0, status: "Pass", remarks: "Intérêt correct pour les notions citoyennes." }
    ]
  },
  // Première D Students
  {
    id: "STU201",
    rollNumber: "2026-11D-01",
    name: "Oliver Vance",
    classSection: "Première D",
    semester: "Term 1",
    attendance: 97.4,
    gpa: 17.51,
    rank: 1,
    totalStudents: 25,
    advisorName: "Prof. Marcus Vance",
    generalRemarks: "Oliver montre une performance exemplaire, particulièrement en SVT et en informatique. Ses compétences d'analyse et son sérieux sont remarquables.",
    results: [
      { code: "MAT11", name: "Mathématiques", internalMarks: 28, examMarks: 62, totalMarks: 90, grade: "Très Bien", gpa: 18.0, status: "Pass", remarks: "Très bonne structure d'analyse." },
      { code: "PHY11", name: "Physique", internalMarks: 27, examMarks: 61, totalMarks: 88, grade: "Très Bien", gpa: 17.6, status: "Pass", remarks: "Excellente maîtrise des concepts thermodynamiques." },
      { code: "CHM11", name: "Chimie", internalMarks: 27, examMarks: 61, totalMarks: 88, grade: "Très Bien", gpa: 17.6, status: "Pass", remarks: "Excellente compréhension de la chimie organique." },
      { code: "SVT11", name: "Sciences de la Vie et de la Terre (SVT)", internalMarks: 29, examMarks: 65, totalMarks: 94, grade: "Très Bien", gpa: 18.8, status: "Pass", remarks: "Compétence majeure pour ce profil de Première D. Brillant !" },
      { code: "FRA11", name: "Français", internalMarks: 25, examMarks: 54, totalMarks: 79, grade: "Bien", gpa: 15.8, status: "Pass", remarks: "Très bonnes analyses littéraires." },
      { code: "ANG11", name: "Anglais", internalMarks: 24, examMarks: 55, totalMarks: 79, grade: "Bien", gpa: 15.8, status: "Pass", remarks: "Style d'expression fluide et précis." },
      { code: "HIS11", name: "Histoire-Géographie", internalMarks: 25, examMarks: 58, totalMarks: 83, grade: "Très Bien", gpa: 16.6, status: "Pass", remarks: "Analyse historiographique critique." },
      { code: "INF11", name: "Informatique", internalMarks: 29, examMarks: 67, totalMarks: 96, grade: "Très Bien", gpa: 19.2, status: "Pass", remarks: "Structure logique exemplaire sur les projets." },
      { code: "ECM11", name: "Éducation Civique et Morale (ECM)", internalMarks: 26, examMarks: 58, totalMarks: 84, grade: "Très Bien", gpa: 16.8, status: "Pass", remarks: "Très bon esprit de citoyenneté active." }
    ]
  },
  {
    id: "STU202",
    rollNumber: "2026-11D-02",
    name: "Isabella Martinez",
    classSection: "Première D",
    semester: "Term 1",
    attendance: 95.0,
    gpa: 16.61,
    rank: 2,
    totalStudents: 25,
    advisorName: "Prof. Marcus Vance",
    generalRemarks: "Isabella est une élève complète qui excelle tant dans les sciences de la nature que dans les langues. Elle fait preuve d'une maturité remarquable.",
    results: [
      { code: "MAT11", name: "Mathématiques", internalMarks: 25, examMarks: 52, totalMarks: 77, grade: "Bien", gpa: 15.4, status: "Pass", remarks: "Calculs structurés et rigoureux." },
      { code: "PHY11", name: "Physique", internalMarks: 24, examMarks: 50, totalMarks: 74, grade: "Bien", gpa: 14.8, status: "Pass", remarks: "Exécution sérieuse des travaux pratiques." },
      { code: "CHM11", name: "Chimie", internalMarks: 26, examMarks: 54, totalMarks: 80, grade: "Très Bien", gpa: 16.0, status: "Pass", remarks: "Cahier d'expérimentation de grande tenue." },
      { code: "SVT11", name: "Sciences de la Vie et de la Terre (SVT)", internalMarks: 27, examMarks: 58, totalMarks: 85, grade: "Très Bien", gpa: 17.0, status: "Pass", remarks: "Passionnée de biologie humaine." },
      { code: "FRA11", name: "Français", internalMarks: 27, examMarks: 56, totalMarks: 83, grade: "Très Bien", gpa: 16.6, status: "Pass", remarks: "Qualités de rédaction et d'expression remarquables." },
      { code: "ANG11", name: "Anglais", internalMarks: 28, examMarks: 63, totalMarks: 91, grade: "Très Bien", gpa: 18.2, status: "Pass", remarks: "Anglais parfait, s'exprime avec une grande aisance." },
      { code: "HIS11", name: "Histoire-Géographie", internalMarks: 27, examMarks: 59, totalMarks: 86, grade: "Très Bien", gpa: 17.2, status: "Pass", remarks: "Devoirs argumentés et bien approfondis." },
      { code: "INF11", name: "Informatique", internalMarks: 26, examMarks: 56, totalMarks: 82, grade: "Très Bien", gpa: 16.4, status: "Pass", remarks: "Excellent esprit de collaboration en TP." },
      { code: "ECM11", name: "Éducation Civique et Morale (ECM)", internalMarks: 25, examMarks: 53, totalMarks: 78, grade: "Bien", gpa: 15.6, status: "Pass", remarks: "Prend régulièrement la parole pour des contributions utiles." }
    ]
  },
  {
    id: "STU203",
    rollNumber: "2026-11D-03",
    name: "Lucas Bennett",
    classSection: "Première D",
    semester: "Term 1",
    attendance: 91.5,
    gpa: 13.62,
    rank: 16,
    totalStudents: 25,
    advisorName: "Prof. Marcus Vance",
    generalRemarks: "Lucas montre d'excellentes aptitudes pratiques mais doit consacrer plus de temps à l'apprentissage théorique de ses cours.",
    results: [
      { code: "MAT11", name: "Mathématiques", internalMarks: 20, examMarks: 38, totalMarks: 58, grade: "Passable", gpa: 11.6, status: "Pass", remarks: "Nécessite plus d'entraînement sur les démonstrations." },
      { code: "PHY11", name: "Physique", internalMarks: 19, examMarks: 41, totalMarks: 60, grade: "Assez Bien", gpa: 12.0, status: "Pass", remarks: "Résultats satisfaisants mais perfectibles." },
      { code: "CHM11", name: "Chimie", internalMarks: 22, examMarks: 46, totalMarks: 68, grade: "Assez Bien", gpa: 13.6, status: "Pass", remarks: "Progression constante en chimie expérimentale." },
      { code: "SVT11", name: "Sciences de la Vie et de la Terre (SVT)", internalMarks: 24, examMarks: 50, totalMarks: 74, grade: "Bien", gpa: 14.8, status: "Pass", remarks: "Très bon intérêt pour la géologie du bassin sédimentaire." },
      { code: "FRA11", name: "Français", internalMarks: 22, examMarks: 45, totalMarks: 67, grade: "Assez Bien", gpa: 13.4, status: "Pass", remarks: "Devoirs réguliers et appliqués." },
      { code: "ANG11", name: "Anglais", internalMarks: 25, examMarks: 48, totalMarks: 73, grade: "Bien", gpa: 14.6, status: "Pass", remarks: "Expression orale très honorable." },
      { code: "HIS11", name: "Histoire-Géographie", internalMarks: 23, examMarks: 47, totalMarks: 70, grade: "Bien", gpa: 14.0, status: "Pass", remarks: "Bonne compréhension de la géopolitique." },
      { code: "INF11", name: "Informatique", internalMarks: 27, examMarks: 54, totalMarks: 81, grade: "Très Bien", gpa: 16.2, status: "Pass", remarks: "Impressionnant projet sur le tableur." },
      { code: "ECM11", name: "Éducation Civique et Morale (ECM)", internalMarks: 22, examMarks: 44, totalMarks: 66, grade: "Assez Bien", gpa: 13.2, status: "Pass", remarks: "Comportement exemplaire en classe." }
    ]
  },
  {
    id: "STU204",
    rollNumber: "2026-11D-04",
    name: "Ava Fitzgerald",
    classSection: "Première D",
    semester: "Term 1",
    attendance: 99.1,
    gpa: 15.93,
    rank: 7,
    totalStudents: 25,
    advisorName: "Prof. Marcus Vance",
    generalRemarks: "La présence quasi parfaite d'Ava témoigne de sa rigueur et de son implication. Elle réagit très positivement aux conseils et montre une solide progression globale.",
    results: [
      { code: "MAT11", name: "Mathématiques", internalMarks: 24, examMarks: 48, totalMarks: 72, grade: "Bien", gpa: 14.4, status: "Pass", remarks: "Résolution soignée et logique." },
      { code: "PHY11", name: "Physique", internalMarks: 23, examMarks: 51, totalMarks: 74, grade: "Bien", gpa: 14.8, status: "Pass", remarks: "Excellente analyse dans les fiches de travaux pratiques." },
      { code: "CHM11", name: "Chimie", internalMarks: 25, examMarks: 50, totalMarks: 75, grade: "Bien", gpa: 15.0, status: "Pass", remarks: "Très bonne compréhension des structures moléculaires." },
      { code: "SVT11", name: "Sciences de la Vie et de la Terre (SVT)", internalMarks: 26, examMarks: 54, totalMarks: 80, grade: "Très Bien", gpa: 16.0, status: "Pass", remarks: "Cahier de SVT exemplaire. Analyse biologique pointue." },
      { code: "FRA11", name: "Français", internalMarks: 25, examMarks: 52, totalMarks: 77, grade: "Bien", gpa: 15.4, status: "Pass", remarks: "Style d'écriture fluide et commentaires très pertinents." },
      { code: "ANG11", name: "Anglais", internalMarks: 27, examMarks: 58, totalMarks: 85, grade: "Très Bien", gpa: 17.0, status: "Pass", remarks: "Très bonne compréhension de la grammaire." },
      { code: "HIS11", name: "Histoire-Géographie", internalMarks: 26, examMarks: 59, totalMarks: 85, grade: "Très Bien", gpa: 17.0, status: "Pass", remarks: "Analyse documentaire très fouillée." },
      { code: "INF11", name: "Informatique", internalMarks: 24, examMarks: 52, totalMarks: 76, grade: "Bien", gpa: 15.2, status: "Pass", remarks: "Bonne maîtrise des bases de données." },
      { code: "ECM11", name: "Éducation Civique et Morale (ECM)", internalMarks: 25, examMarks: 53, totalMarks: 78, grade: "Bien", gpa: 15.6, status: "Pass", remarks: "Participation active aux projets citoyens du lycée." }
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
  "Français": "FRA",
  "Anglais": "ANG",
  "Histoire-Géographie": "HIS",
  "Éducation Civique et Morale (ECM)": "ECM",
  "Mathématiques": "MAT",
  "Physique": "PHY",
  "Chimie": "CHM",
  "Sciences de la Vie et de la Terre (SVT)": "SVT",
  "Informatique": "INF"
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
