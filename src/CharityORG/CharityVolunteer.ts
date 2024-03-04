import { CharityVolunteerTask } from "./CharityVolunteerTask";
import { CharityVolunteerTasks } from "./CharityVolunteerTasks";
import { CharityEventTasks } from "./CharityORG";
import { CharityVolunteerUpgrade } from "./CharityVolunteerUpgrade";
//import { CharityVolunteerUpgrades } from "./CharityVolunteerUpgrades";
import { IAscensionResult } from "./IAscensionResult";
import { Player } from "@player";
import { CharityORG } from "./CharityORG";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, constructorsForReviver } from "../utils/JSONReviver";
import {
  calculatePrestigeGain,
  calculateMoneyGainCharity,
  calculateMoneySpendCharity,
  calculateKarmaGain,
  calculateVisibilityGain,
  calculateTerrorGain,
  calculateAscensionMultCharity,
  calculateAscensionPointsGainCharity,
} from "./formulas/formulas";

interface IMults {
  hack: number;
  str: number;
  def: number;
  dex: number;
  agi: number;
  cha: number;
}

export class CharityVolunteer {
  name: string;
  task = "Unassigned";

  earnedPrestige = 0;

  hack = 1;
  str = 1;
  def = 1;
  dex = 1;
  agi = 1;
  cha = 1;

  hack_exp = 0;
  str_exp = 0;
  def_exp = 0;
  dex_exp = 0;
  agi_exp = 0;
  cha_exp = 0;

  hack_mult = 1;
  str_mult = 1;
  def_mult = 1;
  dex_mult = 1;
  agi_mult = 1;
  cha_mult = 1;

  hack_asc_points = 0;
  str_asc_points = 0;
  def_asc_points = 0;
  dex_asc_points = 0;
  agi_asc_points = 0;
  cha_asc_points = 0;

  upgrades: string[] = []; // Names of upgrades

  constructor(name = "") {
    this.name = name;
  }

  calculateSkill(exp: number, mult = 1): number {
    return Math.max(Math.floor(mult * (32 * Math.log(exp + 534.5) - 200)), 1);
  }

  calculateAscensionMult(points: number): number {
    return calculateAscensionMultCharity(points);
  }

  updateSkillLevels(): void {
    this.hack = this.calculateSkill(this.hack_exp, this.hack_mult * this.calculateAscensionMult(this.hack_asc_points));
    this.str = this.calculateSkill(this.str_exp, this.str_mult * this.calculateAscensionMult(this.str_asc_points));
    this.def = this.calculateSkill(this.def_exp, this.def_mult * this.calculateAscensionMult(this.def_asc_points));
    this.dex = this.calculateSkill(this.dex_exp, this.dex_mult * this.calculateAscensionMult(this.dex_asc_points));
    this.agi = this.calculateSkill(this.agi_exp, this.agi_mult * this.calculateAscensionMult(this.agi_asc_points));
    this.cha = this.calculateSkill(this.cha_exp, this.cha_mult * this.calculateAscensionMult(this.cha_asc_points));
  }

  //calculatePower(): number {
  //  return (this.hack + this.str + this.def + this.dex + this.agi + this.cha) / 95;
  //}

  assignToTask(taskName: string): boolean {
    const charityORG = Player.charityORG;
    if (charityORG === null) {
      this.task = "Unassigned";
      return false;
    }
    if (!Object.hasOwn(CharityVolunteerTasks, taskName) && !Object.hasOwn(CharityEventTasks, taskName)) {
      this.task = "Unassigned";
      return false;
    } else if (
      (CharityVolunteerTasks[taskName]?.isSpending || CharityEventTasks[taskName]?.isSpending) &&
      charityORG.bank <= 0
    ) {
      this.task = "Unassigned";
      return false;
    }
    this.task = taskName;
    return true;
  }

  unassignFromTask(): void {
    this.task = "Unassigned";
  }

  getTask(): CharityVolunteerTask {
    // TODO unplanned: transfer that to a save file migration function
    // Backwards compatibility
    if ((this.task as any) instanceof CharityVolunteerTask) {
      this.task = (this.task as any).name;
    }

    if (Object.hasOwn(CharityVolunteerTasks, this.task)) {
      return CharityVolunteerTasks[this.task];
    } else if (Object.hasOwn(CharityEventTasks, this.task)) {
      return CharityEventTasks[this.task];
    }
    return CharityVolunteerTasks.Unassigned;
  }

  calculatePrestigeGain(charityORG: CharityORG): number {
    const task = this.getTask();
    const c = {
      prestige: charityORG.prestige,
      visibility: charityORG.visibility,
      terror: charityORG.terror,
    };
    return calculatePrestigeGain(c, this, task);
  }

  calculateKarmaGain(charityORG: CharityORG): number {
    const task = this.getTask();
    const c = {
      prestige: charityORG.prestige,
      visibility: charityORG.visibility,
      terror: charityORG.terror,
    };
    return calculateKarmaGain(c, this, task);
  }

