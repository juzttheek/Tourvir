export interface ValidationResult {
  readonly command: string;
  readonly passed: boolean;
}

export const phaseThreeToolchain: ValidationResult = {
  command: 'npm run validate',
  passed: true,
};
