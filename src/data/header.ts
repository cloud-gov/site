export const headerProps = {
  logoText: 'Cloud.gov',
  logoUrl: '',
  dropdowns: [
    {
      label: 'Solutions',
      links: [
        { label: 'Fast & Scalable Federal Apps', url: 'apps' },
        { label: 'Federal Public Websites', url: 'pages' },
        { label: 'Developer Collaboration Tools', url: 'tools' }
      ]
    },
  ],
  navLinks: [
    { label: 'Pricing', url: 'pricing' },
    { label: 'Security & Compliance', url: 'security' },
  ],
  secondaryLinks: [
    { label: 'Resources', url: 'resources' },
    { label: 'Contact', url: 'contact' },
    { label: 'Status', url: 'https://cloudgov.statuspage.io/' }
  ],
  buttonLinks: [
    { label: 'Get a free sandbox', url: 'sign-up' },
    { label: 'Log in', url: 'https://login.fr.cloud.gov', class: 'outline' }
  ],
  searchPlaceholder: "Search for..."
};
