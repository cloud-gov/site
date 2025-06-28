export const headerProps = {
  logoText: 'Cloud.gov',
  logoHref: '/',
  dropdowns: [
    {
      label: 'Solutions',
      links: [
        { label: 'Fast & Scalable Federal Apps', href: '/solutions/federal-apps' },
        { label: 'Federal Public Websites', href: '/solutions/public-websites' },
        { label: 'Developer Collaboration Tools', href: '/solutions/devtools' }
      ]
    },
  ],
  navLinks: [
    { label: 'Pricing', href: '/pricing' },
    { label: 'Security & Compliance', href: '/security' },
  ],
  secondaryLinks: [
    { label: 'Resources', href: '/resources' },
    { label: 'Contact', href: '/contact' },
    { label: 'Status', href: 'https://status.cloud.gov' }
  ],
  buttonLinks: [
    { label: 'Sign up', href: '/sign-up' },
    { label: 'Log in', href: 'https://login.fr.cloud.gov', class: 'outline' }
  ]
};
