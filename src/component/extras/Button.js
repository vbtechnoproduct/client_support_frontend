import React from 'react';

const Button = ({ onClick, text, aIcon, bIcon,disabled, className,onKeyPress, type, style }) => {
  return (
    <button type={type} className={`themeButton ${className}`} style={style} disabled={disabled} onClick={onClick} onKeyPress={onKeyPress}>
      {bIcon && bIcon}
      <span>{text}</span>
      {aIcon && <span><i className={`${aIcon} m5-left`}></i></span>}
    </button >
  );
}

export default Button;
