import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, RotateCcw, Maximize2, Minimize2, Check, Zap, Info } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { FurnitureScene } from './configurator/FurnitureScene';

// ─── Furniture Types ──────────────────────────────────────────────
const furnitureTypes = [
  {
    id: 'sofa',
    labelUz: 'Divan',
    labelRu: 'Диван',
    labelEn: 'Sofa',
    image: '/images/sofa_beige.png',
    basePrice: 12_000_000,
    dims: '240 × 95 × 85 cm',
  },
  {
    id: 'bedroom',
    labelUz: 'Yotoqxona',
    labelRu: 'Спальня',
    labelEn: 'Bedroom',
    image: '/images/bedroom_gold_black.png',
    basePrice: 18_500_000,
    dims: '200 × 200 × 120 cm',
  },
  {
    id: 'dining',
    labelUz: 'Ovqat xonasi',
    labelRu: 'Столовая',
    labelEn: 'Dining',
    image: '/images/dining_table.png',
    basePrice: 8_500_000,
    dims: '180 × 90 × 76 cm',
  },
  {
    id: 'kitchen',
    labelUz: 'Oshxona',
    labelRu: 'Кухня',
    labelEn: 'Kitchen',
    image: '/images/kitchen_neoclassic.png',
    basePrice: 22_000_000,
    dims: 'Linear: 3.6 m set',
  },
  {
    id: 'tv',
    labelUz: 'TV Unit',
    labelRu: 'ТВ Тумба',
    labelEn: 'TV Unit',
    image: '/images/tv_gorka_modern.png',
    basePrice: 6_500_000,
    dims: '220 × 45 × 55 cm',
  },
];

// ─── Fabric / Upholstery Options ──────────────────────────────────
const fabrics = [
  {
    id: 'velvet-emerald',
    nameUz: 'Zumrad Baxmal',
    nameRu: 'Изумрудный Бархат',
    nameEn: 'Emerald Velvet',
    hex: '#064E3B',
    // CSS filter values for mix-blend-multiply overlay
    hue: 160,
    sat: 90,
    brightness: 0.55,
    opacity: 0.60,
    priceAdd: 1_500_000,
    specUz: 'Martindale: 50,000 sikl',
    specRu: 'Мартиндейл: 50,000 циклов',
    specEn: 'Martindale: 50,000 rubs',
    tag: 'Velvet',
    tagColor: '#064E3B',
  },
  {
    id: 'velvet-navy',
    nameUz: 'Tungi Ko\'k Baxmal',
    nameRu: 'Ночной Синий Бархат',
    nameEn: 'Midnight Navy',
    hex: '#1E3A8A',
    hue: 220,
    sat: 80,
    brightness: 0.45,
    opacity: 0.60,
    priceAdd: 1_500_000,
    specUz: 'Martindale: 50,000 sikl',
    specRu: 'Мартиндейл: 50,000 циклов',
    specEn: 'Martindale: 50,000 rubs',
    tag: 'Velvet',
    tagColor: '#1E3A8A',
  },
  {
    id: 'velvet-crimson',
    nameUz: 'Qirol Qizil Baxmal',
    nameRu: 'Королевский Малиновый',
    nameEn: 'Imperial Crimson',
    hex: '#7F1D1D',
    hue: 0,
    sat: 85,
    brightness: 0.45,
    opacity: 0.55,
    priceAdd: 1_700_000,
    specUz: 'Martindale: 45,000 sikl',
    specRu: 'Мартиндейл: 45,000 циклов',
    specEn: 'Martindale: 45,000 rubs',
    tag: 'Velvet',
    tagColor: '#7F1D1D',
  },
  {
    id: 'velvet-purple',
    nameUz: 'Qirollik Binafsha',
    nameRu: 'Королевский Пурпур',
    nameEn: 'Royal Mauve',
    hex: '#4C1D95',
    hue: 270,
    sat: 75,
    brightness: 0.45,
    opacity: 0.55,
    priceAdd: 1_800_000,
    specUz: 'Martindale: 45,000 sikl',
    specRu: 'Мартиндейл: 45,000 циклов',
    specEn: 'Martindale: 45,000 rubs',
    tag: 'Velvet',
    tagColor: '#4C1D95',
  },
  {
    id: 'leather-cognac',
    nameUz: 'Konyak Charm',
    nameRu: 'Коньячная Кожа',
    nameEn: 'Cognac Leather',
    hex: '#92400E',
    hue: 30,
    sat: 70,
    brightness: 0.50,
    opacity: 0.48,
    priceAdd: 2_500_000,
    specUz: 'Full-grain Italiya charmi',
    specRu: 'Полнозернистая итальянская кожа',
    specEn: 'Full-grain Italian hide',
    tag: 'Leather',
    tagColor: '#92400E',
  },
  {
    id: 'leather-obsidian',
    nameUz: 'Obsidian Nappa',
    nameRu: 'Обсидиановая Наппа',
    nameEn: 'Obsidian Nappa',
    hex: '#111827',
    hue: 210,
    sat: 15,
    brightness: 0.18,
    opacity: 0.75,
    priceAdd: 2_800_000,
    specUz: 'Mikro-teshikli aeration',
    specRu: 'Микроперфорированная кожа',
    specEn: 'Micro-perforated aeration',
    tag: 'Leather',
    tagColor: '#374151',
  },
  {
    id: 'linen-sand',
    nameUz: 'Qumloq Zig\'ir',
    nameRu: 'Песочный Лён',
    nameEn: 'Sand Linen',
    hex: '#D4C5B0',
    hue: 38,
    sat: 30,
    brightness: 0.95,
    opacity: 0.25,
    priceAdd: 900_000,
    specUz: 'Ekologik toza tolalar',
    specRu: 'Экологичные волокна',
    specEn: 'Eco-friendly natural fibers',
    tag: 'Linen',
    tagColor: '#D4C5B0',
  },
  {
    id: 'linen-slate',
    nameUz: 'Slate Zig\'ir',
    nameRu: 'Сланцевый Лён',
    nameEn: 'Slate Linen',
    hex: '#475569',
    hue: 210,
    sat: 20,
    brightness: 0.55,
    opacity: 0.45,
    priceAdd: 1_000_000,
    specUz: 'Tabiiy zig\'ir tolasi',
    specRu: 'Натуральный лён',
    specEn: 'Natural linen weave',
    tag: 'Linen',
    tagColor: '#475569',
  },
];

