import * as React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const animatedInputVariants = cva(
  "relative w-full group",
  {
    variants: {
      size: {
        default: "h-14",
        sm: "h-12",
        lg: "h-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface AnimatedInputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    VariantProps<typeof animatedInputVariants> {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  error?: string;
}

const AnimatedInput = React.forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ 
    className, 
    type = "text", 
    label, 
    leftIcon, 
    rightIcon, 
    onRightIconClick,
    error,
    size,
    value,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = value !== undefined && value !== "" && value !== null;
    const isFloating = isFocused || hasValue;

    return (
      <div className={cn(animatedInputVariants({ size }), className)}>
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-muted-foreground transition-colors duration-300 group-focus-within:text-primary">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={type}
            value={value}
            className={cn(
              "w-full h-full bg-transparent border-b-2 border-border transition-all duration-300 outline-none text-base font-medium text-foreground placeholder-transparent",
              "focus:border-primary focus:shadow-[0_2px_8px_hsl(var(--primary)/.2)]",
              leftIcon ? "pl-10" : "pl-0",
              rightIcon ? "pr-10" : "pr-0",
              error && "border-red-500 focus:border-red-500 focus:shadow-[0_2px_8px_hsl(0_84%_60%/.2)]"
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />

          {/* Floating Label */}
          <label
            className={cn(
              "absolute left-0 transition-all duration-300 pointer-events-none font-medium",
              leftIcon ? "left-10" : "left-0",
              isFloating
                ? "top-0 text-xs text-primary transform -translate-y-2"
                : "top-1/2 text-base text-muted-foreground transform -translate-y-1/2",
              error && isFloating && "text-red-500",
              error && !isFloating && "text-muted-foreground"
            )}
          >
            {label}
          </label>

          {/* Right Icon */}
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {rightIcon}
            </button>
          )}

          {/* Focus Line Effect */}
          <div 
            className={cn(
              "absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 transform origin-center",
              isFocused ? "w-full scale-x-100" : "w-0 scale-x-0",
              error && "bg-red-500"
            )}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500 mt-2 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export { AnimatedInput, animatedInputVariants };