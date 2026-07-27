const blogModules = import.meta.glob('./blog/*.json', { eager: true });

export const blogPosts = Object.entries(blogModules).map(([path, mod]: [string, any]) => {
  // Extract id from filename (e.g., './blog/first-post.json' -> 'first-post')
  const id = path.split('/').pop()?.replace('.json', '') || 'unknown';
  
  return {
    id,
    title: mod.title,
    description: mod.description,
    coverImage: mod.coverImage,
    author: mod.author,
    date: new Date(mod.date),
    content: mod.content
  };
});
