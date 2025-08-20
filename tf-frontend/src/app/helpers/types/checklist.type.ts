export type ChecklistData = {
  name: string | null,
  category?: string | null,
  description?: string | null,
  limitDate?: Date | null,
  changeColorByDate?: boolean,
  showMotivationalMsg?: boolean,
};

export type ChecklistDataResponse = {
  id: string,
  name: string | null,
  category: string | null,
  description: string | null,
  limit_date: any,
  change_color_by_date: boolean,
  show_motivational_msg: boolean,
  items?: any[],
};
