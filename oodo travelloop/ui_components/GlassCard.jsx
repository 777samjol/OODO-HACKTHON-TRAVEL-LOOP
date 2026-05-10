import React from 'react';
import './GlassCard.css';

/**
 * A premium glassmorphism card component.
 * Requires GlassCard.css to be imported.
 */
const GlassCard = ({ title, description, image, buttonText, onButtonClick, children }) => {
  return (
    <div className="glass-card">
      {image && <img src={image} alt={title} className="glass-card-image" />}
      <div className="glass-card-content">
        {title && <h3 className="glass-card-title">{title}</h3>}
        {description && <p className="glass-card-description">{description}</p>}
        {children}
        {buttonText && (
          <button className="glass-card-button" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
};

export default GlassCard;
