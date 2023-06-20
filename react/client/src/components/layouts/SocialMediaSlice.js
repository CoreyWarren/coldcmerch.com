import React from 'react';

function SocialMediaBox({ title, icon, link }) {
  return (
    <div className="social-media-box">
        <a href={link}>
      <h2 className="box-title">{title}</h2>
      <img className="box-icon" src={icon} alt={title} />
        </a>
    </div>
  );
}

function SocialMediaSlice({ items }) {
  return (
    <div className={`social-media-slice ${items.length === 1 ? 'single-item' : ''}`}>
      {items.map((item, index) => (
        <SocialMediaBox key={index} title={item.title} icon={item.icon} link={item.link} />
      ))}
    </div>
  );
}

export default SocialMediaSlice;