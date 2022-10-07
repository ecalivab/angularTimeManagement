export class TimeTableItem {
  Date!: Date;
  Ore!:  number;
  Rol!:  number;
  Ferie!: boolean;
  Ufficio!: boolean;
}

export class Holiday {
  Name!:String;
  Date!:Date;
  Weekend!: boolean;
}

export class TimeTableInfo {
    UserId!: string;
    Month!:  number;
    Year!:   number;
}

export class TimeTableRequest {
  Date! : Date;
  Day!: number;
  Month!: number;
  Year!: number;
  Hours!: number;
  Rol!: number;
  Holiday!: boolean;
  Office!: boolean;
  UserId!: string;
}

 // ------Holidays--------------
export const HOLIDAYS: Holiday [] = 
[
  {Name: "Dopo Capodanno", Date: new Date(2022,0,1), Weekend: true},
  {Name: "Epifania", Date: new Date(2022,0,6), Weekend: false},
  {Name: "Pasqua", Date: new Date(2022,3,17), Weekend: true},
  {Name: "Pasquetta", Date: new Date(2022,3,18), Weekend: false},
  {Name: "Anniversarop della Liberzaione d'Italia", Date: new Date(2022,3,25),Weekend: false},
  {Name: "Festa dei Lavoratori", Date: new Date(2022,4,1), Weekend: true},
  {Name: "Festa della Repubblica Italiana", Date: new Date(2022,5,2),Weekend: false},
  {Name: "Ferragosto", Date: new Date(2022,7,15),Weekend: false},
  {Name: "Tutti i Santi", Date: new Date(2022,10,1),Weekend: false},
  {Name: "Sant'Ambrogio", Date: new Date(2022,11,7),Weekend: false},
  {Name: "L'Immacolata Concezione", Date: new Date(2022,11,8),Weekend: false},
  {Name: "Natale", Date: new Date(2022,11,25), Weekend: true},
  {Name: "Santo Stefano", Date: new Date(2022,11,26),Weekend: false},
]