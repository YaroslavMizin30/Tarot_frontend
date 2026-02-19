interface RadioSheetItem {
  id: string;
  label: string;
  description?: string;
}

export interface RadioSheetProps {
  items: RadioSheetItem[];
  value: string;
  onChange: (value: string) => void;
  title?: string;
  className?: string;
  name: string;
}