// ─── Wood Options ─────────────────────────────────────────────────
const woods = [
  {
    id: 'walnut',
    nameUz: 'Qora Yong\'oq',
    nameRu: 'Американский Орех',
    nameEn: 'Black Walnut',
    color: '#3D2314',
    swatchGrad: 'linear-gradient(135deg, #5C3D2E 0%, #3D2314 50%, #2A1A0E 100%)',
    priceAdd: 800_000,
    originUz: 'Shimoliy Amerika',
    originRu: 'Северная Америка',
    originEn: 'North America',
    gradeUz: 'A-sinf qattiq yog\'och',
    gradeRu: 'Класс А твёрдой породы',
    gradeEn: 'Grade-A Hardwood',
  },
  {
    id: 'oak',
    nameUz: 'Yevropa Emani',
    nameRu: 'Европейский Дуб',
    nameEn: 'European Oak',
    color: '#C8A46E',
    swatchGrad: 'linear-gradient(135deg, #E8C88E 0%, #C8A46E 50%, #A8844E 100%)',
    priceAdd: 600_000,
    originUz: 'Fransiya',
    originRu: 'Франция',
    originEn: 'France',
    gradeUz: 'Namlikka chidamli',
    gradeRu: 'Влагостойкий дуб',
    gradeEn: 'Moisture-resistant oak',
  },
  {
    id: 'beech',
    nameUz: 'Kavkaz Buki',
    nameRu: 'Кавказский Бук',
    nameEn: 'Caucasian Beech',
    color: '#9E7A50',
    swatchGrad: 'linear-gradient(135deg, #BE9A70 0%, #9E7A50 50%, #7E5A30 100%)',
    priceAdd: 500_000,
    originUz: 'Kavkaz tog\'lari',
    originRu: 'Кавказские горы',
    originEn: 'Caucasus Mts.',
    gradeUz: 'Egishga qulay',
    gradeRu: 'Гибкая порода',
    gradeEn: 'Steamed pliable',
  },
  {
    id: 'pine',
    nameUz: 'Skandinav Qarag\'ayi',
    nameRu: 'Скандинавская Сосна',
    nameEn: 'Scandinavian Pine',
    color: '#D4B896',
    swatchGrad: 'linear-gradient(135deg, #F4D8B6 0%, #D4B896 50%, #B49876 100%)',
    priceAdd: 300_000,
    originUz: 'Skandinaviya',
    originRu: 'Скандинавия',
    originEn: 'Scandinavia',
    gradeUz: 'Engil va chidamli',
    gradeRu: 'Лёгкая и прочная',
    gradeEn: 'Light & durable',
  },
];

