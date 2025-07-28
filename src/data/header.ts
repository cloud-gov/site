export const headerProps = {
  logoText: "Cloud.gov",
  logoUrl: "",
  dropdowns: [
    {
      label: "Solutions",
      links: [
        { label: "Platform: Fast & Scalable Federal Apps", url: "apps" },
        { label: "Pages: Federal Public Websites", url: "pages" },
        { label: "Workshop: Developer Collaboration Tools", url: "workshop" },
      ],
    },
  ],
  navLinks: [
    { label: "Pricing", url: "pricing" },
    { label: "Security & Compliance", url: "security" },
  ],
  secondaryLinks: [
    { label: "Support", url: "support" },
    { label: "Contact", url: "contact" },
    { label: "Status", url: "https://cloudgov.statuspage.io/" },
  ],
  buttonLinks: [
    { label: "Get a free sandbox", url: "sign-up" },
    { label: "Log in", url: "https://login.fr.cloud.gov", class: "outline" },
  ],
  searchPlaceholder: "Search for...",
};
