import { Bladeburner } from "../../Bladeburner/Bladeburner";
import { AugmentationName } from "@enums";

import type { PlayerObject } from "./PlayerObject";

export function canAccessBladeburner(this: PlayerObject): boolean {
  return this.bitNodeN === 6 || this.bitNodeN === 7 || this.sourceFileLvl(6) > 0 || this.sourceFileLvl(7) > 0;
}

export function startBladeburner(this: PlayerObject): void {
  this.bladeburner = new Bladeburner();
  this.bladeburner.init();
  // Give Blades Simulacrum if you have unlocked it
  if (this.sourceFileLvl(6) >= 3) {
    this.augmentations.push({
      name: AugmentationName.BladesSimulacrum,
      level: 1,
    });
  }
}
