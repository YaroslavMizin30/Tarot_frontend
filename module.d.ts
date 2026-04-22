declare module '*.svg' {
  import { FunctionComponent, SVGAttributes, type HTMLAttributes } from 'react';
  const content: FunctionComponent<SVGAttributes<SVGElement> | HTMLAttributes>;
  export default content;
}

declare module 'snakeize';
