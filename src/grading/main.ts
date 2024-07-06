
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


enum AP_Courses {
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