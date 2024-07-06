
enum Course_Type{
    AP = "AP",
    Honours = "Honours",
    Regular = "Regular",
}

const Weights = {
    AP: Big(1.0),
    Honours: Big(0.5),
    Regular: Big(0.0),
}


enum Grade_Type{
    A_plus = "A+",
    A_base = "A",
    A_minus = "A-",
    B_plus = "B+",
    B_base = "B",
    B_minus = "B-",
    C_plus = "C+",
    C_base = "C",
    C_minus = "C-",
    D_plus = "D+",
    D_base = "D",
    D_minus = "D-",

    F_master = "F",
}


enum AP_Course {
    Research = "Research",
    Seminar = "Seminar",
    
    Drawing = "Drawing",
    Art_History = "Art History",
    Music_Theory = "Music Theory",
    TwoD_Art_And_Design = "2D Art and Design",
    ThreeD_Art_And_Design = "3D Art and Design",
    
    English_Literature_And_Composition = "English Literature and Composition",
    English_Language_And_Composition = "English Language and Composition",
    
    Comparative_Government_And_Politics = "Comparative Government and Politics",
    European_History = "European History",
    Human_Geography = "Human Geography",
    Macroeconomics = "Macroeconomics",
    Microeconomics = "Microeconomics",
    Psychology = "Psychology",
    United_States_Government_And_Politics = "United States Government and Politics",
    United_States_History = "United States History",
    World_History_Modern = "World History: Modern",
    
    Calculus_AB = "Calculus AB",
    Calculus_BC = "Calculus BC",
    Computer_Science_A = "Computer Science A",
    Computer_Science_Principles = "Computer Science Principles",
    Precalculus = "Precalculus",
    Statistics = "Statistics",
    
    Biology = "Biology",
    Chemistry = "Chemistry",
    Environmental_Science = "Environmental Science",
    Physics_A = "Physics A",
    Physics_B = "Physics B",
    Physics_C_Electricity_And_Magnetism = "Physics C: Electricity and Magnetism",
    Physics_C_Mechanics = "Physics C: Mechanics",
    
    Chinese_Language_And_Culture = "Chinese Language and Culture",
    French_Language_And_Culture = "French Language and Culture",
    German_Language_And_Culture = "German Language and Culture",
    Italian_Language_And_Culture = "Italian Language and Culture",
    Japanese_Language_And_Culture = "Japanese Language and Culture",
    Latin = "Latin",
    Spanish_Language_And_Culture = "Spanish Language and Culture",
    Spanish_Literature_And_Culture = "Spanish Literature and Culture",
}

enum AP_Score {
    S_5 = "5",
    S_4 = "4",
    S_3 = "3",
    S_2 = "2",
    S_1 = "1",
    NA = "N/A",
}

class Grading_Scale{

    constructor(
        public name: string,
        public gradePercentPoint: {"gradeType": Grade_Type, "percent": {"min": Big, "max": Big},"points": Big}[],
        public maxPoints: Big,
    ){}

    gradePercentCourse(percent: Big): Grade_Type{
        for (let i = 0; i < this.gradePercentPoint.length; i++){
            if(this.gradePercentPoint[i].percent.min.lte(percent) && this.gradePercentPoint[i].percent.max.gte(percent)){
                return this.gradePercentPoint[i].gradeType;
            }
        }
        return Grade_Type.F_master;
    }

    pointGradeCourse(grade: Grade_Type): Big{
        if (grade == Grade_Type.F_master) {
            return Big(0.0);
        }
        for (let i = 0; i < this.gradePercentPoint.length; i++){
            if(this.gradePercentPoint[i].gradeType == grade){
                return this.gradePercentPoint[i].points;
            }
        }
        return Big(0.0); //F_master
    }

    singleGP(percent: Big, courseType : Course_Type, weighted: boolean): Big {
        let grade = this.gradePercentCourse(percent);
        let gp = this.pointGradeCourse(grade);
        if (weighted && grade != Grade_Type.F_master) {
            gp = gp.plus(Weights[courseType]);
        }
        return gp;
    }