  calculateMoneyGain(charityORG: CharityORG): number {
    const task = this.getTask();
    const c = {
      prestige: charityORG.prestige,
      visibility: charityORG.visibility,
      terror: charityORG.terror,
    };
    return calculateMoneyGainCharity(c, this, task);
  }

  calculateMoneySpend(charityORG: CharityORG): number {
    const task = this.getTask();
    const c = {
      prestige: charityORG.prestige,
      visibility: charityORG.visibility,
      terror: charityORG.terror,
    };
    return calculateMoneySpendCharity(c, this, task);
  }

  calculateVisibilityGain(charityORG: CharityORG): number {
    const task = this.getTask();
    const c = {
      prestige: charityORG.prestige,
      visibility: charityORG.visibility,
      terror: charityORG.terror,
    };
    return calculateVisibilityGain(c, this, task);
  }

  calculateTerrorGain(charityORG: CharityORG): number {
    const task = this.getTask();
    const c = {
      prestige: charityORG.prestige,
      visibility: charityORG.visibility,
      terror: charityORG.terror,
    };

    return calculateTerrorGain(c, this, task);
  }

  expMult(): IMults {
    return {
      hack: (this.hack_mult - 1) / 4 + 1,
      str: (this.str_mult - 1) / 4 + 1,
      def: (this.def_mult - 1) / 4 + 1,
      dex: (this.dex_mult - 1) / 4 + 1,
      agi: (this.agi_mult - 1) / 4 + 1,
      cha: (this.cha_mult - 1) / 4 + 1,
    };
  }

  gainExperience(numCycles = 1): void {
    numCycles /= 10;
    const task = this.getTask();
    if (task === CharityVolunteerTasks.Unassigned) return;
    const modifiedDifficulty =
      task.name === "Train Primary" || task.name === "Train Mind"
        ? Math.max(task.difficulty, this.getHighestDifficulty())
        : task.difficulty;
    const difficultyMult = Math.pow(modifiedDifficulty, 0.9);
    const difficultyPerCycles = difficultyMult * numCycles;
    const diffModHigh =
      modifiedDifficulty <= 1000 ? 1 : Math.max(1, Math.pow(10, Math.log10(modifiedDifficulty) - 2) / 100); //Used to increase the difficulty mod at higher levels., degraded to /100 to allow for slight increase in xp gain at higher levels.
    const weightDivisor = 200;
    const expMult = this.expMult();
    this.hack_exp +=
      ((task.hackWeight / weightDivisor) *
        difficultyPerCycles *
        expMult.hack *
        this.calculateAscensionMult(this.hack_asc_points)) /
      diffModHigh;
    this.str_exp +=
      ((task.strWeight / weightDivisor) *
        difficultyPerCycles *
        expMult.str *
        this.calculateAscensionMult(this.str_asc_points)) /
      diffModHigh;
    this.def_exp +=
      ((task.defWeight / weightDivisor) *
        difficultyPerCycles *
        expMult.def *
        this.calculateAscensionMult(this.def_asc_points)) /
      diffModHigh;
    this.dex_exp +=
      ((task.dexWeight / weightDivisor) *
        difficultyPerCycles *
        expMult.dex *
        this.calculateAscensionMult(this.dex_asc_points)) /
      diffModHigh;
    this.agi_exp +=
      ((task.agiWeight / weightDivisor) *
        difficultyPerCycles *
        expMult.agi *
        this.calculateAscensionMult(this.agi_asc_points)) /
      diffModHigh;
    this.cha_exp +=
      ((task.chaWeight / weightDivisor) *
        difficultyPerCycles *
        expMult.cha *
        this.calculateAscensionMult(this.cha_asc_points)) /
      diffModHigh;
  }

  getHighestDifficulty(): number {
    let dif = 0;
    const charityORG = (function () {
      if (Player.charityORG === null) throw new Error("Charity should not be null");
      return Player.charityORG;
    })();
    for (const volunteer of charityORG.volunteers) {
      const ave = (volunteer.agi + volunteer.cha + volunteer.def + volunteer.dex + volunteer.hack + volunteer.str) / 6;
      if (ave / 5.1 > dif) {
        dif = ave / 5.1;
      }
    }
    return dif;
  }

  earnPrestige(numCycles = 1, mod = 1, charityORG: CharityORG): void {
    const earnedPrestige = this.calculatePrestigeGain(charityORG) * numCycles * mod;
    this.earnedPrestige += earnedPrestige;
  }

  getGainedAscensionPoints(): IMults {
    return {
      hack: calculateAscensionPointsGainCharity(this.hack_exp),
      str: calculateAscensionPointsGainCharity(this.str_exp),
      def: calculateAscensionPointsGainCharity(this.def_exp),
      dex: calculateAscensionPointsGainCharity(this.dex_exp),
      agi: calculateAscensionPointsGainCharity(this.agi_exp),
      cha: calculateAscensionPointsGainCharity(this.cha_exp),
    };
  }

