import { ItemSlot } from '../enums'

export default interface GearSettingsObject {
  custom: number[][] // [GearSlot][itemId, suffixId, enchantId]. itemId and enchantId can also be (0 = BIS, 1 = Naked).
  itemSearchSlot: ItemSlot // if slot valid will fill settings.gear.items[] in BiS order
  enchantSearchSlot: ItemSlot // if slot valid will fill settings.gear.enchants[] in BiS order
  raids: boolean // toggle raids in item searches
  tailoring: boolean // toggle tailoring bonuses in item searches
  worldBosses: boolean // toggle worldBosses in item searches
  randomEnchants: boolean // toggle random enchant items (items with suffixId)
  onUseItems: boolean // toggles on use items (activated trinkets, etc)
}
