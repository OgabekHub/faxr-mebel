import React, { useState, useCallback, Suspense, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, RotateCcw, Check, Zap, Info, ChevronDown, ChevronUp,
  Move3d, Maximize2, Minimize2,
} from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { FurnitureScene } from './configurator/FurnitureScene';

// ─── Furniture Types ──────────────────────────────────────────────
const furnitureTypes = [
  { id: 'sofa',    labelUz: 'Divan',         labelRu: 'Диван',       labelEn: 'Sofa',     basePrice: 12_000_000, dims: '240 × 95 × 85 cm' },
  { id: 'bedroom', labelUz: 'Yotoqxona',     labelRu: 'Спальня',     labelEn: 'Bedroom',  basePrice: 18_500_000, dims: '200 × 200 × 120 cm' },
  { id: 'dining',  labelUz: 'Ovqat xonasi',  labelRu: 'Столовая',    labelEn: 'Dining',   basePrice: 8_500_000,  dims: '180 × 90 × 76 cm' },
  { id: 'kitchen', labelUz: 'Oshxona',       labelRu: 'Кухня',       labelEn: 'Kitchen',  basePrice: 22_000_000, dims: 'Linear: 3.6 m' },
  { id: 'tv',      labelUz: 'TV Unit',       labelRu: 'ТВ Тумба',    labelEn: 'TV Unit',  basePrice: 6_500_000,  dims: '220 × 45 × 55 cm' },
];

// ─── Fabrics ──────────────────────────────────────────────────────
const fabrics = [
  { id: 'velvet-emerald', nameUz: 'Zumrad Baxmal',    nameRu: 'Изумрудный Бархат',   nameEn: 'Emerald Velvet',  hex: '#1A5C3A', priceAdd: 1_500_000, tag: 'Velvet', specUz: 'Martindale: 50,000 sikl', specRu: 'Мартиндейл: 50,000 циклов', specEn: 'Martindale: 50,000 rubs' },
  { id: 'velvet-navy',    nameUz: 'Moviy Baxmal',     nameRu: 'Синий Бархат',        nameEn: 'Navy Velvet',     hex: '#1B2F6E', priceAdd: 1_500_000, tag: 'Velvet', specUz: 'Martindale: 50,000 sikl', specRu: 'Мартиндейл: 50,000 циклов', specEn: 'Martindale: 50,000 rubs' },
  { id: 'velvet-crimson', nameUz: 'Qizil Baxmal',     nameRu: 'Малиновый Бархат',    nameEn: 'Crimson Velvet',  hex: '#7F1D1D', priceAdd: 1_700_000, tag: 'Velvet', specUz: 'Martindale: 45,000 sikl', specRu: 'Мартиндейл: 45,000 циклов', specEn: 'Martindale: 45,000 rubs' },
  { id: 'velvet-purple',  nameUz: 'Binafsha Baxmal',  nameRu: 'Пурпурный Бархат',    nameEn: 'Royal Mauve',     hex: '#4C1D95', priceAdd: 1_800_000, tag: 'Velvet', specUz: 'Martindale: 45,000 sikl', specRu: 'Мартиндейл: 45,000 циклов', specEn: 'Martindale: 45,000 rubs' },
  { id: 'leather-cognac', nameUz: 'Konyak Charm',     nameRu: 'Коньячная Кожа',      nameEn: 'Cognac Leather',  hex: '#92400E', priceAdd: 2_500_000, tag: 'Leather', specUz: 'Full-grain Italiya charmi', specRu: 'Полнозернистая итальянская кожа', specEn: 'Full-grain Italian hide' },
  { id: 'leather-black',  nameUz: 'Qora Charm',       nameRu: 'Чёрная Кожа',         nameEn: 'Black Leather',   hex: '#1C1C1E', priceAdd: 2_800_000, tag: 'Leather', specUz: 'Mikro-teshikli aeration', specRu: 'Микроперфорированная кожа', specEn: 'Micro-perforated aeration' },
  { id: 'linen-sand',     nameUz: 'Qumloq Zig\'ir',  nameRu: 'Песочный Лён',        nameEn: 'Sand Linen',      hex: '#C8B89A', priceAdd: 900_000,   tag: 'Linen',   specUz: 'Ekologik toza tolalar',    specRu: 'Экологичные волокна', specEn: 'Eco-friendly fibers' },
  { id: 'linen-slate',    nameUz: 'Slate Zig\'ir',    nameRu: 'Сланцевый Лён',       nameEn: 'Slate Linen',     hex: '#64748B', priceAdd: 1_000_000, tag: 'Linen',   specUz: 'Tabiiy zig\'ir tolasi',    specRu: 'Натуральный лён', specEn: 'Natural linen weave' },
];