// ─── Finish Options ───────────────────────────────────────────────
const finishes = [
  {
    id: 'matte',
    nameUz: 'Matt',
    nameRu: 'Матовый',
    nameEn: 'Matte',
    icon: '◼',
    priceAdd: 0,
  },
  {
    id: 'satin',
    nameUz: 'Satin',
    nameRu: 'Сатиновый',
    nameEn: 'Satin',
    icon: '◈',
    priceAdd: 400_000,
  },
  {
    id: 'gloss',
    nameUz: 'Porloq',
    nameRu: 'Глянцевый',
    nameEn: 'High Gloss',
    icon: '◆',
    priceAdd: 700_000,
  },
];

// ─── Size Options ─────────────────────────────────────────────────
const sizes = [
  { id: 'S', labelUz: 'Standart', labelRu: 'Стандарт', labelEn: 'Standard', multiplier: 1.0 },
  { id: 'M', labelUz: 'Katta', labelRu: 'Большой', labelEn: 'Large', multiplier: 1.15 },
  { id: 'XL', labelUz: 'O\'ta Katta', labelRu: 'Очень Большой', labelEn: 'Extra Large', multiplier: 1.35 },
];

// ─── Component ───────────────────────────────────────────────────
interface FurnitureConfiguratorProps {
  onAddedToCart?: (name: string) => void;
}

