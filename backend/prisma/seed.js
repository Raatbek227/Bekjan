import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const roles = [
  ["USER", "Customer account"],
  ["MANAGER", "Operations manager"],
  ["ADMIN", "CRM administrator"],
  ["SUPER_ADMIN", "Platform owner"]
];

const serviceCategories = [
  {
    name: "Auto Detailing",
    slug: "auto-detailing",
    description: "Interior, exterior, and full detailing packages.",
    services: [
      ["Interior Detailing", "interior-detailing", 240, 120],
      ["Exterior Detailing", "exterior-detailing", 300, 160],
      ["Full Detailing", "full-detailing", 480, 260]
    ]
  },
  {
    name: "Paint Correction",
    slug: "paint-correction",
    description: "Paint correction stages for gloss recovery.",
    services: [
      ["Stage 1 Paint Correction", "stage-1-paint-correction", 300, 220],
      ["Stage 2 Paint Correction", "stage-2-paint-correction", 540, 390],
      ["Stage 3 Paint Correction", "stage-3-paint-correction", 840, 690]
    ]
  },
  {
    name: "Ceramic Coating",
    slug: "ceramic-coating",
    description: "Hydrophobic ceramic protection systems.",
    services: [
      ["Basic Ceramic Coating", "basic-ceramic-coating", 360, 280],
      ["Professional Ceramic Coating", "professional-ceramic-coating", 600, 520],
      ["Premium Ceramic Coating", "premium-ceramic-coating", 960, 900]
    ]
  },
  {
    name: "Paint Protection Film",
    slug: "paint-protection-film",
    description: "PPF packages for high-impact vehicle zones.",
    services: [
      ["Partial PPF", "partial-ppf", 480, 450],
      ["Front Package PPF", "front-package-ppf", 960, 1200],
      ["Full Body PPF", "full-body-ppf", 2400, 4200]
    ]
  },
  {
    name: "Window Tinting",
    slug: "window-tinting",
    description: "Standard, premium, and nano ceramic tint films.",
    services: [
      ["Standard Window Tinting", "standard-window-tinting", 120, 90],
      ["Premium Window Tinting", "premium-window-tinting", 180, 160],
      ["Nano Ceramic Tinting", "nano-ceramic-tinting", 240, 260]
    ]
  },
  {
    name: "Car Painting",
    slug: "car-painting",
    description: "Full and local painting services.",
    services: [
      ["Full Car Painting", "full-car-painting", 4200, 2500],
      ["Local Painting", "local-painting", 960, 420],
      ["Bumper Painting", "bumper-painting", 480, 260],
      ["Rim Painting", "rim-painting", 360, 180]
    ]
  }
];

const productCategories = [
  {
    name: "Car Paint",
    slug: "car-paint",
    products: [
      ["Crystal Black Basecoat", "crystal-black-basecoat", "PNT-BLK-001", 89, 35],
      ["Pearl White Refinish Kit", "pearl-white-refinish-kit", "PNT-WHT-002", 129, 20]
    ]
  },
  {
    name: "Auto Chemicals",
    slug: "auto-chemicals",
    products: [
      ["Graphene Detail Spray", "graphene-detail-spray", "CHM-GRA-001", 29, 120],
      ["pH Neutral Snow Foam", "ph-neutral-snow-foam", "CHM-FOAM-002", 22, 150]
    ]
  },
  {
    name: "Ceramic Coatings",
    slug: "ceramic-coatings",
    products: [
      ["Ceramic Pro Shield", "ceramic-pro-shield", "CER-PRO-001", 149, 48],
      ["Glass Ceramic Coat", "glass-ceramic-coat", "CER-GLS-002", 55, 60]
    ]
  },
  {
    name: "Polishing Materials",
    slug: "polishing-materials",
    products: [
      ["Precision Polishing Kit", "precision-polishing-kit", "POL-KIT-001", 89, 40],
      ["Heavy Cut Compound", "heavy-cut-compound", "POL-HVY-002", 34, 70]
    ]
  },
  {
    name: "Detailing Tools",
    slug: "detailing-tools",
    products: [
      ["PPF Edge Squeegee", "ppf-edge-squeegee", "TLS-PPF-001", 18, 200],
      ["Microfiber Pro Pack", "microfiber-pro-pack", "TLS-MIC-002", 26, 180]
    ]
  }
];