  canAscend(): boolean {
    const points = this.getGainedAscensionPoints();
    return points.hack > 0 || points.str > 0 || points.def > 0 || points.dex > 0 || points.agi > 0 || points.cha > 0;
  }

  getCurrentAscensionMults(): IMults {
    return {
      hack: this.calculateAscensionMult(this.hack_asc_points),
      str: this.calculateAscensionMult(this.str_asc_points),
      def: this.calculateAscensionMult(this.def_asc_points),
      dex: this.calculateAscensionMult(this.dex_asc_points),
      agi: this.calculateAscensionMult(this.agi_asc_points),
      cha: this.calculateAscensionMult(this.cha_asc_points),
    };
  }

  getAscensionMultsAfterAscend(): IMults {
    const points = this.getGainedAscensionPoints();
    return {
      hack: this.calculateAscensionMult(this.hack_asc_points + points.hack),
      str: this.calculateAscensionMult(this.str_asc_points + points.str),
      def: this.calculateAscensionMult(this.def_asc_points + points.def),
      dex: this.calculateAscensionMult(this.dex_asc_points + points.dex),
      agi: this.calculateAscensionMult(this.agi_asc_points + points.agi),
      cha: this.calculateAscensionMult(this.cha_asc_points + points.cha),
    };
  }

  getAscensionResults(): IMults {
    const postAscend = this.getAscensionMultsAfterAscend();
    const preAscend = this.getCurrentAscensionMults();

    return {
      hack: postAscend.hack / preAscend.hack,
      str: postAscend.str / preAscend.str,
      def: postAscend.def / preAscend.def,
      dex: postAscend.dex / preAscend.dex,
      agi: postAscend.agi / preAscend.agi,
      cha: postAscend.cha / preAscend.cha,
    };
  }

  ascend(): IAscensionResult {
    const res = this.getAscensionResults();
    const points = this.getGainedAscensionPoints();
    this.hack_asc_points += points.hack;
    this.str_asc_points += points.str;
    this.def_asc_points += points.def;
    this.dex_asc_points += points.dex;
    this.agi_asc_points += points.agi;
    this.cha_asc_points += points.cha;

    // Remove upgrades. Then re-calculate multipliers and stats
    this.upgrades.length = 0;
    this.hack_mult = 1;
    this.str_mult = 1;
    this.def_mult = 1;
    this.dex_mult = 1;
    this.agi_mult = 1;
    this.cha_mult = 1;
    //for (let i = 0; i < this.augmentations.length; ++i) {
    // const aug = CharityVolunteerUpgrades[this.augmentations[i]];
    // this.applyUpgrade(aug);
    //}

    // Clear exp and recalculate stats
    this.hack_exp = 0;
    this.str_exp = 0;
    this.def_exp = 0;
    this.dex_exp = 0;
    this.agi_exp = 0;
    this.cha_exp = 0;
    this.updateSkillLevels();

    const prestigeToDeduct = this.earnedPrestige;
    this.earnedPrestige = 0;
    return {
      prestige: prestigeToDeduct,
      hack: res.hack,
      str: res.str,
      def: res.def,
      dex: res.dex,
      agi: res.agi,
      cha: res.cha,
    };
  }

  applyUpgrade(upg: CharityVolunteerUpgrade): void {
    if (upg.mults.str != null) this.str_mult *= upg.mults.str;
    if (upg.mults.def != null) this.def_mult *= upg.mults.def;
    if (upg.mults.dex != null) this.dex_mult *= upg.mults.dex;
    if (upg.mults.agi != null) this.agi_mult *= upg.mults.agi;
    if (upg.mults.cha != null) this.cha_mult *= upg.mults.cha;
    if (upg.mults.hack != null) this.hack_mult *= upg.mults.hack;
  }

  buyUpgrade(upg: CharityVolunteerUpgrade): boolean {
    if (!Player.charityORG) throw new Error("Tried to buy a charity member upgrade when no charity was present");

    // Prevent purchasing of already-owned upgrades
    if (this.upgrades.includes(upg.name)) return false;
    if (Player.charityORG.bank < Player.charityORG.getUpgradeCost(upg)) return false;

    Player.charityORG.bank -= Player.charityORG.getUpgradeCost(upg);
    Player.charityORG.spent -= Player.charityORG.getUpgradeCost(upg);

    this.upgrades.push(upg.name);
    this.applyUpgrade(upg);
    return true;
  }

  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("CharityVolunteer", this);
  }

  /** Initializes a CharityVolunteer object from a JSON save state. */
  static fromJSON(value: IReviverValue): CharityVolunteer {
    return Generic_fromJSON(CharityVolunteer, value.data);
  }
}

constructorsForReviver.CharityVolunteer = CharityVolunteer;