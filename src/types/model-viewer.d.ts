/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        'ios-src'?: string;
        poster?: string;
        alt?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'ar-placement'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'auto-rotate-delay'?: number;
        'rotation-per-second'?: string;
        'shadow-intensity'?: string | number;
        'shadow-softness'?: string | number;
        exposure?: string | number;
        'environment-image'?: string;
        skybox?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        reveal?: string;
        style?: React.CSSProperties;
        className?: string;
        id?: string;
        'touch-action'?: string;
        'interaction-prompt'?: string;
        'field-of-view'?: string;
        'min-field-of-view'?: string;
        'max-field-of-view'?: string;
      },
      HTMLElement
    >;
  }
}