    multiGPA(courses: {"courseType": Course_Type, "percent": Big}[], weighted: boolean): Big {
        let gp = Big(0.0);
        for (let i = 0; i < courses.length; i++){
            gp = gp.plus(this.singleGP(courses[i].percent, courses[i].courseType, weighted));
        }
        return gp.div(Big(courses.length));
    }

}

const GradingScales: Grading_Scale[] = [
    new Grading_Scale(
        "Canada - British Columbia",
        [
            { gradeType: Grade_Type.A_plus, percent: { min: Big(90), max: Big(100) }, points: Big(4.0) },
            { gradeType: Grade_Type.A_base, percent: { min: Big(85), max: Big(89.99) }, points: Big(4.0) },
            { gradeType: Grade_Type.A_minus, percent: { min: Big(80), max: Big(84.99) }, points: Big(3.7) },
            { gradeType: Grade_Type.B_plus, percent: { min: Big(76), max: Big(79.99) }, points: Big(3.3) },
            { gradeType: Grade_Type.B_base, percent: { min: Big(72), max: Big(75.99) }, points: Big(3.0) },
            { gradeType: Grade_Type.B_minus, percent: { min: Big(68), max: Big(71.99) }, points: Big(2.7) },
            { gradeType: Grade_Type.C_plus, percent: { min: Big(64), max: Big(67.99) }, points: Big(2.3) },
            { gradeType: Grade_Type.C_base, percent: { min: Big(60), max: Big(63.99) }, points: Big(2.0) },
            { gradeType: Grade_Type.C_minus, percent: { min: Big(55), max: Big(59.99) }, points: Big(1.7) },
            { gradeType: Grade_Type.D_base, percent: { min: Big(50), max: Big(54.99) }, points: Big(1.0) },
        ],
        Big(4.0),
    ),
    new Grading_Scale(
        "CollegeBoard / US",
        [
            { gradeType: Grade_Type.A_plus, percent: { min: Big(97), max: Big(100) }, points: Big(4.0) },
            { gradeType: Grade_Type.A_base, percent: { min: Big(93), max: Big(96) }, points: Big(4.0) },
            { gradeType: Grade_Type.A_minus, percent: { min: Big(90), max: Big(92) }, points: Big(3.7) },
            { gradeType: Grade_Type.B_plus, percent: { min: Big(87), max: Big(89) }, points: Big(3.3) },
            { gradeType: Grade_Type.B_base, percent: { min: Big(83), max: Big(86) }, points: Big(3.0) },
            { gradeType: Grade_Type.B_minus, percent: { min: Big(80), max: Big(82) }, points: Big(2.7) },
            { gradeType: Grade_Type.C_plus, percent: { min: Big(77), max: Big(79) }, points: Big(2.3) },
            { gradeType: Grade_Type.C_base, percent: { min: Big(73), max: Big(76) }, points: Big(2.0) },
            { gradeType: Grade_Type.C_minus, percent: { min: Big(70), max: Big(72) }, points: Big(1.7) },
            { gradeType: Grade_Type.D_plus, percent: { min: Big(67), max: Big(69) }, points: Big(1.3) },
            { gradeType: Grade_Type.D_base, percent: { min: Big(65), max: Big(66) }, points: Big(1.0) },
        ],
        Big(4.0),
    ),
    // new Grading_Scale(
    //     "Dutchess/ Kalamazoo/ Carleton/ Wellesley/ UC Berkeley",
    //     [
    //         { gradeType: Grade_Type.A_plus, percent: { min: Big(97), max: Big(100) }, points: Big(4.0) },
    //         { gradeType: Grade_Type.A_base, percent: { min: Big(93), max: Big(96) }, points: Big(3.9) },
    //         { gradeType: Grade_Type.A_minus, percent: { min: Big(90), max: Big(92) }, points: Big(3.7) },
    //         { gradeType: Grade_Type.B_plus, percent: { min: Big(87), max: Big(89) }, points: Big(3.3) },
    //         { gradeType: Grade_Type.B_base, percent: { min: Big(83), max: Big(86) }, points: Big(3.0) },
    //         { gradeType: Grade_Type.B_minus, percent: { min: Big(80), max: Big(82) }, points: Big(2.7) },
    //         { gradeType: Grade_Type.C_plus, percent: { min: Big(77), max: Big(79) }, points: Big(2.3) },
    //         { gradeType: Grade_Type.C_base, percent: { min: Big(73), max: Big(76) }, points: Big(2.0) },
    //         { gradeType: Grade_Type.C_minus, percent: { min: Big(70), max: Big(72) }, points: Big(1.7) },
    //         { gradeType: Grade_Type.D_plus, percent: { min: Big(67), max: Big(69) }, points: Big(1.3) },
    //         { gradeType: Grade_Type.D_base, percent: { min: Big(63), max: Big(66) }, points: Big(1.0) },
    //         { gradeType: Grade_Type.D_minus, percent: { min: Big(60), max: Big(62) }, points: Big(0.7) },
    //     ],
    //     Big(4.0),
    // ),

]

