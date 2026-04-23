/**
 * Dark overlay for mobile sidebar drawer
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
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </AnimatePresence>
  );
};

export default MobileOverlay;
