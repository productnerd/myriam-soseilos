// TypeScript declarations for missing modules and types

declare module 'react-simple-maps' {
	export interface GeographyProps {
		geography: any;
		[key: string]: any;
	}
	
	export interface ComposableMapProps {
		children: React.ReactNode;
		[key: string]: any;
	}
	
	export interface GeographiesProps {
		children: (props: { geographies: any[] }) => React.ReactNode;
		[key: string]: any;
	}
	
	export const ComposableMap: React.FC<ComposableMapProps>;
	export const Geographies: React.FC<GeographiesProps>;
	export const Geography: React.FC<GeographyProps>;
	export const Sphere: React.FC<any>;
	export const Graticule: React.FC<any>;
}