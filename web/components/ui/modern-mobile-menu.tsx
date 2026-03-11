import React, { useState, useRef, useEffect, useMemo } from 'react';

type IconComponentType = React.ElementType<{ className?: string }>;
export interface InteractiveMenuItem {
    label: string;
    icon: IconComponentType;
    onClick?: () => void;
    displayMode?: 'text' | 'icon'; // Optional, defaults to 'icon' if not handled by parent
}

export interface InteractiveMenuProps {
    items?: InteractiveMenuItem[];
    accentColor?: string;
    defaultDisplayMode?: 'text' | 'icon';
    className?: string;
}

const defaultAccentColor = 'var(--component-active-color-default)';

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ items, accentColor, defaultDisplayMode = 'icon', className = '' }) => {

    const finalItems = useMemo(() => {
        // Removed validation for length to allow single menu items (custom toggles)
        const isValid = items && Array.isArray(items);
        if (!isValid) {
            console.warn("InteractiveMenu: 'items' prop is invalid or missing.", items);
            return [];
        }
        return items;
    }, [items]);

    const [activeIndex, setActiveIndex] = useState(0);

    // ... (rest of the hooks remain the same until the return)

    // Hooks content is unchanged, just showing the boundary for the replace_file tool
    useEffect(() => {
        if (activeIndex >= finalItems.length) {
            setActiveIndex(0);
        }
    }, [finalItems, activeIndex]);

    const textRefs = useRef<(HTMLElement | null)[]>([]);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
        const setLineWidth = () => {
            const activeItemElement = itemRefs.current[activeIndex];
            const activeTextElement = textRefs.current[activeIndex];

            if (activeItemElement && activeTextElement) {
                const textWidth = activeTextElement.offsetWidth;
                activeItemElement.style.setProperty('--lineWidth', `${textWidth}px`);
            }
        };

        setLineWidth();

        // Small timeout to ensure DOM is settled for text measurements
        const timeout = setTimeout(setLineWidth, 50);

        window.addEventListener('resize', setLineWidth);
        return () => {
            window.removeEventListener('resize', setLineWidth);
            clearTimeout(timeout);
        };
    }, [activeIndex, finalItems]);

    const handleItemClick = (index: number) => {
        setActiveIndex(index);
        const item = finalItems[index];
        if (item.onClick) {
            item.onClick();
        }
    };

    const navStyle = useMemo(() => {
        const activeColor = accentColor || defaultAccentColor;
        return { '--component-active-color': activeColor } as React.CSSProperties;
    }, [accentColor]);

    return (
        <nav
            className={`menu ${className}`}
            role="navigation"
            style={navStyle}
        >
            {finalItems.map((item, index) => {
                const isActive = index === activeIndex;
                const mode = item.displayMode || defaultDisplayMode;

                const IconComponent = item.icon;

                return (
                    <button
                        key={item.label}
                        className={`menu__item ${isActive ? 'active' : ''} ${mode === 'text' ? 'text-mode' : 'icon-mode'}`}
                        onClick={() => handleItemClick(index)}
                        ref={(el) => (itemRefs.current[index] = el)}
                        style={{ '--lineWidth': '0px' } as React.CSSProperties}
                        title={item.label}
                    >
                        <div className="menu__icon">
                            <IconComponent className="icon" />
                        </div>
                        <strong
                            className={`menu__text ${isActive ? 'active' : ''}`}
                            ref={(el) => (textRefs.current[index] = el)}
                        >
                            {item.label}
                        </strong>
                    </button>
                );
            })}
        </nav>
    );
};

export { InteractiveMenu }
