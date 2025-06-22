/**
 * Type declarations for cmdk
 */

declare module 'cmdk' {
  import * as React from 'react';

  export interface CommandProps {
    children?: React.ReactNode;
    label?: string;
    shouldFilter?: boolean;
    filter?: (value: string, search: string) => boolean;
    value?: string;
    onValueChange?: (value: string) => void;
    loop?: boolean;
    className?: string;
    [key: string]: any;
  }

  export interface CommandInputProps {
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
    [key: string]: any;
  }

  export interface CommandListProps {
    children?: React.ReactNode;
    className?: string;
    [key: string]: any;
  }

  export interface CommandItemProps {
    children?: React.ReactNode;
    value?: string;
    onSelect?: (value: string) => void;
    disabled?: boolean;
    className?: string;
    [key: string]: any;
  }

  export interface CommandGroupProps {
    children?: React.ReactNode;
    heading?: React.ReactNode;
    className?: string;
    [key: string]: any;
  }

  export interface CommandSeparatorProps {
    className?: string;
    [key: string]: any;
  }

  export interface CommandEmptyProps {
    children?: React.ReactNode;
    className?: string;
    [key: string]: any;
  }

  export const Command: React.FC<CommandProps> & {
    Input: React.FC<CommandInputProps>;
    List: React.FC<CommandListProps>;
    Item: React.FC<CommandItemProps>;
    Group: React.FC<CommandGroupProps>;
    Separator: React.FC<CommandSeparatorProps>;
    Empty: React.FC<CommandEmptyProps>;
  };

  export default Command;
}
