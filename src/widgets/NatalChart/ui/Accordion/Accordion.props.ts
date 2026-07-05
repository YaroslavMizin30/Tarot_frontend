interface Item {
  title: string;
  body: string;
  tags: string[];
}

export interface AccordionProps {
  sections: {
    core_self: Item[];
    mind: Item[];
    work_path: Item[];
    social_collective: Item[];
    love_relating: Item[];
    karmic_healing: Item[];
  };
}

export interface SectionProps {
  onClick: () => void;
  items: Item[];
  name: string;
  isOpened: boolean;
}