// ─── Woods ────────────────────────────────────────────────────────
const woods = [
  { id: 'walnut', nameUz: 'Qora Yong\'oq', nameRu: 'Черный Орех',   nameEn: 'Black Walnut', hex: '#3D2314', swatchGrad: 'linear-gradient(135deg,#5C3D2E,#3D2314)', priceAdd: 800_000, originUz: 'Shimoliy Amerika', originRu: 'Северная Америка', originEn: 'North America' },
  { id: 'oak',    nameUz: 'Yevropa Emani', nameRu: 'Европейский Дуб',nameEn: 'European Oak', hex: '#C8A46E', swatchGrad: 'linear-gradient(135deg,#E8C88E,#C8A46E)',  priceAdd: 600_000, originUz: 'Fransiya', originRu: 'Франция', originEn: 'France' },
  { id: 'beech',  nameUz: 'Kavkaz Buki',   nameRu: 'Кавказский Бук', nameEn: 'Caucasian Beech', hex: '#9E7A50', swatchGrad: 'linear-gradient(135deg,#BE9A70,#9E7A50)', priceAdd: 500_000, originUz: 'Kavkaz', originRu: 'Кавказ', originEn: 'Caucasus' },
  { id: 'pine',   nameUz: 'Qarag\'ay',     nameRu: 'Сосна',          nameEn: 'Scandinavian Pine', hex: '#D4B896', swatchGrad: 'linear-gradient(135deg,#F4D8B6,#D4B896)', priceAdd: 300_000, originUz: 'Skandinaviya', originRu: 'Скандинавия', originEn: 'Scandinavia' },
];

// ─── Finishes ─────────────────────────────────────────────────────
const finishes = [
  { id: 'matte', nameUz: 'Matt',    nameRu: 'Матовый',    nameEn: 'Matte',      icon: '◼', priceAdd: 0 },
  { id: 'satin', nameUz: 'Satin',   nameRu: 'Сатиновый',  nameEn: 'Satin',      icon: '◈', priceAdd: 400_000 },
  { id: 'gloss', nameUz: 'Porloq',  nameRu: 'Глянцевый',  nameEn: 'High Gloss', icon: '◆', priceAdd: 700_000 },
];

// ─── Sizes ────────────────────────────────────────────────────────
const sizes = [
  { id: 'S',  labelUz: 'Standart',   labelRu: 'Стандарт',        labelEn: 'Standard',     multiplier: 1.00 },
  { id: 'M',  labelUz: 'Katta',      labelRu: 'Большой',         labelEn: 'Large',         multiplier: 1.15 },
  { id: 'XL', labelUz: 'O\'ta Katta',labelRu: 'Очень Большой',   labelEn: 'Extra Large',   multiplier: 1.35 },
];

// ─── Helpers ──────────────────────────────────────────────────────
interface FurnitureConfiguratorProps {
  onAddedToCart?: (name: string) => void;
}

