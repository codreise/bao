import React, { useState } from 'react';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
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
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'clothing', image_url: '',
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Placeholder endpoint for file uploads
      const response = await api.post('/upload', formData);
      // Fallback for mock/placeholder testing
      const file_url = response?.file_url || URL.createObjectURL(file);
      
      setForm((prev) => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price) return;
    setLoading(true);
    // Placeholder endpoint for product creation
    await api.post('/products', {
      ...form,
      price: parseFloat(form.price),
      status: 'active',
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

      {/* Image Upload */}
      <label className="block cursor-pointer">
        <div className="aspect-video bg-card border-2 border-dashed border-border/60 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary/40 transition-colors overflow-hidden">
          {form.image_url ? (
            <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">Tap to upload image</p>
            </>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </label>

      <div className="space-y-3">
        <Input
          placeholder="Product title"
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