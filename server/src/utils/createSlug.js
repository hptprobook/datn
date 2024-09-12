export const createSlug = (name) => {
  const nameNoAccent = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const nameLower = nameNoAccent.toLowerCase();
  const slug = nameLower.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return slug;
};
