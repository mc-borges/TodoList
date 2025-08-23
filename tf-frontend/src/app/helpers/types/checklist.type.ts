export type ChecklistData = {
  name: string | null,
  category?: string | null,
  description?: string | null,
  limitDate?: Date | null,
  changeColorByDate?: boolean,
  showMotivationalMsg?: boolean,
};

export type ChecklistItem = {
  id?: string | null,
  title: string,
  description?: string | null,
  completed: boolean,
};

export type ChecklistItemsBulkUpdate = {
  items: ChecklistItem[]
};

export type ChecklistItemsBulkResponse = {
  message: string,
  items: ChecklistItem[],
  created_count: number,
  updated_count: number,
  deleted_count: number
};

export type ChecklistDataResponse = {
  id: string,
  name: string | null,
  category: string | null,
  description: string | null,
  limit_date: any,
  change_color_by_date: boolean,
  show_motivational_msg: boolean,
  items?: ChecklistItem[],
};
