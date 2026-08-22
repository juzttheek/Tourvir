const blogModules = import.meta.glob('./blog/*.json', { eager: true });

const blogImageWidths: Record<string, number> = {
  'hero_main_hq.webp': 1024,
  'hero_kandy_hq.webp': 1920,
  'hero_train_hq.webp': 1920,
  'hero_wild_hq.webp': 1920,
};

export const blogPosts = Object.entries(blogModules).map(([path, mod]: [string, any]) => {
  // The filename is the public article slug.
  const id = path.split('/').pop()?.replace('.json', '') || 'unknown';
  const coverImage = String(mod.coverImage ?? '');

  return {
    id,
    title: mod.title,
    seoTitle: mod.seoTitle,
    description: mod.description,
    coverImage,
    coverImageWidth: blogImageWidths[coverImage.split('/').pop() || ''] ?? 1024,
    author: mod.author,
    date: new Date(mod.date),
    introduction: mod.introduction,
    sections: Array.isArray(mod.sections) ? mod.sections : [],
    relatedPackageIds: Array.isArray(mod.relatedPackageIds)
      ? mod.relatedPackageIds.map(String)
      : [],
  };
});
