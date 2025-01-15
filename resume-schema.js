// resumeSchema.js
import { z } from "zod";

// Location schema
const locationSchema = z.object({
    city: z.string(),
    state: z.string(),
    country: z.string(),
});

// Social profile schema
const profileSchema = z.object({
    socialNetwork: z.string(),
    url: z.string().url(),
});

// Contact schema
const contactSchema = z.object({
    email: z.string().email(),
    // linkedIn: z.string().email(),
    // socialProfiles: z.array(profileSchema),
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
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional(),
    }).optional()
);

// Combined resume schema
export const resumeSchema = z.object({
    basics: basicsSchema,
    // education: educationSchema.optional(),
});
