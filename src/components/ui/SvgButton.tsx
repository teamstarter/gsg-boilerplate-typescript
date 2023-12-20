import React from 'react';

interface SvgButtonProps {
  svgSource: React.ReactNode;
  strokeColor?: string;
  onClick?: () => void;
  ariaLabel?: string;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
}

const SvgButton: React.FC<SvgButtonProps> = ({
  svgSource,
  strokeColor,
  onClick,
  ariaLabel,
  className,
  disabled,
  tooltip
}) => {
  return (
    <div className='svg-button-container'>
      <button
        type="button"
        style={{ stroke: strokeColor }}
        onClick={onClick}
        aria-label={ariaLabel}
        className={"svg-button "+className}
        disabled={disabled}
      >
        {svgSource}
      </button>
      {tooltip && <span className="svg-tooltip">{tooltip}</span>}
    </div>
  );
};

export default SvgButton;
