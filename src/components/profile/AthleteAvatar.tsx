import React, { useState } from 'react';

interface AthleteAvatarProps {
  name: string;
  src?: string;
  className?: string;
  fallbackClassName?: string;
}

const getInitials = (name: string) => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part.charAt(0).toUpperCase())
  .join('') || 'CL';

export const AthleteAvatar: React.FC<AthleteAvatarProps> = ({
  name,
  src,
  className = '',
  fallbackClassName = ''
}) => {
  const [failedSrc, setFailedSrc] = useState<string>();

  return (
    <div className={`overflow-hidden flex items-center justify-center ${className}`}>
      {src && failedSrc !== src ? (
        <img
          src={src}
          alt={`Foto de perfil de ${name}`}
          className="w-full h-full object-cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <span className={fallbackClassName}>{getInitials(name)}</span>
      )}
    </div>
  );
};
