export default interface ZoneRecord {
  id: number
  name: string
  min?: number // min level
  max?: number // max level
  req?: number // required level
  n?: number // number of players
}