class CollegeCredits{

    constructor(
        public name: string,
        public APcourseTransferCredit: {apCourse: AP_Course, credit: string | null, equivalent: string | null, additionalInfo: string | null}[],
        public minAP_Score: AP_Score,
        public creditLimit: Big | null,
    ){}

    APcourseTransfer(apCourse: AP_Course): {apCourse: AP_Course, credit: string | null, equivalent: string | null, additionalInfo: string | null} | null{
        for (let i = 0; i < this.APcourseTransferCredit.length; i++) {
            if (this.APcourseTransferCredit[i].apCourse == apCourse) {
                return this.APcourseTransferCredit[i];
            }
        }
        return null;
    }
    APcoursesTransfer(apCourses: AP_Course[]): {apCourse: AP_Course, credit: string | null, equivalent: string | null, additionalInfo: string | null}[]{
        let apCoursesTransfer: {apCourse: AP_Course, credit: string | null, equivalent: string | null, additionalInfo: string | null}[] = [];
        for (let i = 0; i < apCourses.length; i++) {
            let apCourseTransfer = this.APcourseTransfer(apCourses[i]);
            if (apCourseTransfer != null) {
                apCoursesTransfer.push(apCourseTransfer);
            }
        }
        return apCoursesTransfer;
    }
}

const CreditColleges: CollegeCredits[] = [
    new CollegeCredits(
        "Massachusetts Institute of Technology (MIT)",
        [
            { apCourse: AP_Course.Calculus_BC, credit: null, equivalent: "18.01", additionalInfo: null },
            { apCourse: AP_Course.Calculus_AB, credit: null, equivalent: "18.01A/18.02A", additionalInfo: "Allows you to enroll in the accelerated Calculus Sequence." },

            { apCourse: AP_Course.Physics_C_Electricity_And_Magnetism, credit: null, equivalent: "8.01", additionalInfo: "Credit granted only if a score of 5 was achieved in AP Physics C: Mechanics aswell." },
            { apCourse: AP_Course.Physics_C_Mechanics, credit: null, equivalent: "8.01", additionalInfo: "Credit granted only if a score of 5 was achieved in AP Physics C: Electricity and Magnetism aswell." },
            
            { apCourse: AP_Course.Research, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "Credit granted only if a score of 5 was achieved in AP Seminar aswell. The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.Seminar, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "Credit granted only if a score of 5 was achieved in AP Research aswell. The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            
            { apCourse: AP_Course.Drawing, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.Art_History, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.Music_Theory, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.TwoD_Art_And_Design, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.ThreeD_Art_And_Design, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            
            { apCourse: AP_Course.English_Literature_And_Composition, credit: "9 units of unrestricted elective credit", equivalent: "First Year Essay Evaluation (FEE)", additionalInfo: "In addition to the credit, you will be placed in the  \"CI-H/CI-HW Required\" category without the FEE. You are still required to take a (CI-HW or CI-H) Subject you first year as a part of the Communication Requirement. The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.English_Language_And_Composition, credit: "9 units of unrestricted elective credit", equivalent: "First Year Essay Evaluation (FEE)", additionalInfo: "In addition to the credit, you will be placed in the  \"CI-H/CI-HW Required\" category without the FEE. You are still required to take a (CI-HW or CI-H) Subject you first year as a part of the Communication Requirement. The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            
            { apCourse: AP_Course.Comparative_Government_And_Politics, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.European_History, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.Human_Geography, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.Macroeconomics, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.Microeconomics, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.Psychology, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.United_States_Government_And_Politics, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.United_States_History, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.World_History_Modern, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },

            { apCourse: AP_Course.Chinese_Language_And_Culture, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.French_Language_And_Culture, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.German_Language_And_Culture, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.Italian_Language_And_Culture, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.Japanese_Language_And_Culture, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.Latin, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.Spanish_Language_And_Culture, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },
            { apCourse: AP_Course.Spanish_Literature_And_Culture, credit: "9 units of unrestricted elective credit", equivalent: null, additionalInfo: "The credit granted cannot be used to satisfy any part of the HASS Requirement." },

        ],
        AP_Score.S_5,
        null,
    ),
    new CollegeCredits(
        "University of British Columbia (UBC)",
        [
            { apCourse: AP_Course.TwoD_Art_And_Design, credit: "3", equivalent: "VISA 1st-year level", additionalInfo: null },
            { apCourse: AP_Course.ThreeD_Art_And_Design, credit: "3", equivalent: "VISA 180", additionalInfo: null },
            { apCourse: AP_Course.Art_History, credit: "3+3", equivalent: "ARTH 101 + ARTH 102", additionalInfo: null },
            { apCourse: AP_Course.Biology, credit: "8", equivalent: "BIOL 1st-year level", additionalInfo: "Exemption from BIOL 111, BIOL 121, and BIOL 180." },
            { apCourse: AP_Course.Calculus_AB, credit: "3", equivalent: "Math 100", additionalInfo: null }, // subscore aswell
            { apCourse: AP_Course.Calculus_BC, credit: "3+3", equivalent: "Math 100 + Math 101", additionalInfo: null },
            { apCourse: AP_Course.Chemistry, credit: "4", equivalent: "CHEM 121", additionalInfo: "Students entering the BASc degree will be granted an exemption from CHEM 154." },
            { apCourse: AP_Course.Chinese_Language_And_Culture, credit: "3+3", equivalent: "CHIN 241 + CHIN 243", additionalInfo: null },
            { apCourse: AP_Course.Computer_Science_A, credit: "3", equivalent: "CPSC 1st-year level", additionalInfo: null },
            { apCourse: AP_Course.Computer_Science_Principles, credit: "3", equivalent: "CPSC 100", additionalInfo: null },
            { apCourse: AP_Course.Drawing, credit: "3", equivalent: "VISA 180", additionalInfo: null },
            { apCourse: AP_Course.Macroeconomics, credit: "3", equivalent: "ECON 102", additionalInfo: "OR ECON 1st-year level for the Bachelor of International Economics degree." },
            { apCourse: AP_Course.Microeconomics, credit: "3", equivalent: "ECON 101", additionalInfo: "OR ECON 1st-year level for the Bachelor of International Economics degree." },
            { apCourse: AP_Course.English_Language_And_Composition, credit: "6", equivalent: "ENGL 1st-year level", additionalInfo: "When AP English Literature and Composition & AP Language and Composition are taken together, credit is granted as ENGL 1st-year level (12)." },
            { apCourse: AP_Course.English_Literature_And_Composition, credit: "6", equivalent: "ENGL 1st-year level", additionalInfo: "When AP English Literature and Composition & AP Language and Composition are taken together, credit is granted as ENGL 1st-year level (12)." },
            { apCourse: AP_Course.Environmental_Science, credit: "3", equivalent: "EOSC 1st-year level", additionalInfo: null },
            { apCourse: AP_Course.French_Language_And_Culture, credit: "3+3", equivalent: "FREN 301 + FREN 302", additionalInfo: null },
            { apCourse: AP_Course.German_Language_And_Culture, credit: "3+3", equivalent: "GERN 301 + GERN 2nd-year level", additionalInfo: null },
            { apCourse: AP_Course.Comparative_Government_And_Politics, credit: "3", equivalent: "POLI 220", additionalInfo: null },
            { apCourse: AP_Course.European_History, credit: "3", equivalent: "HIST 1st-year level", additionalInfo: null },
            { apCourse: AP_Course.United_States_History, credit: "3", equivalent: "HIST 1st-year level", additionalInfo: null },
            { apCourse: AP_Course.Human_Geography, credit: "3+3", equivalent: "GEOG 122 + GEOG 1st-year level", additionalInfo: null },
            { apCourse: AP_Course.Italian_Language_And_Culture, credit: "3+3", equivalent: "ITAL 201 + ITAL 202", additionalInfo: null },
            { apCourse: AP_Course.Japanese_Language_And_Culture, credit: "3+3", equivalent: "JAPN 100 + JAPN 101", additionalInfo: null },
            { apCourse: AP_Course.Latin, credit: "3+3", equivalent: "LATN 201 + LATN 2nd-year level", additionalInfo: null },
            { apCourse: AP_Course.Music_Theory, credit: "6", equivalent: "MUSC 1st-year level", additionalInfo: null },
            { apCourse: AP_Course.Physics_C_Electricity_And_Magnetism, credit: "3", equivalent: "PHYS 118", additionalInfo: null },
            { apCourse: AP_Course.Physics_C_Mechanics, credit: "3", equivalent: "PHYS 117", additionalInfo: null },
            { apCourse: AP_Course.Psychology, credit: "6", equivalent: "PSYC 100", additionalInfo: null },
            { apCourse: AP_Course.Spanish_Language_And_Culture, credit: "3+3", equivalent: "SPAN 201 + SPAN 202", additionalInfo: null },
            { apCourse: AP_Course.Spanish_Literature_And_Culture, credit: "3+3", equivalent: "SPAN 221 + SPAN 222", additionalInfo: null },
            { apCourse: AP_Course.Statistics, credit: "3", equivalent: "STAT 200", additionalInfo: null },
            { apCourse: AP_Course.United_States_Government_And_Politics, credit: "3", equivalent: "POLI 1st-year level", additionalInfo: null },
            { apCourse: AP_Course.World_History_Modern, credit: "3", equivalent: "HIST 1st-year level", additionalInfo: null },
        ],
        AP_Score.S_4,
        null
    ),
    new CollegeCredits(
        "University of Toronto (UT or UFT)",
        [
            { apCourse: AP_Course.Biology, credit: "1.0", equivalent: "BIO130H1", additionalInfo: "This credit is acceptable for admission into the joint EEB-CSB programs and Life Science programs." },
            { apCourse: AP_Course.Art_History, credit: "1.0", equivalent: "VIS1**Y", additionalInfo: null },
            { apCourse: AP_Course.Chemistry, credit: "1.0", equivalent: "CHM1**Y", additionalInfo: null },
            { apCourse: AP_Course.Chinese_Language_And_Culture, credit: "1.0", equivalent: "EAS1**Y", additionalInfo: null },
            { apCourse: AP_Course.Computer_Science_A, credit: "0.5", equivalent: "CSC1**H", additionalInfo: null},
            { apCourse: AP_Course.Computer_Science_Principles, credit: "0.5", equivalent: "CSC104H1", additionalInfo: null },
            { apCourse: AP_Course.English_Language_And_Composition, credit: "0.5", equivalent: "ENG1**H", additionalInfo: null },
            { apCourse: AP_Course.English_Literature_And_Composition, credit: "0.5", equivalent: "ENG1**H", additionalInfo: null },
            { apCourse: AP_Course.Environmental_Science, credit: "0.5", equivalent: "ENV1**H", additionalInfo: null },
            { apCourse: AP_Course.European_History, credit: "1.0", equivalent: "HIS1**Y", additionalInfo: null },
            { apCourse: AP_Course.Comparative_Government_And_Politics, credit: "1.0", equivalent: "POL1**Y", additionalInfo: "If you wish to pursue a program in Political Science, you must enrol in 1.0 credit from specified courses." },
            { apCourse: AP_Course.Art_History, credit: "1.0", equivalent: "FAH101H1", additionalInfo: null },
            { apCourse: AP_Course.Japanese_Language_And_Culture, credit: "1.0", equivalent: "EAS1**Y", additionalInfo: null },
            { apCourse: AP_Course.Latin, credit: "1.0", equivalent: "LAT1**Y", additionalInfo: null },
            { apCourse: AP_Course.Macroeconomics, credit: "0.5", equivalent: "ECO1**H", additionalInfo: null },
            { apCourse: AP_Course.Microeconomics, credit: "0.5", equivalent: "ECO1**H", additionalInfo: null },
            { apCourse: AP_Course.Physics_A, credit: "0.5", equivalent: "PHY131H1", additionalInfo: null },
            { apCourse: AP_Course.Physics_B, credit: "0.5+0.5", equivalent: "PHY131H1 + PHY132H1", additionalInfo: null },
            { apCourse: AP_Course.Physics_C_Electricity_And_Magnetism, credit: "0.5", equivalent: "PHY152H1", additionalInfo: null },
            { apCourse: AP_Course.Physics_C_Mechanics, credit: "0.5", equivalent: "PHY151H1", additionalInfo: null },
            { apCourse: AP_Course.Psychology, credit: "0.5", equivalent: "PSY1**H", additionalInfo: null },
            { apCourse: AP_Course.Spanish_Literature_And_Culture, credit: "1.0", equivalent: "SPA1**Y", additionalInfo: null },
            { apCourse: AP_Course.Statistics, credit: "0.5", equivalent: "STA1**H", additionalInfo: null },
            { apCourse: AP_Course.United_States_History, credit: "1.0", equivalent: "HIS1**Y", additionalInfo: null },
            { apCourse: AP_Course.World_History_Modern, credit: "1.0", equivalent: "HIS1**Y", additionalInfo: null },
        ],
        AP_Score.S_4,
        Big(3.0),
    ),
    new CollegeCredits(
        "Simon Fraser University (SFU)",
        [
            { apCourse: AP_Course.Art_History, credit: "3+3", equivalent: "FPA167 + FPA1XX", additionalInfo: "Visual Art History." },
            { apCourse: AP_Course.Biology, credit: "4+4", equivalent: "BISC101 + BISC102", additionalInfo: null },
            { apCourse: AP_Course.Calculus_AB, credit: "3", equivalent: "MATH151", additionalInfo: null },
            { apCourse: AP_Course.Calculus_BC, credit: "3+3", equivalent: "MATH151 + MATH152", additionalInfo: null },
            { apCourse: AP_Course.Chemistry, credit: "4+2", equivalent: "CHEM121 + CHEM122", additionalInfo: null },
            { apCourse: AP_Course.Chinese_Language_And_Culture, credit: "6", equivalent: "CHIN1XX-6", additionalInfo: null },
            { apCourse: AP_Course.Computer_Science_A, credit: "3+3", equivalent: "CMPT120 + CMPT1XX", additionalInfo: null },
            { apCourse: AP_Course.Computer_Science_Principles, credit: "3", equivalent: "CMPT1XX", additionalInfo: null },
            { apCourse: AP_Course.Microeconomics, credit: "4", equivalent: "ECON103 or ECON105", additionalInfo: null },
            { apCourse: AP_Course.Macroeconomics, credit: "4", equivalent: "ECON103 or ECON105", additionalInfo: null },
            { apCourse: AP_Course.English_Language_And_Composition, credit: "3", equivalent: "ENGL1XX", additionalInfo: null },
            { apCourse: AP_Course.English_Literature_And_Composition, credit: "3", equivalent: "ENGL1XX", additionalInfo: null },
            { apCourse: AP_Course.Environmental_Science, credit: "4", equivalent: "BISC1XX", additionalInfo: null },
            { apCourse: AP_Course.European_History, credit: "3", equivalent: "HIST106", additionalInfo: null },
            { apCourse: AP_Course.French_Language_And_Culture, credit: "3 or 6", equivalent: "FREN1XX or 1XX", additionalInfo: "Equivalency depending on placement test." },
            { apCourse: AP_Course.German_Language_And_Culture, credit: "4 or 4+4", equivalent: "GERM102 if score is 4, or GERM102 + GERM103 if score is 5", additionalInfo: null },
            { apCourse: AP_Course.Comparative_Government_And_Politics, credit: "3", equivalent: "POL100", additionalInfo: null },
            { apCourse: AP_Course.United_States_Government_And_Politics, credit: "3", equivalent: "POL232", additionalInfo: null },
            { apCourse: AP_Course.Human_Geography, credit: "3", equivalent: "GEOG100", additionalInfo: null },
            { apCourse: AP_Course.Italian_Language_And_Culture, credit: "6", equivalent: "ITAL1XX", additionalInfo: null },
            { apCourse: AP_Course.Japanese_Language_And_Culture, credit: "6", equivalent: "JAPN1XX", additionalInfo: null },
            { apCourse: AP_Course.Latin, credit: "3", equivalent: "HUM161", additionalInfo: null },
            { apCourse: AP_Course.Music_Theory, credit: "3+3", equivalent: "FPA104 + FPA1XX", additionalInfo: "Music Studio" },
            { apCourse: AP_Course.Physics_A, credit: "3", equivalent: "PHYS100", additionalInfo: null },
            { apCourse: AP_Course.Physics_B, credit: "3+3", equivalent: "PHYS101 + PHYS102", additionalInfo: null },
            { apCourse: AP_Course.Physics_C_Electricity_And_Magnetism, credit: "3+3", equivalent: "PHYS120 + PHYS121", additionalInfo: "Credit granted only if a score of >=4 was achieved in AP Physics C: Mechanics aswell. Some topics are covered in course, but not in AP." },
            { apCourse: AP_Course.Physics_C_Mechanics, credit: "3+3", equivalent: " PHYS120 + PHYS121", additionalInfo: "Credit granted only if a score of >=4 was achieved in AP Physics C: Electricity and Magnetism aswell. Some topics are covered in course, but not in AP." },
            { apCourse: AP_Course.Psychology, credit: "3+3", equivalent: "PSYC100 + PSYC102", additionalInfo: null },
            { apCourse: AP_Course.Spanish_Language_And_Culture, credit: null, equivalent: null, additionalInfo: "Advanced standing in SPAN303" },
            { apCourse: AP_Course.Spanish_Literature_And_Culture, credit: null, equivalent: null, additionalInfo: "Advanced standing in SPAN240, SPAN103" },
            { apCourse: AP_Course.Statistics, credit: "3", equivalent: "STAT203", additionalInfo: null },
            { apCourse: AP_Course.Drawing, credit: "6", equivalent: "FPA1XX", additionalInfo: "Visual Art Studio" },
            { apCourse: AP_Course.TwoD_Art_And_Design, credit: "3", equivalent: "FPA1XX", additionalInfo: "Visual Art Studio" },
            { apCourse: AP_Course.ThreeD_Art_And_Design, credit: "6", equivalent: "FPA1XX", additionalInfo: "Visual Art Studio" },
            { apCourse: AP_Course.United_States_History, credit: "3+3", equivalent: "HIST212 + HIST213", additionalInfo: null },
            { apCourse: AP_Course.World_History_Modern, credit: "3+3", equivalent: "HIST106 + HIST1XX", additionalInfo: null },
        ],
        AP_Score.S_4,
        null,
    ),
    new CollegeCredits( // inacurate
        "University of Waterloo",
        [
            { apCourse: AP_Course.African_American_Studies, credit: "0.5", equivalent: "ENGL 1XX", additionalInfo: null },
            { apCourse: AP_Course.Art_History, credit: "0.5", equivalent: "FINE 1XX", additionalInfo: null },
            { apCourse: AP_Course.Biology, credit: "0.75", equivalent: "BIOL 239 and 130L", additionalInfo: null },
            { apCourse: AP_Course.Calculus_AB, credit: "1", equivalent: "MATH 127", additionalInfo: null },
            { apCourse: AP_Course.Calculus_BC, credit: "1", equivalent: "MATH 127", additionalInfo: null },
            { apCourse: AP_Course.Chinese_Language_And_Culture, credit: "0.5", equivalent: "CHINA 1XX", additionalInfo: null },
            { apCourse: AP_Course.Computer_Science_A, credit: "0.5", equivalent: "CS 1XX", additionalInfo: null },
            { apCourse: AP_Course.Environmental_Science, credit: "0.75", equivalent: "GEOG 1XX", additionalInfo: null },
            { apCourse: AP_Course.French_Language_And_Culture, credit: "0.5", equivalent: "FR 1XX", additionalInfo: null },
            { apCourse: AP_Course.German_Language_And_Culture, credit: "0.5", equivalent: "GER 1XX", additionalInfo: null },
            { apCourse: AP_Course.Comparative_Government_And_Politics, credit: "0.5", equivalent: "PSCI 1XX", additionalInfo: null },
            { apCourse: AP_Course.United_States_Government_And_Politics, credit: "0.5", equivalent: "PSCI 1XX", additionalInfo: null },
            { apCourse: AP_Course.Human_Geography, credit: "0.5", equivalent: "GEOG 101", additionalInfo: null },
            { apCourse: AP_Course.Italian_Language_And_Culture, credit: "0.5", equivalent: "ITAL 1XX", additionalInfo: null },
            { apCourse: AP_Course.Japanese_Language_And_Culture, credit: "0.5", equivalent: "JAPAN 1XX", additionalInfo: null },
            { apCourse: AP_Course.Latin, credit: "0.5", equivalent: "LAT 101", additionalInfo: null },
            { apCourse: AP_Course.Macroeconomics, credit: "0.5", equivalent: "ECON 1XX", additionalInfo: null },
            { apCourse: AP_Course.Microeconomics, credit: "0.5", equivalent: "ECON 1XX", additionalInfo: null },
            { apCourse: AP_Course.Physics_A, credit: "0.5", equivalent: "PHYS 1XX", additionalInfo: null },
            { apCourse: AP_Course.Physics_B, credit: "0.5", equivalent: "PHYS 1XX", additionalInfo: null },
            { apCourse: AP_Course.Physics_C_Electricity_And_Magnetism, credit: "0.5", equivalent: "PHYS 1XX", additionalInfo: null },
            { apCourse: AP_Course.Physics_C_Mechanics, credit: "0.5", equivalent: "PHYS 111", additionalInfo: null },
            { apCourse: AP_Course.Precalculus, credit: "0.5", equivalent: null, additionalInfo: null },
            { apCourse: AP_Course.Psychology, credit: "0.5", equivalent: "PSYCH 101", additionalInfo: null },
            { apCourse: AP_Course.Spanish_Language_And_Culture, credit: "0.5", equivalent: "SPAN 1XX", additionalInfo: null },
            { apCourse: AP_Course.Spanish_Literature_And_Culture, credit: "0.5", equivalent: "SPAN 1XX", additionalInfo: null },
            { apCourse: AP_Course.Statistics, credit: "0.5", equivalent: "STAT 202", additionalInfo: null },
            { apCourse: AP_Course.TwoD_Art_And_Design, credit: "0.5", equivalent: "FINE 1XX", additionalInfo: null },
            { apCourse: AP_Course.United_States_History, credit: "0.5", equivalent: "HIST 1XX", additionalInfo: null },
            { apCourse: AP_Course.World_History_Modern, credit: "0.5", equivalent: "HIST 1XX", additionalInfo: null },

        ],
        AP_Score.S_4,
        null, // varies per faculty
    ),
]