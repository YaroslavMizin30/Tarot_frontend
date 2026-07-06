export const findHouse = (tags: string[]) => {
  return tags.find((tag) => tag.includes('house'));
};
