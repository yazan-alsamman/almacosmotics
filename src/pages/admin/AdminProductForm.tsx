import { useEffect, useRef, useState, type DragEvent } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useCatalogStore } from '@/store/catalogStore';
import { useStockStore } from '@/store/stockStore';
import { useLanguage } from '@/i18n/LanguageContext';
import { Product } from '@/types';
import { compressImageFile } from '@/lib/compressImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ImagePlus, Upload, X } from 'lucide-react';

const emptyForm = (): Omit<Product, 'id'> => ({
  name: '',
  nameAr: '',
  description: '',
  howToUse: '',
  ingredients: '',
  image: '',
  gallery: [],
  price: 0,
  category: 'makeup',
  rating: 4.8,
  inStock: true,
  tags: [],
});

const STEPS = 4;

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isCreate = location.pathname.endsWith('/products/new');
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isEdit = Boolean(id) && !isCreate;

  const addProduct = useCatalogStore((s) => s.addProduct);
  const updateProduct = useCatalogStore((s) => s.updateProduct);
  const products = useCatalogStore((s) => s.products);
  const setInitialStock = useStockStore((s) => s.setInitialStock);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyForm);
  /** Gallery URLs excluding the primary `form.image` (extras only). */
  const [extraGallery, setExtraGallery] = useState<string[]>([]);
  const [tagsText, setTagsText] = useState('');
  const [stockQty, setStockQty] = useState(10);
  const [mediaBusy, setMediaBusy] = useState(false);
  const primaryFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEdit || !id) return;
    const p = products.find((x) => x.id === id);
    if (!p) {
      navigate('/admin/products');
      return;
    }
    setForm({
      name: p.name,
      nameAr: p.nameAr ?? '',
      description: p.description,
      howToUse: p.howToUse,
      ingredients: p.ingredients,
      image: p.image,
      gallery: p.gallery,
      price: p.price,
      category: p.category,
      rating: p.rating,
      inStock: p.inStock,
      tags: p.tags ?? [],
    });
    setExtraGallery(p.gallery.filter((url) => url !== p.image));
    setTagsText((p.tags ?? []).join(', '));
    setStockQty(useStockStore.getState().getStock(id));
  }, [isEdit, id, products, navigate]);

  const setField = <K extends keyof Omit<Product, 'id'>>(key: K, v: Omit<Product, 'id'>[K]) => {
    setForm((f) => ({ ...f, [key]: v }));
  };

  const mergeGallery = () => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const u of [form.image, ...extraGallery]) {
      if (u && !seen.has(u)) {
        seen.add(u);
        out.push(u);
      }
    }
    return out;
  };

  const handlePrimaryFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setMediaBusy(true);
    try {
      const url = await compressImageFile(file);
      setField('image', url);
    } catch (e) {
      toast.error('Could not use this image', { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setMediaBusy(false);
    }
  };

  const handleGalleryFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (!list.length) return;
    setMediaBusy(true);
    try {
      const urls = await Promise.all(list.map((f) => compressImageFile(f)));
      setExtraGallery((g) => [...g, ...urls]);
    } catch (e) {
      toast.error('Could not add images', { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setMediaBusy(false);
    }
  };

  const handleSubmit = () => {
    const gallery = mergeGallery();
    const tags = tagsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const payload = {
      ...form,
      gallery: gallery.length ? gallery : [],
      image: form.image || gallery[0] || '',
      tags,
    };

    if (isEdit && id) {
      updateProduct(id, payload);
      setInitialStock(id, stockQty);
    } else {
      const created = addProduct(payload);
      setInitialStock(created.id, stockQty);
    }
    navigate('/admin/products');
  };

  const stepTitle = [t('admin.stepBasics'), t('admin.stepMedia'), t('admin.stepPricing'), t('admin.stepReview')][step];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div>
        <h1 className="font-serif text-3xl">{isEdit ? t('admin.edit') : t('admin.newProduct')}</h1>
        <p className="text-sm text-muted-foreground mt-2">{stepTitle}</p>
        <div className="flex gap-1 mt-4">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= step ? 'bg-foreground' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-xl p-6 md:p-8 shadow-xl">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{t('admin.productName')}</label>
                <Input
                  className="mt-1 rounded-xl"
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{t('admin.nameAr')}</label>
                <Input
                  className="mt-1 rounded-xl"
                  dir="rtl"
                  value={form.nameAr}
                  onChange={(e) => setField('nameAr', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{t('admin.category')}</label>
                <Select value={form.category} onValueChange={(v) => setField('category', v as Product['category'])}>
                  <SelectTrigger className="mt-1 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="makeup">Makeup</SelectItem>
                    <SelectItem value="skincare">Skincare</SelectItem>
                    <SelectItem value="fragrance">Fragrance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{t('admin.description')}</label>
                <Textarea
                  className="mt-1 rounded-xl min-h-[100px]"
                  value={form.description}
                  onChange={(e) => setField('description', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{t('admin.howToUse')}</label>
                <Textarea
                  className="mt-1 rounded-xl min-h-[80px]"
                  value={form.howToUse}
                  onChange={(e) => setField('howToUse', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{t('admin.ingredients')}</label>
                <Textarea
                  className="mt-1 rounded-xl min-h-[80px]"
                  value={form.ingredients}
                  onChange={(e) => setField('ingredients', e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <input
                ref={primaryFileRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={mediaBusy}
                onChange={(e) => {
                  void handlePrimaryFiles(e.target.files);
                  e.target.value = '';
                }}
              />
              <input
                ref={galleryFileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={mediaBusy}
                onChange={(e) => {
                  void handleGalleryFiles(e.target.files);
                  e.target.value = '';
                }}
              />

              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{t('admin.heroImage')}</label>
                <button
                  type="button"
                  disabled={mediaBusy}
                  onClick={() => primaryFileRef.current?.click()}
                  onDragOver={(e: DragEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e: DragEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void handlePrimaryFiles(e.dataTransfer.files);
                  }}
                  className="mt-2 flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 px-4 py-10 text-center transition-colors hover:border-foreground/30 hover:bg-muted/30 disabled:opacity-60"
                >
                  <Upload className="h-10 w-10 text-muted-foreground" aria-hidden />
                  <span className="text-sm font-sans text-foreground">{t('admin.uploadDropHint')}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">JPEG · PNG · WebP</span>
                </button>
                {form.image && (
                  <div className="relative mt-4 inline-block max-w-full">
                    <img
                      src={form.image}
                      alt=""
                      className="max-h-48 w-auto max-w-full rounded-xl border border-border/50 object-contain shadow-sm"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute -end-2 -top-2 h-8 w-8 rounded-full shadow-md"
                      onClick={() => setField('image', '')}
                      aria-label={t('admin.removePhoto')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{t('admin.addImages')}</label>
                <p className="mt-1 text-xs text-muted-foreground">{t('admin.uploadGalleryHint')}</p>
                <button
                  type="button"
                  disabled={mediaBusy}
                  onClick={() => galleryFileRef.current?.click()}
                  onDragOver={(e: DragEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e: DragEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    void handleGalleryFiles(e.dataTransfer.files);
                  }}
                  className="mt-2 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/60 bg-muted/10 px-4 py-8 text-center transition-colors hover:border-foreground/25 hover:bg-muted/25 disabled:opacity-60"
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground" aria-hidden />
                  <span className="text-sm font-sans text-muted-foreground">{t('admin.uploadDropHint')}</span>
                </button>
                {extraGallery.length > 0 && (
                  <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {extraGallery.map((src, i) => (
                      <li key={i} className="relative aspect-square overflow-hidden rounded-xl border border-border/50 bg-muted/20">
                        <img src={src} alt="" className="h-full w-full object-cover" />
                        <Button
                          type="button"
                          size="icon"
                          variant="secondary"
                          className="absolute end-1 top-1 h-7 w-7 rounded-full shadow-md"
                          onClick={() => setExtraGallery((g) => g.filter((_, j) => j !== i))}
                          aria-label={t('admin.removePhoto')}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{t('admin.price')}</label>
                <Input
                  type="number"
                  className="mt-1 rounded-xl"
                  value={form.price || ''}
                  onChange={(e) => setField('price', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{t('admin.stockQty')}</label>
                <Input
                  type="number"
                  className="mt-1 rounded-xl"
                  value={stockQty}
                  onChange={(e) => setStockQty(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{t('admin.rating')}</label>
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  max={5}
                  className="mt-1 rounded-xl"
                  value={form.rating}
                  onChange={(e) => setField('rating', Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">{t('admin.tags')}</label>
                <Input
                  className="mt-1 rounded-xl"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3 text-sm font-sans"
            >
              <p className="font-serif text-lg">{form.name}</p>
              <p className="text-muted-foreground">{form.category} · {form.price.toLocaleString()} {t('common.currency')}</p>
              <p className="text-muted-foreground line-clamp-3">{form.description}</p>
              <p className="text-xs text-muted-foreground">{t('admin.stock')}: {stockQty}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-6 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ChevronLeft className="me-1 h-4 w-4" />
            {t('admin.back')}
          </Button>
          {step < STEPS - 1 ? (
            <Button type="button" className="rounded-full" onClick={() => setStep((s) => s + 1)}>
              {t('admin.next')}
              <ChevronRight className="ms-1 h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" className="rounded-full bg-foreground text-background" onClick={handleSubmit}>
              {isEdit ? t('admin.save') : t('admin.submit')}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminProductForm;
