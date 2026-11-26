import type { Category } from '@/data/types';

import type { IconName } from '@/components/icon';

type CategoryStyle = {
  icon: IconName;
  /** Short label that fits under a grid tile. */
  short: string;
  color: string;
  /** Pastel tile background in light mode; dark mode uses `color` at low opacity. */
  soft: string;
};

export const CATEGORY_STYLE: Record<Category, CategoryStyle> = {
  'Lab gear': { icon: { ios: 'flask', md: 'science' }, short: 'Lab Gear', color: '#0D9488', soft: '#E3F8F5' },
  Calculators: { icon: { ios: 'plus.forwardslash.minus', md: 'calculate' }, short: 'Calculators', color: '#16A34A', soft: '#E6F7EC' },
  'Cameras & lighting': { icon: { ios: 'camera', md: 'photo_camera' }, short: 'Cameras', color: '#0284C7', soft: '#E3F2FC' },
  Audio: { icon: { ios: 'headphones', md: 'headphones' }, short: 'Audio', color: '#7C3AED', soft: '#F0E9FE' },
  Costumes: { icon: { ios: 'tshirt', md: 'checkroom' }, short: 'Costumes', color: '#E11D48', soft: '#FDE8ED' },
  Kitchenware: { icon: { ios: 'fork.knife', md: 'skillet' }, short: 'Kitchen', color: '#EA580C', soft: '#FEEFE4' },
  Electronics: { icon: { ios: 'laptopcomputer', md: 'devices' }, short: 'Electronics', color: '#4F46E5', soft: '#ECEBFE' },
  Tools: { icon: { ios: 'wrench.and.screwdriver', md: 'handyman' }, short: 'Tools', color: '#CA8A04', soft: '#FDF5DA' },
};
