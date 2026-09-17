import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Product } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
  product?: Product | null;
  businessId: string;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  businessId,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [pointsEarned, setPointsEarned] = useState('');
  const [categoryName, setCategoryName] = useState('Coffee & Beverages');
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || '');
      setPrice(product.price.toString());
      setPointsEarned(product.pointsEarned.toString());
      setCategoryName(product.categoryName || 'Coffee & Beverages');
      setIsAvailable(product.isAvailable);
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setPointsEarned('');
      setCategoryName('Coffee & Beverages');
      setIsAvailable(true);
    }
  }, [product, isOpen]);

  // Auto-calculate points earned when price changes (e.g. ₹100 = 10 pts)
  const handlePriceChange = (val: string) => {
    setPrice(val);
    const num = parseFloat(val);
    if (!isNaN(num) && !pointsEarned) {
      setPointsEarned(Math.floor(num / 10).toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    setIsSubmitting(true);
    try {
      await onSave({
        id: product?.id,
        businessId,
        name,
        description,
        price: parseFloat(price) || 0,
        pointsEarned: parseInt(pointsEarned) || Math.floor((parseFloat(price) || 0) / 10),
        categoryName,
        isAvailable,
        imageUrl: product?.imageUrl || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=300&q=80',
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Menu Product' : 'Add New Product to Menu'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Product Name"
          placeholder="e.g. Iced Hazelnut Latte"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#57504B] tracking-wide uppercase">
            Description
          </label>
          <textarea
            className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#3D281D]/20 rounded-xl text-sm text-[#1A1615] placeholder:text-[#8C827A] focus:outline-none focus:border-[#3D281D] focus:ring-2 focus:ring-[#3D281D]/10"
            rows={2}
            placeholder="Brief product description for customers..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (₹)"
            type="number"
            placeholder="180"
            value={price}
            onChange={(e) => handlePriceChange(e.target.value)}
            required
          />

          <Input
            label="Points Earned"
            type="number"
            placeholder="18"
            value={pointsEarned}
            onChange={(e) => setPointsEarned(e.target.value)}
            helperText="Points customer earns per unit"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#57504B] tracking-wide uppercase">
            Category
          </label>
          <select
            className="w-full px-3.5 py-2.5 bg-[#FDFBF7] border border-[#3D281D]/20 rounded-xl text-sm text-[#1A1615] focus:outline-none focus:border-[#3D281D]"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          >
            <option value="Coffee & Espresso">Coffee & Espresso</option>
            <option value="Cold Brews & Teas">Cold Brews & Teas</option>
            <option value="Artisanal Bakery">Artisanal Bakery</option>
            <option value="Sandwiches & Snacks">Sandwiches & Snacks</option>
            <option value="Desserts & Pastries">Desserts & Pastries</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#F7F3EC] rounded-xl border border-[#3D281D]/10 my-1">
          <div>
            <span className="text-sm font-bold text-[#3D281D] block">Available in Menu</span>
            <span className="text-xs text-[#57504B]">Toggle off to mark out of stock</span>
          </div>
          <input
            type="checkbox"
            className="w-5 h-5 accent-[#3D281D] rounded cursor-pointer"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#3D281D]/10">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
