import React from 'react';
import { Icon, IconifyIcon } from '@iconify/react';

interface IconifyProps {
  icon: string | IconifyIcon;
  width?: number | string;
  height?: number | string;
  sx?: any;
  className?: string;
}

export default function Iconify({ icon, width = 20, height, sx, ...other }: IconifyProps) {
  return (
    <Icon
      icon={icon}
      width={width}
      height={height || width}
      style={sx}
      {...other}
    />
  );
}
