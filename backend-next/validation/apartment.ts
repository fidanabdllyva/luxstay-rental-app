import { z } from "zod";

const ApartmentTypeEnum = z.enum([
  "ISLAND", "APARTMENT", "VINTAGE", "VILLA", "PENTHOUSE", "GARDEN", "POOL",
]);

const FeatureEnum = z.enum([
  "WIFI", "AC", "HEATING", "KITCHEN", "PARKING", "POOL", "PET_FRIENDLY",
  "WASHER", "DRYER", "GYM", "ELEVATOR", "BALCONY", "HOT_TUB",
  "BREAKFAST_INCLUDED", "TV", "SMOKE_DETECTOR", "FIRE_EXTINGUISHER",
  "FURNISHED", "WHEELCHAIR_ACCESSIBLE", "BABY_COT",
]);

const RuleEnum = z.enum([
  "NO_SMOKING", "NO_PETS", "NO_PARTIES", "QUIET_HOURS", "CHECK_IN_AFTER_3PM",
  "CHECK_OUT_BEFORE_11AM", "NO_UNREGISTERED_GUESTS", "CLEAN_UP_AFTER_YOURSELF",
  "NO_ILLEGAL_ACTIVITIES", "RESPECT_NEIGHBORS",
]);

export const ApartmentSchema = z.object({
  title: z.string().min(3),
  type: ApartmentTypeEnum,
  location: z.string().min(2),
  pricePerNight: z.number().positive(),
  coverImage: z.string().url(),
  images: z.array(z.string().url()).min(1),
  description: z.string().min(10),
  features: z.array(FeatureEnum),
  rules: z.array(RuleEnum),
  entrepreneurId: z.string().uuid(),
});

export const apartmentUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  type: ApartmentTypeEnum.optional(),
  location: z.string().min(1).optional(),
  pricePerNight: z.number().positive().optional(),
  coverImage: z.string().url().optional(),
  images: z.array(z.string().url()).optional(),
  description: z.string().min(1).optional(),
  features: z.array(FeatureEnum).optional(),
  rules: z.array(RuleEnum).optional(),
});

export const apartmentReplaceSchema = ApartmentSchema.omit({ entrepreneurId: true });

export type CreateApartmentInput = z.infer<typeof ApartmentSchema>;
export type UpdateApartmentInput = z.infer<typeof apartmentUpdateSchema>;
