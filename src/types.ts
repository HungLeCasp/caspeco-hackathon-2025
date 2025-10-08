import React from 'react';

export interface SearchResult {
  id: string | number;
  name?: string;
  type?: string;
  urlPath?: string;
  status?: string;
  category?: string;
  icon?: React.ReactNode;
  Name?: string; // API might return capitalized version
  Type?: string; // API might return capitalized version
  UrlPath?: string; // API might return capitalized version
}

export interface SearchOptions {
  timeout?: number;
  signal?: AbortSignal | null;
  isGetAll?: boolean;
}

export interface TableItem {
  id: string | number;
  icon: React.ReactNode;
  name: string;
  type: string;
  urlPath: string;
  status: string;
}

export type IconType = 
  | 'user' 
  | 'company' 
  | 'area' 
  | 'brand' 
  | 'checkout' 
  | 'location' 
  | 'organization';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DataTableProps {
  // Add any props if needed in the future
}

// Additional types for event handlers
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void;
export type KeyboardEventHandler = (event: React.KeyboardEvent<HTMLElement>) => void;
export type ChangeEventHandler = (event: React.ChangeEvent<HTMLInputElement>) => void;
