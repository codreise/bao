import React, { useState } from 'react';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';

const categories = ['clothing', 'shoes', 'accessories', 'electronics', 'digital', 'services'];

export default function AddProduct() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'clothing', images: [],
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setLoading(true);
    setUploadProgress(10);

    try {
      // Симуляція прогресу для UX
      const interval = setInterval(() => {
        setUploadProgress(prev => (prev < 90 ? prev + 15 : prev));
      }, 200);

      const mockFiles = files.map(() => "dummy_data");
      const response = await api.post('/upload', { files: mockFiles });
      
      clearInterval(interval);
      setUploadProgress(100);

      const newUrls = response?.file_urls || [response?.file_url];
      
      setForm((prev) => ({ 
        ...prev, 
        images: [...prev.images, ...newUrls].slice(0, 5) // Макс 5 фото
      }));
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price) return;
    setLoading(true);
    
    await api.post('/products', {
      ...form,
      price: parseFloat(form.price),
      image_url: form.images[0] || '', // Primary image
      status: 'active'
    });
    
    queryClient.invalidateQueries({ queryKey: ['products'] });
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="px-4 pt-4 space-y-5 pb-8">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-card border border-border/50 flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold">Add Product</h1>
      </div>

      {/* Multi-Image Upload & Preview */}
      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence>
          {form.images.map((url, idx) => (
            <motion.div 
              key={url + idx}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="relative aspect-square rounded-2xl overflow-hidden border border-border"
            >
              <img src={url} alt="Product" className="w-full h-full object-cover" />
              <button 
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {form.images.length < 5 && (
          <label className="aspect-square bg-card border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-1 hover:border-primary/40 transition-all active:scale-95 cursor-pointer relative overflow-hidden">
            {loading && uploadProgress > 0 ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <span className="text-[10px] font-bold text-primary">{uploadProgress}%</span>
                <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
            ) : (
              <>
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[10px] text-muted-foreground font-semibold">Add Photo</span>
              </>
            )}
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={loading} />
          </label>
        )}
      </div>

      <div className="space-y-3">
        <Input
          placeholder="What are you selling?"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-xl bg-card border-border/50"
        />
        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded-xl bg-card border-border/50 min-h-[80px]"
        />
        <Input
          type="number"
          placeholder="Price (USD)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="rounded-xl bg-card border-border/50"
        />
        <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
          <SelectTrigger className="rounded-xl bg-card border-border/50">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !form.title || !form.price}
        className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold text-sm glow-yellow active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {loading ? 'Publishing...' : 'Publish Product'}
      </button>
    </div>
  );
}