async function main() {
  for (const [name, description] of roles) {
    await prisma.role.upsert({
      where: { name },
      update: { description },
      create: { name, description }
    });
  }

  const adminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });
  const passwordHash = await bcrypt.hash("Admin12345", 12);

  await prisma.user.upsert({
    where: { email: "admin@premiumcarcare.local" },
    update: { roleId: adminRole.id, status: "ACTIVE" },
    create: {
      email: "admin@premiumcarcare.local",
      name: "Premium Admin",
      passwordHash,
      status: "ACTIVE",
      emailVerifiedAt: new Date(),
      roleId: adminRole.id
    }
  });

  for (const category of serviceCategories) {
    const savedCategory = await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description
      }
    });

    for (const [name, slug, durationMin, priceFrom] of category.services) {
      await prisma.service.upsert({
        where: { slug },
        update: {
          name,
          durationMin,
          priceFrom,
          categoryId: savedCategory.id
        },
        create: {
          name,
          slug,
          description: `${name} with professional workflow, inspection, preparation, execution, and final quality check.`,
          benefits: ["Premium finish", "Professional materials", "Documented process", "Warranty-ready handover"],
          durationMin,
          priceFrom,
          categoryId: savedCategory.id
        }
      });
    }
  }

  for (const category of productCategories) {
    const savedCategory = await prisma.productCategory.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: {
        name: category.name,
        slug: category.slug,
        description: `${category.name} for premium automotive care.`
      }
    });

    for (const [name, slug, sku, price, stock] of category.products) {
      const product = await prisma.product.upsert({
        where: { slug },
        update: {
          name,
          sku,
          price,
          stock,
          categoryId: savedCategory.id
        },
        create: {
          name,
          slug,
          sku,
          description: `${name} selected for professional detailing and car care workflows.`,
          specs: {
            grade: "Professional",
            warranty: "Manufacturer warranty",
            origin: "Premium supplier"
          },
          price,
          stock,
          isFeatured: true,
          categoryId: savedCategory.id
        }
      });

      await prisma.productImage.upsert({
        where: {
          id: `${product.id}-primary`
        },
        update: {
          url: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9",
          alt: name
        },
        create: {
          id: `${product.id}-primary`,
          productId: product.id,
          url: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9",
          alt: name,
          position: 0
        }
      });
    }
  }

  const detailing = await prisma.service.findFirst({ where: { slug: "full-detailing" } });
  const ceramic = await prisma.service.findFirst({ where: { slug: "professional-ceramic-coating" } });
  const ppf = await prisma.service.findFirst({ where: { slug: "front-package-ppf" } });
  const paint = await prisma.service.findFirst({ where: { slug: "bumper-painting" } });
  const seededServices = [detailing, ceramic, ppf, paint].filter(Boolean);

  const staffMembers = [
    {
      name: "Aidar Premium Detailer",
      email: "aidar@premiumcarcare.local",
      roleTitle: "Senior Detailer",
      services: [detailing?.id, ceramic?.id].filter(Boolean)
    },
    {
      name: "Maksat Film Specialist",
      email: "maksat@premiumcarcare.local",
      roleTitle: "PPF Specialist",
      services: [ppf?.id, ceramic?.id].filter(Boolean)
    },
    {
      name: "Elina Paint Master",
      email: "elina@premiumcarcare.local",
      roleTitle: "Paint Technician",
      services: [paint?.id].filter(Boolean)
    }
  ];

  for (const member of staffMembers) {
    const staff = await prisma.staffMember.upsert({
      where: { email: member.email },
      update: {
        name: member.name,
        roleTitle: member.roleTitle,
        isActive: true
      },
      create: {
        name: member.name,
        email: member.email,
        roleTitle: member.roleTitle,
        isActive: true
      }
    });

    for (const serviceId of member.services) {
      await prisma.staffServiceAssignment.upsert({
        where: {
          staffId_serviceId: {
            staffId: staff.id,
            serviceId
          }
        },
        update: {},
        create: {
          staffId: staff.id,
          serviceId
        }
      });
    }

    for (const dayOfWeek of [1, 2, 3, 4, 5, 6]) {
      await prisma.workingHour.upsert({
        where: {
          staffId_dayOfWeek: {
            staffId: staff.id,
            dayOfWeek
          }
        },
        update: {
          opensAt: "09:00",
          closesAt: dayOfWeek === 6 ? "15:00" : "18:00",
          isClosed: false
        },
        create: {
          staffId: staff.id,
          dayOfWeek,
          opensAt: "09:00",
          closesAt: dayOfWeek === 6 ? "15:00" : "18:00"
        }
      });
    }
  }

  const firstStaff = await prisma.staffMember.findFirst({ where: { email: "aidar@premiumcarcare.local" } });
  if (firstStaff && seededServices.length) {
    for (let offset = 1; offset <= 7; offset += 1) {
      const day = new Date();
      day.setUTCDate(day.getUTCDate() + offset);
      day.setUTCHours(0, 0, 0, 0);

      for (const hour of [9, 12, 15]) {
        const startsAt = new Date(day);
        startsAt.setUTCHours(hour, 0, 0, 0);
        const endsAt = new Date(startsAt);
        endsAt.setUTCHours(hour + 2, 0, 0, 0);
        const service = seededServices[(offset + hour) % seededServices.length];

        await prisma.bookingSlot.upsert({
          where: {
            id: `seed-slot-${offset}-${hour}`
          },
          update: {
            serviceId: service.id,
            staffId: firstStaff.id,
            startsAt,
            endsAt,
            capacity: 1,
            isBlocked: false
          },
          create: {
            id: `seed-slot-${offset}-${hour}`,
            serviceId: service.id,
            staffId: firstStaff.id,
            startsAt,
            endsAt,
            capacity: 1
          }
        });
      }
    }
  }

  // Seed blog categories and sample posts
  const blogCategory = await prisma.blogCategory.upsert({
    where: { slug: "detailing" },
    update: { name: "Detailing", slug: "detailing" },
    create: { name: "Detailing", slug: "detailing", description: "Detailing, coatings and protection articles." }
  });

  const posts = [
    {
      title: "Ceramic coatings: what to expect",
      slug: "ceramic-coatings-what-to-expect",
      excerpt: "Understand the benefits and longevity of modern ceramic coatings.",
      content:
        "Ceramic coatings provide durable hydrophobic protection when applied correctly.\n\nThis article covers surface prep, application steps, and aftercare to maximise longevity.",
      coverImage: "https://images.unsplash.com/photo-1542362567-b07e54358753",
      isPublished: true
    },
    {
      title: "Paint protection film vs ceramic coating",
      slug: "ppf-vs-ceramic-coating",
      excerpt: "When to choose PPF over ceramic coating and vice versa.",
      content:
        "PPF offers mechanical protection while ceramic coatings improve chemical resistance and gloss.\n\nWe explore use-cases and hybrid approaches.",
      coverImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      isPublished: true
    }
  ];

  for (const p of posts) {
    await prisma.blog.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage,
        isPublished: p.isPublished,
        publishedAt: new Date(),
        categoryId: blogCategory.id
      },
      create: {
        title: p.title,
        slug: p.slug,
        excerpt: p.excerpt,
        content: p.content,
        coverImage: p.coverImage,
        isPublished: p.isPublished,
        publishedAt: new Date(),
        categoryId: blogCategory.id
      }
    });
  }

  // Seed gallery items
  const galleryItems = [
    {
      title: "Full detail - before",
      type: "before-after",
      category: "detail",
      beforeUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c",
      afterUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      mediaUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
      description: "Full detail transformation"
    },
    {
      title: "Ceramic coating result",
      type: "photo",
      category: "coating",
      mediaUrl: "https://images.unsplash.com/photo-1542362567-b07e54358753",
      description: "Hydrophobic ceramic finish"
    }
  ];

  for (const item of galleryItems) {
    await prisma.gallery.upsert({
      where: { mediaUrl: item.mediaUrl },
      update: {
        title: item.title,
        type: item.type,
        category: item.category,
        beforeUrl: item.beforeUrl || null,
        afterUrl: item.afterUrl || null,
        mediaUrl: item.mediaUrl,
        description: item.description
      },
      create: {
        title: item.title,
        type: item.type,
        category: item.category,
        beforeUrl: item.beforeUrl || null,
        afterUrl: item.afterUrl || null,
        mediaUrl: item.mediaUrl,
        description: item.description
      }
    });
  }

  await prisma.coupon.upsert({
    where: { code: "PREMIUM10" },
    update: {
      description: "10 percent launch discount",
      discountType: "PERCENT",
      discountValue: 10,
      usageLimit: 500,
      isActive: true
    },
    create: {
      code: "PREMIUM10",
      description: "10 percent launch discount",
      discountType: "PERCENT",
      discountValue: 10,
      usageLimit: 500,
      isActive: true
    }
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
