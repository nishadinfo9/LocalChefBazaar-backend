export const generateChefId = () => {
  const generateId = Math.floor(1000 + Math.random() * 9000);
  return `chef-${generateId}`;
};
