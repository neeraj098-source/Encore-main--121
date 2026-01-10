import { forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, HTMLMotionProps } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-gold text-black hover:bg-white hover:text-black transition-colors',
            outline: 'border-2 border-gold text-gold hover:bg-gold hover:text-black',
            ghost: 'text-white hover:text-gold bg-transparent',
        };

        const sizes = {
            sm: 'px-3 py-1 text-sm',
            md: 'px-6 py-2 text-base',
            lg: 'px-8 py-3 text-lg',
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className={cn(
                    'rounded-full font-cinzel font-bold tracking-wide cursor-pointer flex items-center justify-center',
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export { Button };
