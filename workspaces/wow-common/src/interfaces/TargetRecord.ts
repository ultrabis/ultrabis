import TargetType from '../enums/TargetType'

export default interface TargetRecord {
  id: number
  name: string
  level: number
  type?: TargetType
}
