// schema.ts - Task 3: Add lastReviewedAt field + hooks for reviewsCount
import { graphql, list } from '@keystone-6/core';
import {
  text,
  integer,
  select,
  relationship,
  timestamp,
  virtual,
} from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const lists = {
  InstantNoodle: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
      }),
      brand: text({
        validation: { isRequired: true },
      }),
      spicinessLevel: integer({
        validation: {
          isRequired: true,
          min: 1,
          max: 5,
        },
        defaultValue: 3,
        ui: { description: 'Scale of 1 (mild) to 5 (🔥)' },
      }),
      spicinessDescription: virtual({
        field: graphql.field({
          type: graphql.String,
          resolve(item: any) {
            if (item.spicinessLevel <= 2) {
              return 'Mild';
            } else if (item.spicinessLevel <= 4) {
              return 'Medium';
            } else {
              return 'Hot';
            }
          },
        }),
      }),
      originCountry: select({
        type: 'enum',
        options: [
          { label: 'South Korea', value: 'south_korea' },
          { label: 'Indonesia', value: 'indonesia' },
          { label: 'Malaysia', value: 'malaysia' },
          { label: 'Thailand', value: 'thailand' },
          { label: 'Japan', value: 'japan' },
          { label: 'Singapore', value: 'singapore' },
          { label: 'Vietnam', value: 'vietnam' },
          { label: 'China', value: 'china' },
          { label: 'Taiwan', value: 'taiwan' },
          { label: 'Philippines', value: 'philippines' },
        ],
        validation: { isRequired: true },
      }),
      rating: integer({
        validation: {
          isRequired: true,
          min: 1,
          max: 10,
        },
        defaultValue: 5,
        ui: { description: 'Your personal rating (1–10)' },
      }),
      reviewsCount: integer({
        validation: {
          isRequired: true,
          min: 0,
        },
        defaultValue: 0,
        ui: { description: 'Number of reviews for this noodle' },
      }),
      imageURL: text({
        validation: { isRequired: false },
        ui: { description: 'URL to the noodle image' },
      }),
      category: relationship({
        ref: 'Category.noodles',
        many: false,
        ui: { displayMode: 'select' },
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
    // 🆕 TASK 3: Add hooks for reviewsCount field
    hooks: {
      // Hook to prevent decreasing reviewsCount
      validateInput: async ({ resolvedData, item, addValidationError }) => {
        // Only check if reviewsCount is being updated and item exists (update operation)
        if (resolvedData.reviewsCount !== undefined && item) {
          const currentReviewsCount = item.reviewsCount || 0;
          const newReviewsCount = resolvedData.reviewsCount;
          
          // Prevent decreasing reviewsCount
          if (newReviewsCount < currentReviewsCount) {
            addValidationError(
              'reviewsCount cannot be decreased. Current value: ' + 
              currentReviewsCount + ', attempted value: ' + newReviewsCount
            );
          }
        }
      },
      // Hook to update lastReviewedAt when reviewsCount increases
      resolveInput: async ({ resolvedData, item }) => {
        // Update lastReviewedAt when reviewsCount increases
        if (resolvedData.reviewsCount !== undefined && item) {
          const currentReviewsCount = item.reviewsCount || 0;
          const newReviewsCount = resolvedData.reviewsCount;
          
          // If reviewsCount is increasing, update lastReviewedAt
          if (newReviewsCount > currentReviewsCount) {
            resolvedData.lastReviewedAt = new Date();
          }
        }
        
        return resolvedData;
      },
    },
    // End of Task 3 hooks addition
  }),
  Category: list({
    access: allowAll,
    fields: {
      name: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),
      noodles: relationship({ ref: 'InstantNoodle.category', many: true }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),
};