// Icon component wraps FontAwesomeIcon for consistent icon usage in the app
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Icon accepts icon, color, size, and className as props
export const Icon = ({ icon, color, size, className }) => {
  return (
    <FontAwesomeIcon
      icon={icon}  // The FontAwesome icon
      color={color}  // Optional color
      size={size}  // Optional size
      className={className}  // Optional custom class
    />
  );
};
