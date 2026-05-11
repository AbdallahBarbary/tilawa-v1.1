import React from 'react';
import Svg, { Path, Circle, G, Rect, Line } from 'react-native-svg';
import { Colors } from '../constants/theme';

interface IconProps {
  size?: number;
  color?: string;
  filled?: boolean;
}

export const HomeIcon: React.FC<IconProps> = ({ size = 24, color = Colors.neutral[400], filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {filled ? (
      <Path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.78 21.04 20.41 21.41C20.04 21.79 19.55 22 19 22H5C4.45 22 3.96 21.79 3.59 21.41C3.21 21.04 3 20.55 3 20V10.5Z" fill={color} />
    ) : (
      <Path d="M3 10.5L12 3L21 10.5V20C21 20.55 20.78 21.04 20.41 21.41C20.04 21.79 19.55 22 19 22H5C4.45 22 3.96 21.79 3.59 21.41C3.21 21.04 3 20.55 3 20V10.5Z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    )}
    <Path d="M9 22V12H15V22" stroke={filled ? '#fff' : color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 24, color = Colors.neutral[400], filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={1.8} fill={filled ? color + '22' : 'none'} />
    <Path d="M21 21L16.5 16.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

export const MapPinIcon: React.FC<IconProps> = ({ size = 24, color = Colors.neutral[400], filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="9" r="2.5" fill={filled ? '#fff' : 'none'} stroke={filled ? 'none' : color} strokeWidth={1.8} />
  </Svg>
);

export const ChatIcon: React.FC<IconProps> = ({ size = 24, color = Colors.neutral[400], filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 15C21 15.53 20.79 16.04 20.41 16.41C20.04 16.79 19.53 17 19 17H7L3 21V5C3 4.47 3.21 3.96 3.59 3.59C3.96 3.21 4.47 3 5 3H19C19.53 3 20.04 3.21 20.41 3.59C20.79 3.96 21 4.47 21 5V15Z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {filled && (
      <>
        <Line x1="8" y1="9" x2="16" y2="9" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
        <Line x1="8" y1="13" x2="13" y2="13" stroke="#fff" strokeWidth={1.5} strokeLinecap="round" />
      </>
    )}
  </Svg>
);

export const SessionsIcon: React.FC<IconProps> = ({ size = 24, color = Colors.neutral[400], filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth={1.8} fill={filled ? color : 'none'} />
    <Path d="M16 2V6M8 2V6M3 10H21" stroke={filled ? '#fff' : color} strokeWidth={1.8} strokeLinecap="round" />
    <Circle cx="12" cy="16" r="1.5" fill={filled ? '#fff' : color} />
  </Svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ size = 24, color = Colors.neutral[400], filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.8} fill={filled ? color : 'none'} />
    <Path d="M20 21C20 17.13 16.42 14 12 14C7.58 14 4 17.13 4 21" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

export const StarIcon: React.FC<IconProps> = ({ size = 16, color = Colors.gold[500] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </Svg>
);

export const VerifiedIcon: React.FC<IconProps> = ({ size = 18, color = Colors.primary[500] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Path d="M8 12L11 15L16 9" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const OnlineIcon: React.FC<IconProps> = ({ size = 10, color = Colors.success }) => (
  <Svg width={size} height={size} viewBox="0 0 10 10">
    <Circle cx="5" cy="5" r="5" fill={color} />
    <Circle cx="5" cy="5" r="3" fill="#fff" opacity={0.3} />
  </Svg>
);

export const BookOpenIcon: React.FC<IconProps> = ({ size = 24, color = Colors.primary[500] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M2 3H8C9.06 3 10.08 3.42 10.83 4.17C11.58 4.92 12 5.94 12 7V21C12 20.2 11.68 19.44 11.12 18.88C10.56 18.32 9.8 18 9 18H2V3Z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 3H16C14.94 3 13.92 3.42 13.17 4.17C12.42 4.92 12 5.94 12 7V21C12 20.2 12.32 19.44 12.88 18.88C13.44 18.32 14.2 18 15 18H22V3Z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ClockIcon: React.FC<IconProps> = ({ size = 18, color = Colors.neutral[400] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={1.8} />
    <Path d="M12 7V12L15 15" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

export const FilterIcon: React.FC<IconProps> = ({ size = 24, color = Colors.neutral[600] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 6H20M7 12H17M10 18H14" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 20, color = Colors.neutral[400] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 6L15 12L9 18" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const HeartIcon: React.FC<IconProps> = ({ size = 24, color = Colors.neutral[300], filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const FireIcon: React.FC<IconProps> = ({ size = 20, color = Colors.gold[500] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C12 2 4 8 4 14C4 18.42 7.58 22 12 22C16.42 22 20 18.42 20 14C20 8 12 2 12 2Z" fill={color} opacity={0.15} stroke={color} strokeWidth={1.8} />
    <Path d="M12 12C12 12 9 14 9 16.5C9 18.16 10.34 19.5 12 19.5C13.66 19.5 15 18.16 15 16.5C15 14 12 12 12 12Z" fill={color} />
  </Svg>
);

export const BellIcon: React.FC<IconProps> = ({ size = 24, color = Colors.neutral[700] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M18 8A6 6 0 006 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M13.73 21C13.55 21.3 13.3 21.55 12.998 21.73C12.69 21.9 12.35 21.99 12 21.99C11.65 21.99 11.3 21.9 11 21.73C10.7 21.55 10.45 21.3 10.27 21" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 24, color = Colors.neutral[800] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M19 12H5M12 19L5 12L12 5" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const VideoIcon: React.FC<IconProps> = ({ size = 20, color = Colors.primary[500] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="4" width="15" height="16" rx="2" stroke={color} strokeWidth={1.8} />
    <Path d="M17 9L22 6V18L17 15" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const MessageIcon: React.FC<IconProps> = ({ size = 20, color = Colors.primary[500] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15C21 15.53 20.79 16.04 20.41 16.41C20.04 16.79 19.53 17 19 17H7L3 21V5C3 4.47 3.21 3.96 3.59 3.59C3.96 3.21 4.47 3 5 3H19C19.53 3 20.04 3.21 20.41 3.59C20.79 3.96 21 4.47 21 5V15Z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const SettingsIcon: React.FC<IconProps> = ({ size = 24, color = Colors.neutral[600] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.8} />
    <Path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ size = 16, color = Colors.neutral[400] }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={1.5} />
    <Path d="M2 12H22M12 2C14.5 4.5 15.5 8 15.5 12C15.5 16 14.5 19.5 12 22M12 2C9.5 4.5 8.5 8 8.5 12C8.5 16 9.5 19.5 12 22" stroke={color} strokeWidth={1.5} />
  </Svg>
);

export const GeometricPattern: React.FC<{ size?: number; color?: string; opacity?: number }> = ({
  size = 60, color = Colors.gold[500], opacity = 0.06,
}) => (
  <Svg width={size} height={size} viewBox="0 0 60 60" opacity={opacity}>
    <G>
      <Path d="M30 0L60 30L30 60L0 30Z" stroke={color} strokeWidth={0.5} fill="none" />
      <Path d="M30 10L50 30L30 50L10 30Z" stroke={color} strokeWidth={0.5} fill="none" />
      <Path d="M30 20L40 30L30 40L20 30Z" stroke={color} strokeWidth={0.5} fill="none" />
      <Circle cx="30" cy="30" r="3" fill={color} opacity={0.3} />
    </G>
  </Svg>
);
