import React, { forwardRef } from 'react';
import ReactInputMask from 'react-input-mask';
import { cn } from '@/lib/utils';

export interface MaskedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'mask'> {
  mask: string;
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, ...props }, ref) => {
    return (
      <ReactInputMask
        mask={mask}
        {...props}
      >
        {(inputProps: any) => (
          <input
            {...inputProps}
            ref={ref}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
          />
        )}
      </ReactInputMask>
    );
  }
);

MaskedInput.displayName = 'MaskedInput';

export { MaskedInput };