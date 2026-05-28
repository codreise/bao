exports.processUpload = async (data) => {
  // Реальна симуляція завантаження в хмару (напр. Supabase Storage або S3)
  // Очікуємо масив файлів або один файл у форматі base64/buffer
  
  const simulateCloudUpload = async () => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Затримка мережі
    return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80";
  };

  if (Array.isArray(data.files)) {
    const urls = await Promise.all(data.files.map(() => simulateCloudUpload()));
    return { file_urls: urls };
  }

  const url = await simulateCloudUpload();
  return { 
    file_url: url 
  };
};