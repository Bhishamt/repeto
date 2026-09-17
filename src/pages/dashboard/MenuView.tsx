import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Product } from '../../types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ProductFormModal } from '../../components/domain/ProductFormModal';
import { Plus, Edit2, Trash2, Coffee, Check, X } from 'lucide-react';

export const MenuView: React.FC = () => {
  const { activeBusiness } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const fetchProducts = () => {
    if (activeBusiness) {
      apiService.getProductsByBusiness(activeBusiness.id).then(setProducts);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeBusiness]);

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (!activeBusiness) return;
    await apiService.saveProduct({ ...productData, businessId: activeBusiness.id });
    fetchProducts();
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this menu item?')) {
      await apiService.deleteProduct(productId);
      fetchProducts();
    }
  };

  const handleToggleAvailability = async (product: Product) => {
    if (!activeBusiness) return;
    await apiService.saveProduct({
      ...product,
      businessId: activeBusiness.id,
      isAvailable: !product.isAvailable,
    });
    fetchProducts();
  };

  const categories = Array.from(new Set(products.map((p) => p.categoryName || 'General')));

  const filteredProducts = products.filter(
    (p) => selectedCategory === 'ALL' || (p.categoryName || 'General') === selectedCategory
  );

  if (!activeBusiness) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#3D281D]/10">
        <div>
          <h1 className="text-3xl font-extrabold font-heading text-[#3D281D]">
            Menu & Products
          </h1>
          <p className="text-xs text-[#57504B] font-medium mt-1">
            Manage prices, points earned per item, and menu availability for {activeBusiness.name}.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Menu Product</span>
        </Button>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === 'ALL'
              ? 'bg-[#3D281D] text-[#FDFBF7] shadow-sm'
              : 'bg-[#EFE7DC] text-[#57504B] hover:bg-[#E2D6C5]'
          }`}
        >
          All Items ({products.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#3D281D] text-[#FDFBF7] shadow-sm'
                : 'bg-[#EFE7DC] text-[#57504B] hover:bg-[#E2D6C5]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            variant="glass"
            className={`flex flex-col justify-between p-5 border border-[#3D281D]/15 relative overflow-hidden ${
              !product.isAvailable ? 'opacity-60 bg-[#F7F3EC]' : ''
            }`}
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#3D281D]/15 shadow-sm shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#EFE7DC] flex items-center justify-center shrink-0">
                    <Coffee className="w-8 h-8 text-[#3D281D]" />
                  </div>
                )}
                <div>
                  <Badge variant="espresso" className="mb-1 text-[10px]">
                    {product.categoryName || 'General'}
                  </Badge>
                  <h3 className="font-heading font-bold text-lg text-[#3D281D] leading-tight">
                    {product.name}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#57504B] line-clamp-2">{product.description}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-[#3D281D]/10 flex items-center justify-between">
              <div>
                <span className="text-2xl font-extrabold font-heading text-[#3D281D]">
                  ₹{product.price}
                </span>
                <span className="text-xs text-[#D97706] font-bold block">
                  +{product.pointsEarned} points earned
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleAvailability(product)}
                  className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                    product.isAvailable
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-stone-200 text-stone-600 border-stone-300'
                  }`}
                  title={product.isAvailable ? 'In Stock (click to disable)' : 'Out of Stock (click to enable)'}
                >
                  {product.isAvailable ? 'Available' : 'Disabled'}
                </button>

                <button
                  onClick={() => {
                    setEditingProduct(product);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-[#57504B] hover:text-[#3D281D] hover:bg-[#EFE7DC] rounded-lg transition-colors cursor-pointer"
                  title="Edit Product"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 text-[#57504B] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        businessId={activeBusiness.id}
      />
    </div>
  );
};
