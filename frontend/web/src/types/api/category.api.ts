export type CategoryType =
  | 'nutrition'
  | 'supplement'
  | 'vitamin'
  | 'superfood'
  | 'herb';

export type HealthGoal =
  | 'weight-loss'
  | 'muscle-gain'
  | 'immunity'
  | 'gut-health'
  | 'heart-health'
  | 'energy';

export interface CategoryFormData {
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  category_type: CategoryType;
  health_goal: HealthGoal[];
  is_active: boolean;
}
