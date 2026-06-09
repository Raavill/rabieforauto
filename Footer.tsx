interface FooterProps {
  onAdminClick: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  const linkGroups = [
    { title: 'Platform', links: ['Search Parts', 'Compare Prices', 'Price Alerts', 'AI Assistant'] },
    { title: 'Company', links: ['About Us', 'Careers', 'Press', 'Contact'] },
    { title: 'Support', links: ['Shipping Policy', 'Warranty', 'Returns', 'FAQ'] },
    { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
  ];

  return (
    <footer className="relative w-full pt-20 pb-8" style={{ backgroundColor: '#000000' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 pb-14 border-b border-white/8">
          <div className="max-w-xs">
            <a href="/" className="font-display text-white text-2xl font-800 tracking-tight block mb-4">rabieforauto</a>
            <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>
              The world&apos;s smartest car spare parts search engine. Compare prices from hundreds of stores and save up to 60% on OEM and aftermarket parts.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {linkGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">{group.title}</h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm transition-colors duration-200 hover:text-white" style={{ color: '#666666' }}>{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
          <p className="text-xs" style={{ color: '#444444' }}>&copy; {new Date().getFullYear()} rabieforauto. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['EN', 'FR', 'DE', 'AR'].map((lang) => (
              <button key={lang} className="text-xs font-medium uppercase tracking-wider transition-colors duration-200 hover:text-white" style={{ color: lang === 'EN' ? '#ff461e' : '#555555' }}>
                {lang}
              </button>
            ))}
            <button
              onClick={onAdminClick}
              className="text-xs font-medium uppercase tracking-wider transition-colors duration-200 hover:text-[#ff461e]"
              style={{ color: '#333' }}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
