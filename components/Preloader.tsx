import { motion } from "motion/react";

const Preloader = () => {
    return (
        <motion.div
            className="fixed inset-0 z-[9999] bg-[#050505]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
        />
    );
};

export default Preloader;