export const FurnitureConfigurator: React.FC<FurnitureConfiguratorProps> = ({ onAddedToCart }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const lang = i18n.language || 'uz';

  const n  = (o: { nameUz: string; nameRu: string; nameEn: string }) =>
    lang.startsWith('ru') ? o.nameRu : lang.startsWith('uz') ? o.nameUz : o.nameEn;
  const lb = (o: { labelUz: string; labelRu: string; labelEn: string }) =>
    lang.startsWith('ru') ? o.labelRu : lang.startsWith('uz') ? o.labelUz : o.labelEn;

  // ── Selections
  const [furniture, setFurniture] = useState(furnitureTypes[0]);
  const [fabric,    setFabric]    = useState(fabrics[0]);
  const [wood,      setWood]      = useState(woods[0]);
  const [finish,    setFinish]    = useState(finishes[0]);
  const [size,      setSize]      = useState(sizes[0]);

  // ── UI
  const [addedToCart,   setAddedToCart]   = useState(false);
  const [isFullscreen,  setIsFullscreen]  = useState(false);
  const [showDims,      setShowDims]      = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [webGLFailed,   setWebGLFailed]   = useState(false);
  const [hint,          setHint]          = useState(true);

  // Hide orbit hint after 4s
  useEffect(() => { const t = setTimeout(() => setHint(false), 4000); return () => clearTimeout(t); }, []);

  // ── Price
  const base    = furniture.basePrice;
  const total   = Math.round((base + fabric.priceAdd + wood.priceAdd + finish.priceAdd) * size.multiplier);
  const sizeAdd = Math.round((base + fabric.priceAdd + wood.priceAdd + finish.priceAdd) * (size.multiplier - 1));

  // ── Add to cart
  const handleAddToCart = useCallback(() => {
    const prod = {
      id:       `${furniture.id}-${fabric.id}-${wood.id}-${finish.id}-${size.id}-${Date.now()}`,
      name:     `${lb(furniture)} (${n(fabric)} / ${n(wood)} / ${n(finish as any) || finish.nameEn} / ${lb(size)})`,
      price:    total,
      image:    `/images/configurator/${furniture.id}_${fabric.id.split('-')[1] ?? fabric.id}.png`,
      category: furniture.id,
    };
    addToCart(prod);
    setAddedToCart(true);
    onAddedToCart?.(prod.name);
    setTimeout(() => setAddedToCart(false), 3000);
  }, [furniture, fabric, wood, finish, size, total, addToCart, onAddedToCart]);

  const sectionTitle    = lang.startsWith('ru') ? 'Интерактивный' : lang.startsWith('uz') ? 'Interaktiv' : 'Interactive';
  const sectionTitleGold = lang.startsWith('ru') ? 'Конструктор' : lang.startsWith('uz') ? 'Konstruktor' : 'Customizer';

  const canvasWrapCls = isFullscreen
    ? 'fixed inset-0 z-[60] bg-black rounded-none'
    : 'relative w-full rounded-2xl overflow-hidden bg-foreground/[0.03] border border-foreground/5 shadow-inner';

  return (
    <section className="py-16 border-t border-foreground/5 relative">

      {/* ── Section header ── */}
      <div className="text-center mb-12">
        <span className="text-brand-gold uppercase tracking-hero text-[10px] font-black block">
          {t('materials.teaser')}
        </span>
        <h2 className="text-3xl md:text-5xl font-editorial-title mt-2">
          {sectionTitle}{' '}
          <span className="font-bold italic gold-foil-text">{sectionTitleGold}</span>
        </h2>
        <p className="text-xs text-foreground/55 max-w-xl mx-auto mt-4 font-light leading-relaxed">
          {lang.startsWith('ru')
            ? 'Выберите мебель, материал и отделку — 3D-конфигуратор покажет результат в реальном времени.'
            : lang.startsWith('uz')
            ? 'Mebel turini, material va qoplamani tanlang — 3D konfigurator natijani real vaqtda ko\'rsatadi.'
            : 'Select furniture, material & finish — the 3D configurator shows the result in real time.'}
        </p>
      </div>

      {/* ── Furniture type tabs ── */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-8 justify-center flex-wrap">
        {furnitureTypes.map(ft => (
          <motion.button
            key={ft.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFurniture(ft)}
            className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 border ${
              furniture.id === ft.id
                ? 'bg-brand-gold text-black border-brand-gold shadow-lg shadow-brand-gold/20'
                : 'bg-foreground/5 text-foreground/55 border-foreground/10 hover:border-brand-gold/40 hover:text-foreground'
            }`}
          >
            {lb(ft)}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ══════════════════════════════════════════════════
            LEFT — 3D Viewer
        ══════════════════════════════════════════════════ */}
        <div className={`${isFullscreen ? '' : 'lg:col-span-7'} flex flex-col gap-4`}>

          {/* Viewer header */}
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[9px] uppercase font-black tracking-widest text-brand-gold">
                {lang.startsWith('ru') ? '3D Визуализация' : lang.startsWith('uz') ? '3D Vizualizatsiya' : '3D Preview'}
              </span>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={`${furniture.id}-${fabric.id}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xl font-bold font-editorial-title text-foreground mt-0.5"
                >
                  {lb(furniture)} — {n(fabric)}
                </motion.h3>
              </AnimatePresence>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDims(v => !v)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
                  showDims ? 'bg-brand-gold text-black border-brand-gold' : 'bg-foreground/5 text-foreground/55 border-foreground/10 hover:border-brand-gold/30'
                }`}
                title="Dimensions"
              >
                <Info className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(v => !v)}
                className="w-9 h-9 rounded-full bg-foreground/5 text-foreground/55 border border-foreground/10 hover:border-brand-gold/30 flex items-center justify-center transition-all"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* ── 3D Canvas ── */}
          <div className={canvasWrapCls} style={{ height: isFullscreen ? '100dvh' : '420px' }}>

            {!webGLFailed ? (
              <FurnitureScene
                furnitureId={furniture.id}
                fabricColor={fabric.hex}
                woodColor={wood.hex}
                finishId={finish.id}
                className="w-full h-full"
              />
            ) : (
              /* Fallback: pre-rendered image */
              <img
                src={`/images/configurator/${furniture.id}_${fabric.id.split('-')[1] ?? 'default'}.png`}
                onError={e => { (e.target as HTMLImageElement).src = `/images/sofa_beige.png`; }}
                alt={lb(furniture)}
                className="w-full h-full object-contain p-8"
              />
            )}

            {/* Orbit hint */}
            <AnimatePresence>
              {hint && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-foreground/70 pointer-events-none"
                >
                  <Move3d className="w-3.5 h-3.5 text-brand-gold" />
                  {lang.startsWith('ru') ? 'Тяните для поворота · Прокрутите для зума' : lang.startsWith('uz') ? 'Aylantiring · Kattalashtiring' : 'Drag to orbit · Scroll to zoom'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Dimensions badge */}
            <AnimatePresence>
              {showDims && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute top-4 left-4 glass px-3 py-2 rounded-xl border border-white/10 text-[9px] font-black text-foreground/80"
                >
                  📐 {furniture.dims}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Material badge */}
            <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full border border-brand-gold/20 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full border border-white/20 flex-shrink-0" style={{ backgroundColor: fabric.hex }} />
              <span className="text-[8px] font-black text-brand-gold uppercase tracking-widest">{n(fabric).split(' ')[0]}</span>
            </div>

            {/* Fullscreen close */}
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Config summary bar */}
          <div className="bento-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <div className="text-[8px] uppercase font-black tracking-widest text-foreground/35">
                {lang.startsWith('ru') ? 'Конфигурация' : lang.startsWith('uz') ? 'Konfiguratsiya' : 'Configuration'}
              </div>
              <div className="text-xs font-bold text-foreground truncate">
                <span className="text-brand-gold">{n(fabric)}</span>
                {' + '}<span>{n(wood).split(' ')[0]}</span>
                {' · '}<span className="text-foreground/50">{n(finish as any) || finish.nameEn}</span>
                {' · '}<span className="text-foreground/50">{lb(size)}</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[8px] uppercase font-black tracking-widest text-foreground/35">
                {lang.startsWith('ru') ? 'Итого' : lang.startsWith('uz') ? 'Jami' : 'Total'}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={total}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="price-tag text-2xl font-bold"
                >
                  {formatPrice(total)}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            RIGHT — Selector Panel
        ══════════════════════════════════════════════════ */}
        <div className={`${isFullscreen ? 'hidden' : 'lg:col-span-5'} flex flex-col bento-card p-6 md:p-8 gap-6`}>

          {/* 1. Fabric */}
          <div>
            <span className="text-[9px] uppercase font-black tracking-hero text-brand-gold block mb-3">
              1. {lang.startsWith('ru') ? 'Обивка / Материал' : lang.startsWith('uz') ? 'Qoplama material' : 'Upholstery'}
            </span>

            <div className="grid grid-cols-8 gap-1.5 mb-3">
              {fabrics.map(f => (
                <motion.button
                  key={f.id}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setFabric(f)}
                  title={n(f)}
                  className={`aspect-square rounded-full transition-all duration-300 relative flex items-center justify-center ${
                    fabric.id === f.id
                      ? 'ring-2 ring-brand-gold ring-offset-2 dark:ring-offset-black scale-110'
                      : 'hover:scale-105 hover:ring-1 hover:ring-brand-gold/50 ring-offset-1'
                  }`}
                  style={{ backgroundColor: f.hex }}
                >
                  {fabric.id === f.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-white rounded-full shadow" />
                  )}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={fabric.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-foreground/[0.03] p-3.5 rounded-xl border border-foreground/5 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg flex-shrink-0 border border-white/10 shadow-inner" style={{ backgroundColor: fabric.hex }} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-black text-foreground truncate">{n(fabric)}</span>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase text-white" style={{ backgroundColor: fabric.hex }}>
                      {fabric.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-foreground/40 italic leading-relaxed">
                    {lang.startsWith('ru') ? fabric.specRu : lang.startsWith('uz') ? fabric.specUz : fabric.specEn}
                  </p>
                  <span className="text-[9px] font-black text-brand-gold mt-0.5 block">+{formatPrice(fabric.priceAdd)}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 2. Wood */}
          <div>
            <span className="text-[9px] uppercase font-black tracking-hero text-brand-gold block mb-3">
              2. {lang.startsWith('ru') ? 'Дерево каркаса' : lang.startsWith('uz') ? 'Ramka yog\'ochi' : 'Frame Wood'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              {woods.map(w => (
                <motion.button
                  key={w.id}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setWood(w)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all border text-left ${
                    wood.id === w.id
                      ? 'border-brand-gold bg-brand-gold/5 shadow-sm'
                      : 'border-foreground/8 bg-foreground/[0.02] hover:border-brand-gold/30'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg flex-shrink-0 border border-white/10 shadow" style={{ background: w.swatchGrad }} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[9px] font-black text-foreground uppercase tracking-wide truncate">{n(w).split(' ')[0]}</div>
                    <div className="text-[8px] text-foreground/40 truncate">
                      {lang.startsWith('ru') ? w.originRu : lang.startsWith('uz') ? w.originUz : w.originEn}
                    </div>
                  </div>
                  {wood.id === w.id && <Check className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />}
                </motion.button>
              ))}
            </div>
          </div>

          {/* 3. Finish */}
          <div>
            <span className="text-[9px] uppercase font-black tracking-hero text-brand-gold block mb-3">
              3. {lang.startsWith('ru') ? 'Отделка поверхности' : lang.startsWith('uz') ? 'Sirt qoplama' : 'Surface Finish'}
            </span>
            <div className="flex gap-2">
              {finishes.map(f => (
                <motion.button
                  key={f.id}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setFinish(f)}
                  className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex flex-col items-center gap-1 border ${
                    finish.id === f.id
                      ? 'bg-brand-gold text-black border-brand-gold shadow-lg shadow-brand-gold/15'
                      : 'bg-foreground/5 text-foreground/55 border-foreground/10 hover:border-brand-gold/30'
                  }`}
                >
                  <span className="text-base leading-none">{f.icon}</span>
                  <span>{lang.startsWith('ru') ? f.nameRu : lang.startsWith('uz') ? f.nameUz : f.nameEn}</span>
                  {f.priceAdd > 0 && (
                    <span className={`text-[7px] font-black ${finish.id === f.id ? 'text-black/60' : 'text-brand-gold'}`}>
                      +{formatPrice(f.priceAdd)}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* 4. Size */}
          <div>
            <span className="text-[9px] uppercase font-black tracking-hero text-brand-gold block mb-3">
              4. {lang.startsWith('ru') ? 'Размер' : lang.startsWith('uz') ? 'O\'lcham' : 'Size'}
            </span>
            <div className="flex gap-2">
              {sizes.map(s => (
                <motion.button
                  key={s.id}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setSize(s)}
                  className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                    size.id === s.id
                      ? 'bg-foreground text-background border-foreground'
                      : 'bg-foreground/5 text-foreground/55 border-foreground/10 hover:border-brand-gold/30'
                  }`}
                >
                  {s.id}
                  <span className="block text-[7px] mt-0.5 font-normal normal-case tracking-normal">{lb(s)}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Price Breakdown toggle */}
          <div className="bg-foreground/[0.03] rounded-xl border border-foreground/5 overflow-hidden">
            <button
              onClick={() => setShowBreakdown(v => !v)}
              className="w-full flex justify-between items-center px-4 py-3 text-[9px] font-black uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors"
            >
              {lang.startsWith('ru') ? 'Детализация цены' : lang.startsWith('uz') ? 'Narx tafsiloti' : 'Price Breakdown'}
              {showBreakdown ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            <AnimatePresence>
              {showBreakdown && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-4 pb-4 space-y-2 border-t border-foreground/5"
                >
                  {[
                    { label: lang.startsWith('ru') ? 'Базовая цена' : lang.startsWith('uz') ? 'Asosiy narx' : 'Base price',      val: base },
                    { label: lang.startsWith('ru') ? 'Обивка'       : lang.startsWith('uz') ? 'Qoplama'     : 'Upholstery',       val: fabric.priceAdd },
                    { label: lang.startsWith('ru') ? 'Дерево'       : lang.startsWith('uz') ? 'Yog\'och'    : 'Wood',             val: wood.priceAdd },
                    { label: lang.startsWith('ru') ? 'Отделка'      : lang.startsWith('uz') ? 'Qoplam'      : 'Finish',           val: finish.priceAdd },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-[9px] mt-2">
                      <span className="text-foreground/50">{item.label}</span>
                      <span className="font-black text-foreground">{formatPrice(item.val)}</span>
                    </div>
                  ))}
                  {size.multiplier > 1 && (
                    <div className="flex justify-between text-[9px]">
                      <span className="text-foreground/50">
                        {lang.startsWith('ru') ? 'Надбавка за размер' : lang.startsWith('uz') ? 'O\'lcham narxi' : 'Size premium'} (×{size.multiplier})
                      </span>
                      <span className="font-black text-brand-gold">+{formatPrice(sizeAdd)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[10px] pt-2 border-t border-foreground/5">
                    <span className="font-black uppercase tracking-wider">{lang.startsWith('ru') ? 'Итого' : lang.startsWith('uz') ? 'Jami' : 'Total'}</span>
                    <span className="font-black text-brand-gold">{formatPrice(total)}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add to Cart */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={addedToCart}
            className={`w-full py-4 rounded-xl font-extrabold text-[10px] uppercase tracking-hero transition-all duration-500 flex items-center justify-center gap-2.5 shadow-xl ${
              addedToCart
                ? 'bg-green-500 text-white shadow-green-500/20'
                : 'bg-brand-gold text-black hover:bg-brand-gold-muted shadow-brand-gold/15 hover:scale-[1.01]'
            }`}
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {lang.startsWith('ru') ? 'Добавлено!' : lang.startsWith('uz') ? 'Qo\'shildi!' : 'Added!'}
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  {lang.startsWith('ru') ? 'Добавить в корзину' : lang.startsWith('uz') ? 'Savatga qo\'shish' : 'Add to Cart'}
                  {' · '}{formatPrice(total)}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Delivery note */}
          <div className="flex items-center gap-2 text-[8px] text-foreground/35 font-bold uppercase tracking-widest justify-center">
            <Zap className="w-3 h-3 text-brand-gold" />
            {lang.startsWith('ru')
              ? 'Производство 15–30 дней · Бесплатная доставка по Ташкенту'
              : lang.startsWith('uz')
              ? 'Ishlab chiqarish 15–30 kun · Toshkent bo\'yicha bepul yetkazib berish'
              : 'Crafted in 15–30 days · Free delivery in Tashkent'}
          </div>
        </div>
      </div>
    </section>
  );
};
