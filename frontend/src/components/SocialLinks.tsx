import { Facebook, Instagram, Youtube } from 'lucide-react';

/**
 * lucide has no TikTok icon, and its `X` export is the close-cross, not the brand
 * mark -- so those two are inline brand paths. Same approach as the WhatsApp icon
 * on the home page.
 */
const XIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932zM17.61 20.644h2.039L6.486 3.24H4.298z" />
    </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
);

// Share/QR tracking parameters were stripped from the TikTok and Instagram URLs:
// they are session artifacts from the mobile apps and expire.
const SOCIALS = [
    { name: 'Facebook', href: 'https://www.facebook.com/people/Dbtech/61592425362935/', Icon: Facebook },
    { name: 'YouTube', href: 'https://www.youtube.com/channel/UCYeX9CEMtgcKP8iOecpqzQg', Icon: Youtube },
    { name: 'TikTok', href: 'https://www.tiktok.com/@dbtech8', Icon: TikTokIcon },
    { name: 'X', href: 'https://x.com/DBtech048', Icon: XIcon },
    { name: 'Instagram', href: 'https://www.instagram.com/dbtech048', Icon: Instagram },
];

export default function SocialLinks({ className = '' }: { className?: string }) {
    return (
        <nav className={`flex items-center gap-5 ${className}`}>
            {SOCIALS.map(({ name, href, Icon }) => (
                <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} de Diego Bazán`}
                    title={name}
                    className="text-zinc-500 hover:text-white transition-colors"
                >
                    <Icon className="w-5 h-5" />
                </a>
            ))}
        </nav>
    );
}
