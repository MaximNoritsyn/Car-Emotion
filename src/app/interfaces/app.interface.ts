

export interface participant {
  id: string,
  name: string,
  familyName: string,
  email: string,
  telephone: string,
  city: string
}

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
export interface participant1 {
  id: string,
  event: event,
  person: person,
  imageperson: string,
  car: car,
  datacer: datacar,
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
  points: point[]
}

export interface datacar {
  idcar: string,
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
  alternateName: string,
  datacar: datacar,
  history: datacar[],
  points: point[]
}

export interface season{
  id: string,
  name: string,
  date: Date,
  events: event[],
  points: point[]
}

// Sportevent https://schema.org/SportsEvent
export interface event{
  id: string,
  name: string,
  season: season,
  location: string,
  eventStatus: eventstatus,
  organizer: string,
  startDate: Date,
  competitors: participant[],
  points: point[],
}

// SportTeam https://schema.org/SportsTeam
export interface team{
  legalName: string,
  logo: string,
  athlete: participant[],
  points: point[]
}

export interface result{
  id: string,
  participant: participant,
  competition: competition,
  class: competitionclass,
  event: event,
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

export enum competitionclass {
  beginner750,
  amateur1500,
  specialist3000,
  professional5000,
  extreme,
  sedan4000,

  _129,
  _139,

  upto150,
  upto250,
  from250,

  Master1500,
  Expert3000,
  Monster

}

export enum eventstatus {
  inplan,
  begun,
  finish,
  canceled
}

