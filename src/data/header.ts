export const headerProps = {
  logoText: 'Cloud.gov',
  logoUrl: '/',
  dropdowns: [
    {
      label: 'Solutions',
      links: [
        { label: 'Fast & Scalable Federal Apps', url: '/solutions/federal-apps' },
        { label: 'Federal Public Websites', url: '/solutions/public-websites' },
        { label: 'Developer Collaboration Tools', url: '/solutions/devtools' }
      ]
    },
  ],
  navLinks: [
    { label: 'Pricing', url: '/pricing' },
    { label: 'Security & Compliance', url: '/security' },
  ],
  secondaryLinks: [
    { label: 'Resources', url: '/resources' },
    { label: 'Contact', url: '/contact' },
    { label: 'Status', url: 'https://status.cloud.gov' }
  ],
  buttonLinks: [
    { label: 'Get a free sandbox', url: '/sign-up' },
    { label: 'Log in', url: 'https://login.fr.cloud.gov', class: 'outline' }
  ],
  searchPlaceholder: "Search for..."
};
