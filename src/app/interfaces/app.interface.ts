

//https://schema.org/Person
export interface person {
  id: string,
  name: string,
  familyName: string,
  email: string,
  telephone: string,
  datainput: Date,
  city: string
}

//свой формат
export interface participant {
  id: string,
  idevent: string,
  person: person,
  imageperson: string,
  car: car,
  datacar: datacar,
  team: team,
  isDecibelLeague: boolean,
  isDecibelBattle: boolean,
  isDecibelVolume: boolean,
  isDecibelShow: boolean,
  classDecibelLeague: competitionclass,
  classDecibelBattle: competitionclass,
  classDecibelVolume: competitionclass,
  classDecibelShow: competitionclass,
  registered: boolean,
  datainput: Date,
  points: point[]
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
  idperson: string,
  idcar: string,
  idevent: string,
  idseason: string,
  front: number,
  sub: number,
  result: number,
  outputpower: string,
  checkin: boolean
}

export interface point {
  id: string,
  idparticipant: string,
  idteam: string,
  idperson: string,
  idcar: string,
  idevent: string,
  idseason: string,
  competition: competition,
  class: competitionclass,
  results: result[],
  bestresult: number,
  point: number,
  place: number
}

export enum competition{
  DecibelLeague = "Decibel league",
  DecibelBattle = "Decibel battle",
  DecibelVolume = "Decibel volume",
  DecibelShow = "Decibel show"
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

