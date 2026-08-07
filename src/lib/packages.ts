import { PRICES, type Jurisdiction, type Pkg } from "./pricing";

// Single source for the package copy shown to customers. Both the /order
// pricing page and the Step 2 package picker in the /incorporate wizard read
// from here — they previously kept separate lists, which drifted apart and left
// the wizard describing a different product than the page that sent the
// customer there.
//
// The copy is jurisdiction-independent: Federal and Ontario differ only in
// price (see PRICES in ./pricing), not in what each package contains.

export type PackageCopy = {
  id: Pkg;
  name: string;
  /** Two lines. The first names the audience; renderers set it in bold. */
  description: string;
  features: string[];
};

export const PACKAGE_ORDER: Pkg[] = ["basic", "standard", "premium"];

export const PACKAGE_COPY: Record<Pkg, PackageCopy> = {
  basic: {
    id: "basic",
    name: "Basic",
    description:
      "For solo founders.\nThe simplest way to incorporate. Ideal for consultants, Freelancers, and single-owner holding companies.",
    features: [
      "Articles of Incorporation filing, including Certificate of Incorporation & Company key",
      "Numbered Corporation",
      "1 Class of Shares",
      "1 Shareholder, 1 Director, and 1 Officer",
      "Standard Digital Minute Book",
      "All Mandatory post-incorporation filings",
      "24-hour turnaround",
    ],
  },
  standard: {
    id: "standard",
    name: "Standard",
    description:
      "For founding teams.\nBuilt for co-founders, spouses incorporating together, and small partnerships ready to operate under a business name.",
    features: [
      "Articles of Incorporation filing, including Certificate of Incorporation & Company key",
      "Numbered or named corporation (one NUANS name search included)",
      "Up to 3 Classes of Shares",
      "Up to 3 Shareholders, 3 Directors, 3 Officers",
      "Standard Digital Minute Book",
      "All Mandatory post-incorporation filings",
      "24-hour turnaround",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    description:
      "For multi-stakeholder Businesses.\nDesigned for businesses with multiple founders, advisors, or family members, and the share structure to match.",
    features: [
      "Articles of Incorporation filing, including Certificate of Incorporation & Company key",
      "Numbered or named corporation (one NUANS name search included)",
      "Up to 5 Classes of Shares",
      "Up to 5 Shareholders, 5 Directors, 5 Officers",
      "Standard Digital Minute Book",
      "All Mandatory post-incorporation filings",
      "24-hour turnaround",
    ],
  },
};

/** Package copy paired with the price for a jurisdiction, in display order. */
export function packageTiers(jurisdiction: Jurisdiction): (PackageCopy & { price: string })[] {
  return PACKAGE_ORDER.map((id) => ({
    ...PACKAGE_COPY[id],
    price: `$${PRICES[jurisdiction][id].toLocaleString("en-CA")}`,
  }));
}
