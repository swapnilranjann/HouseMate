import React from 'react';
import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        {/* Enterprise Loader Dot Grid */}
        <div className="grid grid-cols-2 gap-1.5 mb-6">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: 'var(--primary)' }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <p className="text-[12px] font-black text-gray-900 uppercase tracking-[0.4em] ml-2">
          HouseMate
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
