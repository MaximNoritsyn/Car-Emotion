

//https://schema.org/Person
export interface person {
  id: string,
  name: string,
  familyName: string,
  email: string,
  telephone: string,
  datainput: Date,
  city: string,
  insta: string,
  userUid: string,
}

//свой формат
export interface participant {
  id: string,
  idevent: string,
  idperson: string,
  person: person,
  imageperson: string,
  car: car,
  datacar: datacar,
  team: team,
  isDecibelLeague: boolean,
  isDecibelBattle: boolean,
  isDecibelVolume: boolean,
  isDecibelVolume2020: boolean,
  isDecibelShow: boolean,
  isDecibelShow2020: boolean,
  classDecibelLeague: competitionclass,
  classDecibelBattle: competitionclass,
  classDecibelVolume: competitionclass,
  classDecibelVolume2020: competitionclass,
  classDecibelShow: competitionclass,
  classDecibelShow2020: competitionclass,
  resultDecibelLeague: result,
  resultDecibelBattle: result,
  resultDecibelVolume: result,
  resultDecibelVolume2020: result,
  resultDecibelShow: result,
  resultDecibelShow2020: result,
  registered: boolean,
  datainput: Date
}

export interface datacar {
  id: string,
  idevent: string,
  image: string,
  subsize: number,
  subcount: number,
  nameamplifiler: string,
  front: string
}

//https://schema.org/Car
export interface car {
  id: string,
  model: string,
  alternateName: string
}

export interface season{
  id: string,
  name: string,
  date: Date
}

// Sportevent https://schema.org/SportsEvent
export interface event{
  id: string,
  name: string,
  season: season,
  location: string,
  countDecibelLeague: number,
  countDecibelVolume: number,
  countDecibelShow: number,
  bestDecibelLeague: number,
  bestDecibelVolume: number,
  bestDecibelShow: number,
  eventStatus: eventstatus,
  organizer: string,
  startDate: Date
}

// SportTeam https://schema.org/SportsTeam
export interface team{
  id: string,
  legalName: string,
  logo: string
}

export interface result{
  id: string,
  competition: competition,
  class: competitionclass,
  person: person;
  team: team;
  idclass: string,
  idperson: string,
  idparticipant: string,
  idcar: string,
  idevent: string,
  idseason: string,
  idteam: string,
  front: number,
  sub: number,
  result: number,
  outputpower: string,
  checkin: boolean,
  point: number,
  place: number,
  totalplace: number,
  event: event
}

/*export interface point {
  id: string,
  idparticipant: string,
  idteam: string,
  idperson: string,
  idcar: string,
  idevent: string,
  idseason: string,
  competition: competition,
  class: competitionclass,
  idclass: string,
  bestresult: number,
  point: number,
  place: number
}*/

export enum competition{
  DecibelLeague = "Decibel league",
  DecibelBattleQualy = "Decibel battle qualy",
  DecibelBattlePlayOff= "Decibel battle play off",
  DecibelVolume = "Decibel volume",
  DecibelVolume2020 = "Decibel volume 2020",
  DecibelShow = "Decibel show",
  DecibelShow2020 = "Decibel show 2020"
}

export interface competitionclass {
  id: string,
  competition: competition,
  name: string,
  actual: boolean,
  comment: string

}

export enum eventstatus {
  inplan,
  begun,
  finish,
  canceled
}

