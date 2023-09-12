import {
  MappingTypeMapping,
  IndicesIndexSettings,
} from '@elastic/elasticsearch/lib/api/types';

export const settings: IndicesIndexSettings = {
  analysis: {
    filter: {
      autocomplete_filter: {
        type: 'edge_ngram',
        // Example: "banhTheCake" => ["ba", "ban", "banh", ..., "banhTheC"] (1 => 8)
        min_gram: 2,
        max_gram: 8,
      },
    },
    analyzer: {
      autocomplete: {
        type: 'custom',
        tokenizer: 'standard',
        filter: ['lowercase', 'autocomplete_filter'],
      },
      startWith: {
        type: 'custom',
        tokenizer: 'keyword',
        filter: ['lowercase', 'asciifolding'],
        // asciifolding: make all characters ascii case-insensitive
        // example "Quần áo" => Quan ao
      },
      whitespace_lowercase: {
        type: 'custom',
        tokenizer: 'standard',
        filter: ['lowercase', 'asciifolding'],
      },
    },
  },
};

export const mappings: MappingTypeMapping = {
  properties: {
    categories: {
      type: 'nested',
      properties: {
        created_at: {
          type: 'date',
        },
        id: {
          type: 'keyword',
        },
        label: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        slug: {
          type: 'keyword',
        },
        updated_at: {
          type: 'date',
        },
      },
    },
    created_at: {
      type: 'date',
    },
    description: {
      type: 'keyword',
    },
    id: {
      type: 'keyword',
    },
    images: {
      enabled: false,
    },
    label: {
      type: 'text',
      fields: {
        keyword: {
          type: 'keyword',
          ignore_above: 256,
        },
        autocomplete: {
          type: 'text',
          analyzer: 'autocomplete',
        },
        startWith: {
          type: 'text',
          analyzer: 'startWith',
        },
        normalize: {
          type: 'text',
          analyzer: 'whitespace_lowercase',
        },
      },
    },
    ownerId: {
      type: 'keyword',
    },
    price: {
      type: 'long',
    },
    quantity: {
      type: 'long',
    },
    slug: {
      type: 'keyword',
    },
    star: {
      type: 'long',
    },
    updated_at: {
      type: 'date',
    },
  },
};
