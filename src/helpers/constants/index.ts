import dynamic from 'next/dynamic';
import { TEMPLATE_REGISTRY } from '@/templates/designs/registry';
import { IThemeColor, ITemplate } from './index.interface';

export const SYSTEM_COLORS: IThemeColor[] = [
  {
    backgroundColor: 'white',
    fontColor: 'black',
    titleColor: '#1890ff',
    highlighterColor: 'yellowgreen',
    id: 1,
  },
  {
    backgroundColor: '#f3f5fe',
    fontColor: '#292b31',
    titleColor: '#5d5294',
    highlighterColor: '#796cbf',
    id: 5,
    name: 'Website light',
  },
  {
    backgroundColor: '#161826',
    fontColor: '#e9e9ed',
    titleColor: '#9184d9',
    highlighterColor: '#a7a1db',
    id: 6,
    name: 'Website dark',
  },
  {
    backgroundColor: '#ffffff',
    fontColor: '#243447',
    titleColor: '#164e63',
    highlighterColor: '#0e7490',
    id: 7,
    name: 'Ocean blue',
  },
  {
    backgroundColor: '#ffffff',
    fontColor: '#26352e',
    titleColor: '#22543d',
    highlighterColor: '#2f855a',
    id: 8,
    name: 'Forest green',
  },
  {
    backgroundColor: '#ffffff',
    fontColor: '#382b2d',
    titleColor: '#702f3b',
    highlighterColor: '#b65b66',
    id: 9,
    name: 'Burgundy',
  },
  {
    backgroundColor: '#ffffff',
    fontColor: '#2d3440',
    titleColor: '#293241',
    highlighterColor: '#d97706',
    id: 10,
    name: 'Charcoal and amber',
  },
  {
    backgroundColor: '#ffffff',
    fontColor: '#322b3d',
    titleColor: '#493267',
    highlighterColor: '#8055a6',
    id: 11,
    name: 'Plum',
  },
];

/** Built from `src/templates/designs/registry/templates.ts` — add templates there. */
export const AVAILABLE_TEMPLATES: ITemplate = Object.fromEntries(
  Object.entries(TEMPLATE_REGISTRY).map(([key, entry]) => [
    key,
    {
      id: entry.id,
      name: entry.name,
      thumbnail: entry.thumbnail,
      component: dynamic(entry.loadComponent, { ssr: false }),
    },
  ])
) as ITemplate;

export const CUSTOM_THEME_COLOR: IThemeColor = {
  backgroundColor: '#ffffff',
  fontColor: '#1f2937',
  titleColor: '#1e3a5f',
  highlighterColor: '#0f766e',
  id: 4,
};

export const DATE_PICKER_FORMAT = 'DD/MM/YYYY';