export const FurnitureConfigurator: React.FC<FurnitureConfiguratorProps> = ({ onAddedToCart }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const lang = i18n.language || 'uz';

  // ── Selections
  const [activeFurniture, setActiveFurniture] = useState(furnitureTypes[0]);
  const [activeFabric, setActiveFabric] = useState(fabrics[0]);
  const [activeWood, setActiveWood] = useState(woods[0]);
  const [activeFinish, setActiveFinish] = useState(finishes[0]);
  const [activeSize, setActiveSize] = useState(sizes[0]);

  // ── UI state
  const [isRotating, setIsRotating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDimensions, setShowDimensions] = useState(false);
  const [is3DMode, setIs3DMode] = useState(true);
  const [webglSupported, setWebglSupported] = useState(true);

  // Detect WebGL support on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebglSupported(supported);
      setIs3DMode(supported);
    } catch (e) {
      setWebglSupported(false);
      setIs3DMode(false);
    }
  }, []);

  const rotationRef = useRef<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // ── Price calculation
  const totalPrice = Math.round(
    (activeFurniture.basePrice + activeFabric.priceAdd + activeWood.priceAdd + activeFinish.priceAdd)
    * activeSize.multiplier
  );

  // ── 360° rotation animation
  const toggleRotation = useCallback(() => {
    if (isRotating) {
      if (rotationRef.current) cancelAnimationFrame(rotationRef.current);
      setIsRotating(false);
      setRotationAngle(0);
    } else {
      setIsRotating(true);
    }
  }, [isRotating]);

  useEffect(() => {
    if (!isRotating) return;
    let lastTime: number | null = null;
    const animate = (time: number) => {
      if (lastTime !== null) {
        const delta = time - lastTime;
        setRotationAngle(prev => (prev + delta * 0.035) % 360);
      }
      lastTime = time;
      rotationRef.current = requestAnimationFrame(animate);
    };
    rotationRef.current = requestAnimationFrame(animate);
    return () => {
      if (rotationRef.current) cancelAnimationFrame(rotationRef.current);
    };
  }, [isRotating]);

  // Reset image loaded when furniture type changes
  useEffect(() => {
    setImageLoaded(false);
  }, [activeFurniture]);

  // ── Name helpers
  const name = (o: { nameUz: string; nameRu: string; nameEn: string }) =>
    lang.startsWith('ru') ? o.nameRu : lang.startsWith('uz') ? o.nameUz : o.nameEn;

  const label = (o: { labelUz: string; labelRu: string; labelEn: string }) =>
    lang.startsWith('ru') ? o.labelRu : lang.startsWith('uz') ? o.labelUz : o.labelEn;

  // ── CSS Filter for fabric color tinting
  // We use a sepia + hue-rotate approach to colorize while keeping texture
  const getFabricFilter = (fabric: typeof fabrics[0]) => {
    return `sepia(1) saturate(${fabric.sat}%) hue-rotate(${fabric.hue}deg) brightness(${fabric.brightness})`;
  };

  // ── Add to cart
  const handleAddToCart = () => {
    const furnitureName = name(activeFurniture as any) || activeFurniture.labelEn;
    const fabricName = name(activeFabric);
    const woodName = name(activeWood);
    const finishName = name(activeFinish as any) || activeFinish.nameEn;
    const sizeName = label(activeSize);

    const customProduct = {
      id: `${activeFurniture.id}-${activeFabric.id}-${activeWood.id}-${activeFinish.id}-${activeSize.id}-${Date.now()}`,
      name: `${furnitureName} (${fabricName} / ${woodName} / ${finishName} / ${sizeName})`,
      price: totalPrice,
      image: activeFurniture.image,
      category: activeFurniture.id,
    };

    addToCart(customProduct);
    setAddedToCart(true);
    onAddedToCart?.(customProduct.name);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const sectionTitle = lang.startsWith('ru')
    ? 'Интерактивный'
    : lang.startsWith('uz')
    ? 'Interaktiv'
    : 'Interactive';

  const sectionTitleGold = lang.startsWith('ru')
    ? 'Конструктор'
    : lang.startsWith('uz')
    ? 'Konstruktor'
    : 'Customizer';

  return (
    <section className="py-16 border-t border-foreground/5 relative">
      {/* Section Header */}
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
            ? 'Выберите мебель, материал и отделку — конфигуратор немедленно покажет результат и рассчитает итоговую стоимость.'
            : lang.startsWith('uz')
            ? 'Mebel turini, material va qoplamani tanlang — konfigurator natijani darhol ko\'rsatadi va narxni hisoblaydi.'
            : 'Select furniture type, material & finish — the configurator shows the result instantly and calculates the exact price.'}
        </p>
      </div>

      {/* Furniture Type Tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8 justify-center flex-wrap">
        {furnitureTypes.map(ft => (
          <motion.button
            key={ft.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveFurniture(ft)}
            className={`px-5 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 border ${
              activeFurniture.id === ft.id
                ? 'bg-brand-gold text-black border-brand-gold shadow-lg shadow-brand-gold/20'
                : 'bg-foreground/5 text-foreground/60 border-foreground/10 hover:border-brand-gold/40 hover:text-foreground'
            }`}
          >
            {label(ft)}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        {/* ── LEFT: Live Visualizer ─────────────────────── */}
        <div className={`${isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-black p-6' : 'lg:col-span-7'} flex flex-col justify-between bento-card p-6 md:p-8 relative overflow-hidden`}>

          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <div>
              <span className="text-[9px] uppercase font-black tracking-widest text-brand-gold">
                {lang.startsWith('ru') ? 'Визуализация' : lang.startsWith('uz') ? 'Vizualizatsiya' : 'Live Preview'}
              </span>
              <h3 className="text-xl font-bold font-editorial-title text-foreground mt-0.5">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeFurniture.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="inline-block"
                  >
                    {label(activeFurniture)} — {name(activeFabric)}
                  </motion.span>
                </AnimatePresence>
              </h3>
            </div>
            <div className="flex gap-2 items-center">
              {/* 3D / 2D Toggle */}
              {webglSupported && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIs3DMode(v => !v)}
                  className={`h-9 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all duration-300 border text-[9px] font-black uppercase tracking-wider ${
                    is3DMode
                      ? 'bg-brand-gold text-black border-brand-gold shadow-lg shadow-brand-gold/25'
                      : 'bg-foreground/5 text-foreground/60 border-foreground/10 hover:border-brand-gold/30'
                  }`}
                  title="Toggle 3D View"
                >
                  <Zap className={`w-3.5 h-3.5 ${is3DMode ? 'fill-current text-black' : ''}`} />
                  {is3DMode ? '3D ON' : '3D OFF'}
                </motion.button>
              )}
              {/* Rotation toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleRotation}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border ${
                  isRotating
                    ? 'bg-brand-gold text-black border-brand-gold'
                    : 'bg-foreground/5 text-foreground/60 border-foreground/10 hover:border-brand-gold/30'
                }`}
                title="360° Rotation"
              >
                <RotateCcw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
              </motion.button>
              {/* Dimensions toggle */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDimensions(v => !v)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border ${
                  showDimensions
                    ? 'bg-brand-gold text-black border-brand-gold'
                    : 'bg-foreground/5 text-foreground/60 border-foreground/10 hover:border-brand-gold/30'
                }`}
                title="Show dimensions"
              >
                <Info className="w-4 h-4" />
              </motion.button>
              {/* Fullscreen */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsFullscreen(v => !v)}
                className="w-9 h-9 rounded-full bg-foreground/5 text-foreground/60 border border-foreground/10 hover:border-brand-gold/30 flex items-center justify-center transition-all duration-300"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </motion.button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="relative flex-grow rounded-2xl overflow-hidden bg-foreground/[0.03] border border-foreground/5 shadow-inner flex items-center justify-center min-h-[320px]">
            
            {/* Background ambient gradient matching fabric color */}
            {!is3DMode && (
              <div
                className="absolute inset-0 transition-all duration-1000 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 80%, ${activeFabric.hex}22 0%, transparent 70%)`,
                }}
              />
            )}

            {is3DMode ? (
              <FurnitureScene
                typeId={activeFurniture.id}
                fabricColor={activeFabric.hex}
                woodColor={activeWood.color}
                fabricTag={activeFabric.tag}
                finishId={activeFinish.id}
                sizeId={activeSize.id}
                isRotating={isRotating}
              />
            ) : (
              /* Furniture Image with animated CSS filter tinting */
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFurniture.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
                  className="relative w-full h-full flex items-center justify-center p-8"
                  style={{
                    transform: `rotateY(${Math.sin(rotationAngle * Math.PI / 180) * 18}deg) rotateX(${Math.cos(rotationAngle * Math.PI / 180) * 3}deg)`,
                    perspective: '1000px',
                    transition: isRotating ? 'none' : 'transform 0.6s ease',
                  }}
                >
                  {/* Base image */}
                  <img
                    ref={imgRef}
                    src={
                      activeFurniture.id === 'sofa'
                        ? activeFabric.id === 'velvet-emerald'
                          ? '/images/configurator/sofa_emerald.png'
                          : activeFabric.id === 'velvet-navy'
                          ? '/images/configurator/sofa_navy.png'
                          : activeFabric.id === 'leather-cognac'
                          ? '/images/configurator/sofa_cognac.png'
                          : activeFurniture.image
                        : activeFurniture.image
                    }
                    alt={label(activeFurniture)}
                    className="w-full h-full object-contain select-none pointer-events-none drop-shadow-2xl"
                    style={{ maxHeight: isFullscreen ? '70vh' : '300px' }}
                    onLoad={() => setImageLoaded(true)}
                    draggable={false}
                  />

                  {/* Color tinting overlay using CSS mix-blend-multiply */}
                  {!(
                    activeFurniture.id === 'sofa' &&
                    ['velvet-emerald', 'velvet-navy', 'leather-cognac'].includes(activeFabric.id)
                  ) && (
                    <AnimatePresence>
                      <motion.div
                        key={activeFabric.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: activeFabric.opacity }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7 }}
                        className="absolute inset-0 pointer-events-none rounded-2xl"
                        style={{
                          backgroundColor: activeFabric.hex,
                          mixBlendMode: 'multiply',
                        }}
                      />
                    </AnimatePresence>
                  )}

                  {/* Finish sheen overlay */}
                  {activeFinish.id === 'gloss' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%, rgba(255,255,255,0.08) 100%)',
                        mixBlendMode: 'screen',
                      }}
                    />
                  )}
                  {activeFinish.id === 'satin' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)',
                        mixBlendMode: 'screen',
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Dimensions badge */}
            <AnimatePresence>
              {showDimensions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-4 left-4 glass px-3 py-2 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-wider text-foreground/80"
                >
                  📐 {activeFurniture.dims}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Wood legs indicator */}
            <div className="absolute bottom-4 left-4 glass px-4 py-2 rounded-full border border-white/10 flex items-center gap-2.5 shadow-lg">
              <span className="text-[8px] uppercase font-black tracking-widest text-foreground/55">
                {lang.startsWith('ru') ? 'Дерево:' : lang.startsWith('uz') ? 'Yog\'och:' : 'Wood:'}
              </span>
              <span
                className="w-3 h-3 rounded-full border border-white/20 shadow-inner flex-shrink-0"
                style={{ background: activeWood.swatchGrad }}
              />
              <span className="text-[9px] font-black text-foreground uppercase tracking-widest">
                {name(activeWood).split(' ')[0]}
              </span>
            </div>

            {/* Rotating badge */}
            {isRotating && (
              <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full border border-brand-gold/30 text-[8px] font-black text-brand-gold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                360°
              </div>
            )}
          </div>

          {/* Configuration Summary */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-foreground/5">
            <div className="space-y-1 min-w-0">
              <div className="text-[8px] uppercase font-black tracking-widest text-foreground/40">
                {lang.startsWith('ru') ? 'Активная конфигурация' : lang.startsWith('uz') ? 'Faol konfiguratsiya' : 'Active Configuration'}
              </div>
              <div className="text-xs font-bold text-foreground truncate">
                <span className="text-brand-gold">{name(activeFabric)}</span>
                {' + '}
                <span>{name(activeWood)}</span>
                {' + '}
                <span className="text-foreground/60">{name(activeFinish as any) || activeFinish.nameEn}</span>
                {' · '}
                <span className="text-foreground/60">{label(activeSize)}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[8px] uppercase font-black tracking-widest text-foreground/40">
                {lang.startsWith('ru') ? 'Итоговая цена' : lang.startsWith('uz') ? 'Jami narx' : 'Total Price'}
              </div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={totalPrice}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="price-tag text-2xl font-bold block"
                >
                  {formatPrice(totalPrice)}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Fullscreen close overlay */}
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* ── RIGHT: Selector Panel ─────────────────────── */}
        <div className="lg:col-span-5 flex flex-col bento-card p-6 md:p-8 gap-6">

          {/* 1. Fabric Picker */}
          <div>
            <span className="text-[9px] uppercase font-black tracking-hero text-brand-gold block mb-3">
              1. {lang.startsWith('ru') ? 'Материал обивки' : lang.startsWith('uz') ? 'Qoplama material' : 'Upholstery'}
            </span>

            {/* Color swatches */}
            <div className="grid grid-cols-8 gap-1.5 mb-3">
              {fabrics.map(fabric => {
                const isActive = activeFabric.id === fabric.id;
                return (
                  <motion.button
                    key={fabric.id}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => setActiveFabric(fabric)}
                    className={`aspect-square rounded-full transition-all duration-300 relative flex items-center justify-center ${
                      isActive
                        ? 'ring-2 ring-brand-gold ring-offset-2 dark:ring-offset-black scale-110'
                        : 'hover:scale-105 hover:ring-1 hover:ring-brand-gold/40 ring-offset-1'
                    }`}
                    style={{ backgroundColor: fabric.hex }}
                    title={name(fabric)}
                  >
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-white rounded-full shadow-md"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Fabric detail card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFabric.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-foreground/[0.03] p-3.5 rounded-xl border border-foreground/5 flex items-start gap-3"
              >
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 shadow-inner border border-white/10"
                  style={{
                    backgroundColor: activeFabric.hex,
                    boxShadow: `0 2px 12px ${activeFabric.hex}55`,
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-black text-foreground truncate">{name(activeFabric)}</span>
                    <span
                      className="text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider text-white"
                      style={{ backgroundColor: activeFabric.tagColor }}
                    >
                      {activeFabric.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-foreground/45 italic leading-relaxed">
                    {lang.startsWith('ru') ? activeFabric.specRu : lang.startsWith('uz') ? activeFabric.specUz : activeFabric.specEn}
                  </p>
                  <span className="text-[9px] font-black text-brand-gold mt-1 block">
                    +{formatPrice(activeFabric.priceAdd)}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 2. Wood Picker */}
          <div>
            <span className="text-[9px] uppercase font-black tracking-hero text-brand-gold block mb-3">
              2. {lang.startsWith('ru') ? 'Материал каркаса' : lang.startsWith('uz') ? 'Ramka materiali' : 'Frame & Legs Wood'}
            </span>

            <div className="grid grid-cols-2 gap-2">
              {woods.map(wood => {
                const isActive = activeWood.id === wood.id;
                return (
                  <motion.button
                    key={wood.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveWood(wood)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 border text-left ${
                      isActive
                        ? 'border-brand-gold bg-brand-gold/5 shadow-sm'
                        : 'border-foreground/8 bg-foreground/[0.02] hover:border-brand-gold/30'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex-shrink-0 border border-white/10"
                      style={{ background: wood.swatchGrad, boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[9px] font-black text-foreground uppercase tracking-wide truncate">
                        {name(wood).split(' ')[0]}
                      </div>
                      <div className="text-[8px] text-foreground/45 truncate">
                        {lang.startsWith('ru') ? wood.originRu : lang.startsWith('uz') ? wood.originUz : wood.originEn}
                      </div>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-brand-gold flex-shrink-0" />}
                  </motion.button>
                );
              })}
            </div>

            {/* Wood detail */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWood.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 bg-foreground/[0.03] p-3 rounded-xl border border-foreground/5 flex justify-between text-[9px]"
              >
                <div>
                  <span className="text-foreground/40 uppercase tracking-wider block">
                    {lang.startsWith('ru') ? 'Класс' : lang.startsWith('uz') ? 'Sinf' : 'Grade'}
                  </span>
                  <strong className="text-foreground font-black">
                    {lang.startsWith('ru') ? activeWood.gradeRu : lang.startsWith('uz') ? activeWood.gradeUz : activeWood.gradeEn}
                  </strong>
                </div>
                <div className="text-right">
                  <span className="text-foreground/40 uppercase tracking-wider block">
                    {lang.startsWith('ru') ? 'Надбавка' : lang.startsWith('uz') ? 'Qo\'shimcha narx' : 'Price add'}
                  </span>
                  <strong className="text-brand-gold font-black">+{formatPrice(activeWood.priceAdd)}</strong>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 3. Finish Picker */}
          <div>
            <span className="text-[9px] uppercase font-black tracking-hero text-brand-gold block mb-3">
              3. {lang.startsWith('ru') ? 'Отделка поверхности' : lang.startsWith('uz') ? 'Sirt qoplama' : 'Surface Finish'}
            </span>
            <div className="flex gap-2">
              {finishes.map(finish => {
                const isActive = activeFinish.id === finish.id;
                return (
                  <motion.button
                    key={finish.id}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setActiveFinish(finish)}
                    className={`flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 flex flex-col items-center gap-1.5 border ${
                      isActive
                        ? 'bg-brand-gold text-black border-brand-gold shadow-lg shadow-brand-gold/15'
                        : 'bg-foreground/5 text-foreground/60 border-foreground/10 hover:border-brand-gold/30'
                    }`}
                  >
                    <span className="text-base leading-none">{finish.icon}</span>
                    <span>
                      {lang.startsWith('ru') ? finish.nameRu : lang.startsWith('uz') ? finish.nameUz : finish.nameEn}
                    </span>
                    {finish.priceAdd > 0 && (
                      <span className={`text-[7px] font-black ${isActive ? 'text-black/60' : 'text-brand-gold'}`}>
                        +{formatPrice(finish.priceAdd)}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* 4. Size Picker */}
          <div>
            <span className="text-[9px] uppercase font-black tracking-hero text-brand-gold block mb-3">
              4. {lang.startsWith('ru') ? 'Размер' : lang.startsWith('uz') ? 'O\'lcham' : 'Size'}
            </span>
            <div className="flex gap-2">
              {sizes.map(size => {
                const isActive = activeSize.id === size.id;
                return (
                  <motion.button
                    key={size.id}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setActiveSize(size)}
                    className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${
                      isActive
                        ? 'bg-foreground text-background border-foreground'
                        : 'bg-foreground/5 text-foreground/60 border-foreground/10 hover:border-brand-gold/30'
                    }`}
                  >
                    {size.id}
                    <span className="block text-[7px] mt-0.5 font-normal normal-case tracking-normal">
                      {label(size)}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-foreground/[0.03] rounded-xl p-4 border border-foreground/5 space-y-2">
            <div className="text-[8px] uppercase font-black tracking-widest text-foreground/40 mb-3">
              {lang.startsWith('ru') ? 'Детализация цены' : lang.startsWith('uz') ? 'Narx tafsiloti' : 'Price Breakdown'}
            </div>
            {[
              { label: lang.startsWith('ru') ? 'Базовая цена' : lang.startsWith('uz') ? 'Asosiy narx' : 'Base price', val: activeFurniture.basePrice },
              { label: lang.startsWith('ru') ? 'Обивка' : lang.startsWith('uz') ? 'Qoplama' : 'Upholstery', val: activeFabric.priceAdd },
              { label: lang.startsWith('ru') ? 'Дерево' : lang.startsWith('uz') ? 'Yog\'och' : 'Wood', val: activeWood.priceAdd },
              { label: lang.startsWith('ru') ? 'Отделка' : lang.startsWith('uz') ? 'Qoplam' : 'Finish', val: activeFinish.priceAdd },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-[9px]">
                <span className="text-foreground/55">{item.label}</span>
                <span className="font-black text-foreground">{formatPrice(item.val)}</span>
              </div>
            ))}
            {activeSize.multiplier > 1 && (
              <div className="flex justify-between text-[9px]">
                <span className="text-foreground/55">
                  {lang.startsWith('ru') ? 'Надбавка за размер' : lang.startsWith('uz') ? 'O\'lcham narxi' : 'Size premium'} (×{activeSize.multiplier})
                </span>
                <span className="font-black text-brand-gold">
                  +{formatPrice(Math.round((activeFurniture.basePrice + activeFabric.priceAdd + activeWood.priceAdd + activeFinish.priceAdd) * (activeSize.multiplier - 1)))}
                </span>
              </div>
            )}
            <div className="flex justify-between text-[10px] pt-2 border-t border-foreground/5">
              <span className="font-black uppercase tracking-wider">
                {lang.startsWith('ru') ? 'Итого' : lang.startsWith('uz') ? 'Jami' : 'Total'}
              </span>
              <span className="font-black text-brand-gold">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          {/* Add to Cart Button */}
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
                <motion.span
                  key="done"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {lang.startsWith('ru') ? 'Добавлено в корзину!' : lang.startsWith('uz') ? 'Savatga qo\'shildi!' : 'Added to Cart!'}
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {lang.startsWith('ru') ? 'Добавить в корзину' : lang.startsWith('uz') ? 'Savatga qo\'shish' : 'Add to Cart'}
                  {' · '}
                  {formatPrice(totalPrice)}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Express delivery note */}
          <div className="flex items-center gap-2 text-[8px] text-foreground/40 font-bold uppercase tracking-widest justify-center">
            <Zap className="w-3 h-3 text-brand-gold" />
            {lang.startsWith('ru')
              ? 'Производство 15–30 рабочих дней · Бесплатная доставка по Ташкенту'
              : lang.startsWith('uz')
              ? 'Ishlab chiqarish 15–30 ish kuni · Toshkent bo\'yicha bepul yetkazib berish'
              : 'Crafted in 15–30 working days · Free delivery in Tashkent'}
          </div>
        </div>
      </div>
    </section>
  );
};
