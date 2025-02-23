import { motion } from "framer-motion";

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_#FF1493]"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 ${color} rounded-xl border-2 border-black`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-600">{title}</p>
          <h4 className="text-2xl font-black">{value}</h4>
        </div>
      </div>
      {/* Decorative line */}
      <div className="mt-4 h-1 w-full bg-gradient-to-r from-[#FF1493] to-transparent rounded-full"></div>
    </motion.div>
  );
};

export default StatsCard;
