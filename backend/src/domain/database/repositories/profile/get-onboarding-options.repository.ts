import type { Seniority } from "../../../entities/seniority.entity";
import type { Specialty } from "../../../entities/specialty.entity";
import type { CareerObjective } from "../../../entities/career-objective.entity";
import type { AgeRange } from "../../../entities/age-range.entity";
import type { Stack } from "../../../entities/stack.entity";

export interface IOnboardingOptions {
  seniorities: Seniority[];
  specialties: Specialty[];
  careerObjectives: CareerObjective[];
  ageRanges: AgeRange[];
  stacks: Stack[];
}

export interface IGetOnboardingOptionsRepository {
  execute(): Promise<IOnboardingOptions>;
}
