import React from 'react';
import { Home, User, Briefcase, Award, BookOpen, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { InteractiveMenu, InteractiveMenuItem } from './ui/modern-mobile-menu';

const Navbar: React.FC = () => {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isDark = resolvedTheme === 'dark';

    const menuItems: InteractiveMenuItem[] = [
        {
            label: 'Home',
            icon: Home,
            onClick: () => {
                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
            }
        },
        {
            label: 'Experience',
            icon: Briefcase,
            onClick: () => {
                document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
            }
        },
        {
            label: 'Projects',
            icon: Award,
            onClick: () => {
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            }
        },
        {
            label: 'About',
            icon: User,
            onClick: () => {
                document.getElementById('about-me')?.scrollIntoView({ behavior: 'smooth' });
            }
        },
        {
            label: 'Blogs',
            icon: BookOpen,
            onClick: () => {
                document.getElementById('blogs')?.scrollIntoView({ behavior: 'smooth' });
            }
        },
        {
            label: 'Theme',
            icon: mounted ? (isDark ? Sun : Moon) : Moon,
            onClick: () => {
                setTheme(isDark ? 'light' : 'dark');
            }
        },
    ];

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <InteractiveMenu items={menuItems} accentColor="#3b82f6" />
        </div>
    );
};

export default Navbar;
