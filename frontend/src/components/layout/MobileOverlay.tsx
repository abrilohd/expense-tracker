/**
 * Mobile Overlay - Dark backdrop for sidebar drawer
 * Only visible on mobile when sidebar is open
 */
import { motion, AnimatePresence } from 'framer-motion';

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileOverlay = ({ isOpen, onClose }: MobileOverlayProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-30 lg:hidden"
          style={{
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default MobileOverlay;
