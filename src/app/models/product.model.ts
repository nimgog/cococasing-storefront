export interface Product {
  id: string;
  availableForSale: boolean;
  createdAt: string;
  updatedAt: string;
  descriptionHtml: string;
  description: string;
  handle: string;
  productType: string;
  title: string;
  vendor: string;
  publishedAt: string;
  onlineStoreUrl: string;
  options: Option[];
  images: any[];
  variants: Variant[];
}

export interface Option {
  id: string;
  name: string;
  values: Value[];
}

export interface Value {
  value: string;
  type: string;
}

export interface Variant {
  id: string;
  title: string;
  price: Price;
  weight: number;
  available: boolean;
  sku: string;
  compareAtPrice: Price;
  image: any;
  selectedOptions: SelectedOption[];
  unitPrice: any;
  unitPriceMeasurement: UnitPriceMeasurement;
  hasNextPage: any;
  hasPreviousPage: any;
  variableValues: VariableValues;
}

export interface Price {
  amount: string;
  currencyCode: string;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface UnitPriceMeasurement {
  measuredType: any;
  quantityUnit: any;
  quantityValue: number;
  referenceUnit: any;
  referenceValue: number;
}

export interface VariableValues {
  id: string;
}

/* The Package Constants */

export const model: { [key: string]: string } = {
  mini: 'Mini',
  plus: 'Plus',
  pro: 'Pro',
  proMax: 'Pro Max',
  regular: 'Regular',
};

export const colors: { [key: string]: string } = {
  Black: 'Jet black',
  Green: 'Forest green',
  Orange: 'Sunset orange',
  Blue: 'Midnight blue',
  Beige: 'Desert beige',
  Lavender: 'French lavender',
};

export const options: {
  [key: string]: {
    colors: { [key: string]: string };
    model: { [key: string]: string };
  };
} = {
  '14': {
    colors: colors,
    model: {
      Plus: 'Plus',
      Pro: 'Pro',
      'Pro Max': 'Pro Max',
      Regular: 'Regular',
    },
  },
  '13': {
    colors: {
      Orange: 'Sunset orange',
      Beige: 'Desert beige',
      Lavender: 'French lavender',
    },
    model: {
      Mini: 'Mini',
      Pro: 'Pro',
      'Pro Max': 'Pro Max',
      Regular: 'Regular',
    },
  },
  '12': {
    colors: {
      Orange: 'Sunset orange',
      Lavender: 'French lavender',
    },
    model: {
      Mini: 'Mini',
      Pro: 'Pro',
      'Pro Max': 'Pro Max',
      Regular: 'Regular',
    },
  },
  '11': {
    colors: {
      Orange: 'Sunset orange',
      Lavender: 'French lavender',
    },
    model: {
      Pro: 'Pro',
      'Pro Max': 'Pro Max',
      Regular: 'Regular',
    },
  },
};
