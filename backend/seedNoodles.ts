// seedNoodles.ts - Task 1: Update seed data to include reviewsCount
import { Context, InstantNoodleOriginCountryType } from '.keystone/types';
import noodles from './noodles';
import { noodleImageUrls } from './noodleImageUrls';

export async function seedNoodleData(context: Context) {
  // ⛔️ Early exit if there's at least one InstantNoodle
  const existing = await context.db.InstantNoodle.findMany({ take: 1 });
  if (existing.length > 0) {
    console.log('Seeding skipped: InstantNoodle records already exist.');
    return;
  }

  for (let i = 0; i < noodles.length; i++) {
    const item = noodles[i];

    let category = await context.db.Category.findOne({
      where: { name: item.category },
    });

    if (!category) {
      category = await context.db.Category.createOne({
        data: { name: item.category },
      });
    }

    await context.db.InstantNoodle.createOne({
      data: {
        name: `${item.brand} ${item.category} #${i + 1}`,
        brand: item.brand,
        spicinessLevel: item.spicinessLevel,
        originCountry: item.originCountry as InstantNoodleOriginCountryType,
        rating: item.rating,
        reviewsCount: 0, // 🆕 TASK 1: Initialize reviewsCount to 0
        imageURL: noodleImageUrls[i],
        category: { connect: { id: category.id } },
      },
    });
  }

  console.log('Noodle data seeded successfully.');
}
