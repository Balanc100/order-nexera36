import { Product } from './types';

// Product data based on provided requirements
export const INITIAL_PRODUCTS: Product[] = [
  // Brand: Aoldi
  { id: 'aoldi-1', name: 'Moongry Odor Spray', brand: 'Aoldi', price: 129, stock: 100, category: 'Household', imageUrl: 'https://placehold.co/200x200/e2e8f0/1e293b?text=Aoldi', shippingCost: 20 },
  
  // Brand: Api
  { id: 'api-1', name: 'MCT oil powder', brand: 'Api', price: 120, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=MCT', shippingCost: 18 },
  { id: 'api-2', name: 'Tomato extract powder', brand: 'Api', price: 325, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=Tomato', shippingCost: 20 },
  { id: 'api-3', name: 'Acai extract powder', brand: 'Api', price: 200, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=Acai', shippingCost: 20 },
  { id: 'api-4', name: 'Pomegranate extract powder', brand: 'Api', price: 250, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=Pomegranate', shippingCost: 20 },
  { id: 'api-5', name: 'Spirulina extract powder', brand: 'Api', price: 160, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=Spirulina', shippingCost: 25 },
  { id: 'api-6', name: 'Luo han guo extract powder', brand: 'Api', price: 250, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=LuoHanGuo', shippingCost: 20 },
  { id: 'api-7', name: 'Goji berry extract powder', brand: 'Api', price: 250, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=Goji', shippingCost: 20 },
  { id: 'api-8', name: 'Maqui berry extract powder', brand: 'Api', price: 180, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=Maqui', shippingCost: 20 },
  { id: 'api-9', name: 'Broccoli extract powder', brand: 'Api', price: 320, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=Broccoli', shippingCost: 20 },
  { id: 'api-10', name: 'Roselle extract powder', brand: 'Api', price: 320, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=Roselle', shippingCost: 20 },
  { id: 'api-11', name: 'Emblic extract powder', brand: 'Api', price: 325, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=Emblic', shippingCost: 25 },
  { id: 'api-12', name: 'Ginger extract powder', brand: 'Api', price: 250, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=Ginger', shippingCost: 25 },
  { id: 'api-13', name: 'Turmeric extract powder', brand: 'Api', price: 325, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=Turmeric', shippingCost: 20 },
  { id: 'api-14', name: 'Black galingale extract powder', brand: 'Api', price: 380, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff1f2/be123c?text=BlackGalingale', shippingCost: 20 },

  // Brand: Epcera
  { id: 'epcera-1', name: 'Collagen type II', brand: 'Epcera', price: 650, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/f0f9ff/0369a1?text=Collagen', shippingCost: 20 },
  { id: 'epcera-2', name: 'Anti Acne Gel', brand: 'Epcera', price: 169, stock: 100, category: 'Skincare', imageUrl: 'https://placehold.co/200x200/f0f9ff/0369a1?text=AcneGel', shippingCost: 10 },
  { id: 'epcera-3', name: 'Scar Gel', brand: 'Epcera', price: 169, stock: 100, category: 'Skincare', imageUrl: 'https://placehold.co/200x200/f0f9ff/0369a1?text=ScarGel', shippingCost: 10 },

  // Brand: Madam
  { id: 'madam-1', name: 'Nine herb green balm', brand: 'Madam', price: 189, stock: 100, category: 'Balm', imageUrl: 'https://placehold.co/200x200/f0fdf4/15803d?text=GreenBalm', shippingCost: 10 },
  { id: 'madam-2', name: 'Massage oil no.7', brand: 'Madam', price: 299, stock: 100, category: 'Oil', imageUrl: 'https://placehold.co/200x200/f0fdf4/15803d?text=MassageOil', shippingCost: 15 },

  // Brand: Muve
  { id: 'muve-1', name: 'Musz cream', brand: 'Muve', price: 390, stock: 100, category: 'Cream', imageUrl: 'https://placehold.co/200x200/faf5ff/7e22ce?text=MuszCream', shippingCost: 20 },
  { id: 'muve-2', name: 'Spray', brand: 'Muve', price: 390, stock: 100, category: 'Spray', imageUrl: 'https://placehold.co/200x200/faf5ff/7e22ce?text=Spray', shippingCost: 20 },
  { id: 'muve-3', name: 'Ativ Body Spray', brand: 'Muve', price: 169, stock: 100, category: 'Spray', imageUrl: 'https://placehold.co/200x200/faf5ff/7e22ce?text=BodySpray', shippingCost: 20 },
  { id: 'muve-4', name: 'Ativ Sunscreen SPF50+ PA++++', brand: 'Muve', price: 769, stock: 100, category: 'Skincare', imageUrl: 'https://placehold.co/200x200/faf5ff/7e22ce?text=Sunscreen', shippingCost: 15 },
  { id: 'muve-5', name: 'Ativ Hair Wash', brand: 'Muve', price: 219, stock: 100, category: 'Haircare', imageUrl: 'https://placehold.co/200x200/faf5ff/7e22ce?text=HairWash', shippingCost: 20 },
  { id: 'muve-6', name: 'Ativ Body Wash', brand: 'Muve', price: 199, stock: 100, category: 'Bodycare', imageUrl: 'https://placehold.co/200x200/faf5ff/7e22ce?text=BodyWash', shippingCost: 20 },
  { id: 'muve-7', name: 'Creatinex', brand: 'Muve', price: 550, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/faf5ff/7e22ce?text=Creatinex', shippingCost: 15 },
  { id: 'muve-8', name: 'Pformax', brand: 'Muve', price: 550, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/faf5ff/7e22ce?text=Pformax', shippingCost: 15 },
  { id: 'muve-9', name: 'Curlagen T2', brand: 'Muve', price: 590, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/faf5ff/7e22ce?text=Curlagen', shippingCost: 15 },
  { id: 'muve-10', name: 'BONEX', brand: 'Muve', price: 590, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/faf5ff/7e22ce?text=BONEX', shippingCost: 15 },
  { id: 'muve-11', name: 'Ultimate Protein+', brand: 'Muve', price: 1490, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/faf5ff/7e22ce?text=Protein+', shippingCost: 40 },
  { id: 'muve-12', name: 'Enagel', brand: 'Muve', price: 90, stock: 100, category: 'Energy', imageUrl: 'https://placehold.co/200x200/faf5ff/7e22ce?text=Enagel', shippingCost: 15 },

  // Brand: Profitt
  { id: 'profitt-1', name: 'C-DEF (Cancer defense)', brand: 'Profitt', price: 690, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff7ed/c2410c?text=C-DEF', shippingCost: 15 },
  { id: 'profitt-2', name: 'Car-D (Cardio flow)', brand: 'Profitt', price: 590, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff7ed/c2410c?text=Car-D', shippingCost: 15 },
  { id: 'profitt-3', name: 'Nuxe (Neuroshield)', brand: 'Profitt', price: 650, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff7ed/c2410c?text=Nuxe', shippingCost: 15 },
  { id: 'profitt-4', name: 'Gluco B (Gluco balance)', brand: 'Profitt', price: 590, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff7ed/c2410c?text=GlucoB', shippingCost: 15 },
  { id: 'profitt-5', name: 'Prezz G (Pressure Guard)', brand: 'Profitt', price: 619, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff7ed/c2410c?text=PrezzG', shippingCost: 15 },
  { id: 'profitt-6', name: 'Renex (Renal care)', brand: 'Profitt', price: 590, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff7ed/c2410c?text=Renex', shippingCost: 15 },
  { id: 'profitt-7', name: 'Livoxa (Hepa defense)', brand: 'Profitt', price: 650, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff7ed/c2410c?text=Livoxa', shippingCost: 15 },
  { id: 'profitt-8', name: 'Lugivist (Lung vital)', brand: 'Profitt', price: 590, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff7ed/c2410c?text=Lugivist', shippingCost: 15 },
  { id: 'profitt-9', name: 'Bacovia (Neuropro)', brand: 'Profitt', price: 590, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff7ed/c2410c?text=Bacovia', shippingCost: 15 },
  { id: 'profitt-10', name: 'Camorex (Mind care)', brand: 'Profitt', price: 590, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/fff7ed/c2410c?text=Camorex', shippingCost: 15 },

  // Brand: Genbio
  { id: 'genbio-1', name: 'Synbac 9', brand: 'Genbio', price: 690, stock: 100, category: 'Supplement', imageUrl: 'https://placehold.co/200x200/eff6ff/1d4ed8?text=Synbac9', shippingCost: 20 },
];