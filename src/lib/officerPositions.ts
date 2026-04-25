// Officer positions for the incorporation form. A corporation must designate
// one or more officers, each with one of the standard registry positions
// listed below. Order preserved from the source registry list (not strictly
// alphabetical — `Authorized Signing Officer` sits between the two
// `Assistant…` entries by registry convention).

import { z } from "zod";

export const OFFICER_POSITIONS = [
  "Assistant Secretary",
  "Authorized Signing Officer",
  "Assistant Treasurer",
  "Chief Administrative Officer",
  "Chief Executive Officer",
  "Chief Financial Officer",
  "Chair",
  "Chairman",
  "Chair Person",
  "Chairwoman",
  "Chief Information Officer",
  "Chief Manager",
  "Comptroller",
  "Chief Operating Officer",
  "Executive Director",
  "General Manager",
  "Managing Director",
  "President",
  "Secretary",
  "Treasurer",
  "Vice-Chair",
  "Vice-President",
] as const;

export type OfficerPosition = (typeof OFFICER_POSITIONS)[number];

export const officerPositionSchema = z.enum(
  OFFICER_POSITIONS as unknown as [OfficerPosition, ...OfficerPosition[]],
  { message: "Select a position" }
);
