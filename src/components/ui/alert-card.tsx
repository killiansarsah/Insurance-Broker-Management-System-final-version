"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define the props for the AlertCard component
interface AlertCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  isVisible: boolean;
  onDismiss?: () => void;
}

const AlertCard = React.forwardRef<HTMLDivElement, AlertCardProps>(
  ({
    className,
    icon,
    title,
    description,
    buttonText,
    onButtonClick,
    isVisible,
    onDismiss,
    ...props
  }, ref) => {
    
    // Animation variants for the card container
    const cardVariants = {
      hidden: { opacity: 0, y: 50, scale: 0.95 },
      visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
          type: "spring", 
          stiffness: 400, 
          damping: 25,
          staggerChildren: 0.1,
        }
      },
      exit: { 
        opacity: 0, 
        y: 20, 
        scale: 0.98,
        transition: { duration: 0.2 }
      }
    };

    // Animation variants for child elements for a staggered effect
    const itemVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { opacity: 1, y: 0 },
    };

    return (
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              ref={ref}
              className={cn(
                "relative w-full max-w-sm overflow-hidden rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
                "bg-danger-600 text-white border border-white/20", // Custom danger color from existing theme
                className
              )}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="alert"
              aria-live="assertive"
              {...props}
            >
              {/* Optional dismiss button */}
              {onDismiss && (
                <motion.div variants={itemVariants} className="absolute top-4 right-4">
                  <button
                    className="h-10 w-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
                    onClick={onDismiss}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Dismiss</span>
                  </button>
                </motion.div>
              )}

              {/* Icon with a subtle pulse animation */}
              {icon && (
                <motion.div
                  variants={itemVariants}
                  className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md"
                >
                  <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                      {icon}
                  </motion.div>
                </motion.div>
              )}

              {/* Title */}
              <motion.h3 variants={itemVariants} className="text-3xl font-black tracking-tight leading-tight">
                {title}
              </motion.h3>

              {/* Description */}
              <motion.p variants={itemVariants} className="mt-3 text-base text-white/80 max-w-[90%] leading-relaxed font-medium">
                {description}
              </motion.p>
              
              {/* Action Button */}
              <motion.div variants={itemVariants} className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full rounded-2xl bg-white py-6 text-lg font-black text-danger-600 shadow-xl transition-all duration-300 uppercase tracking-widest cursor-pointer"
                  onClick={onButtonClick}
                >
                  {buttonText}
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }
);
AlertCard.displayName = "AlertCard";

export { AlertCard };
