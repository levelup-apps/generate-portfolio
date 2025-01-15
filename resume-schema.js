// resumeSchema.js
import { z } from "zod";

// Location schema
const locationSchema = z.object({
    city: z.string(),
    state: z.string(),
    country: z.string(),
});

// Social profile schema
const socialProfileSchema = z.object({
    network: z.string(),
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
    name: z.string().describe("Full name"),
    headline: z.string().describe("Professional headline"),
    location: locationSchema,
    contact: contactSchema,
    summary: z.string().describe("Professional summary or objective"),
});

// Education schema
const educationSchema = z.array(
    z.object({
        institution: z.string(),
        area: z.string().optional(),
        studyType: z.string().optional(),
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
    title: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    location: z.string().optional(),
    team: z.string().optional(),
    description: z.string().optional(),
    technologies: z.string().optional(),
});

const workSchema = z.array(
    z.object({
        company: z.string(),
        totalDuration: z.string().optional(),
        positions: z.array(positionSchema),
        position: z.string().optional(),
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
        location: z.string().optional(),
        duration: z.string().optional(),
        description: z.string().optional(),
    })
);

// Combined resume schema
export const resumeSchema = z.object({
    basics: basicsSchema,
    education: educationSchema.optional(),
    work: workSchema, 
});
