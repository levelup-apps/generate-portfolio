// resumeSchema.js
import { z } from "zod";

// Location schema
const locationSchema = z.object({
    city: z.string().nullish(),
    state: z.string().nullish(),
    country: z.string().nullish(),
});

// Social profile schema
const socialProfileSchema = z.object({
    network: z.string().nullish(),
    url: z.string().url(),
});

// Contact schema
const contactSchema = z.object({
    email: z.string().email().optional(),
    linkedInUrl: z.string().url(),
    socialProfiles: z.array(socialProfileSchema),
});

// Basic info schema
const basicsSchema = z.object({
    name: z.string().nullish().describe("Full name"),
    headline: z.string().nullish().describe("Professional headline"),
    location: locationSchema,
    contact: contactSchema,
    summary: z.string().nullish().describe("Professional summary or objective"),
});

// Education schema
const educationSchema = z.array(
    z.object({
        institution: z.string().nullish().optional(),
        area: z.string().nullish().optional(),
        studyType: z.string().nullish().optional(),
        startDate: z
            .string()
            .datetime()
            .optional()
            .transform((val) => val || undefined),
        endDate: z
            .string()
            .datetime()
            .optional()
            .transform((val) => val || undefined),
    })
);

// Work experience schema
const positionSchema = z.object({
    title: z.string().nullish(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    location: z.string().nullish().optional(),
    team: z.string().nullish().optional(),
    description: z.string().nullish().optional(),
    technologies: z.string().nullish().optional(),
});

const workSchema = z.array(
    z.object({
        company: z.string(),
        totalDuration: z.string().optional(),
        positions: z.array(positionSchema),
        position: z.string().nullish().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        location: z.string().nullish().optional(),
        duration: z.string().nullish().optional(),
        description: z.string().nullish().optional(),
    })
);

// Combined resume schema
export const resumeSchema = z.object({
    basics: basicsSchema.optional(),
    education: educationSchema.optional(),
    work: workSchema.optional(),
});
