// src/components/ui/Select.tsx
import React from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, Check, Search, X } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  leftIcon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    label, 
    error, 
    helperText,
    options, 
    placeholder = "Seleccionar...",
    size = 'md',
    variant = 'default',
    leftIcon,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasError = !!error;
    const hasLeftIcon = !!leftIcon;

    const variantClasses = {
      default: 'border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700',
      filled: 'border-0 bg-gray-100 dark:bg-gray-700',
      outlined: 'border-2 border-gray-300 bg-transparent dark:border-gray-600'
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base'
    };

    const focusClasses = {
      default: 'focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
      filled: 'focus:ring-2 focus:ring-blue-500',
      outlined: 'focus:border-blue-500 focus:ring-0'
    };

    const errorClasses = hasError 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600' 
      : '';

    // Group options by group property
    const groupedOptions = React.useMemo(() => {
      const groups: { [key: string]: SelectOption[] } = {};
      const ungrouped: SelectOption[] = [];

      options.forEach(option => {
        if (option.group) {
          if (!groups[option.group]) {
            groups[option.group] = [];
          }
          groups[option.group].push(option);
        } else {
          ungrouped.push(option);
        }
      });

      return { groups, ungrouped };
    }, [options]);

    return (
      <div className="space-y-1">
        {/* Label */}
        {label && (
          <label 
            className={cn(
              "block text-sm font-medium transition-colors",
              hasError 
                ? "text-red-700 dark:text-red-400" 
                : "text-gray-700 dark:text-gray-300",
              isFocused && !hasError && "text-blue-600 dark:text-blue-400"
            )}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div className="relative">
          {/* Left Icon */}
          {hasLeftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <div className={cn(
                "transition-colors",
                hasError 
                  ? "text-red-400" 
                  : isFocused 
                    ? "text-blue-500" 
                    : "text-gray-400"
              )}>
                {leftIcon}
              </div>
            </div>
          )}

          {/* Select Field */}
          <select
            ref={ref}
            className={cn(
              "w-full rounded-lg transition-all duration-200 text-gray-900 dark:text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer",
              variantClasses[variant],
              sizeClasses[size],
              focusClasses[variant],
              errorClasses,
              hasLeftIcon && "pl-10",
              "pr-10", // Always add right padding for chevron
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          >
            {/* Placeholder */}
            {placeholder && (
              <option value="" disabled className="text-gray-500">
                {placeholder}
              </option>
            )}

            {/* Ungrouped Options */}
            {groupedOptions.ungrouped.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
                className="text-gray-900 dark:text-white"
              >
                {option.label}
              </option>
            ))}

            {/* Grouped Options */}
            {Object.entries(groupedOptions.groups).map(([groupName, groupOptions]) => (
              <optgroup key={groupName} label={groupName}>
                {groupOptions.map((option) => (
                  <option 
                    key={option.value} 
                    value={option.value}
                    disabled={option.disabled}
                    className="text-gray-900 dark:text-white"
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          {/* Chevron Icon */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className={cn(
              "h-4 w-4 transition-colors",
              hasError 
                ? "text-red-400" 
                : isFocused 
                  ? "text-blue-500" 
                  : "text-gray-400"
            )} />
          </div>
        </div>

        {/* Helper Text or Error */}
        {(error || helperText) && (
          <div className="space-y-1">
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                {error}
              </p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Multi-Select Component (Custom Implementation)
interface MultiSelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  searchable?: boolean;
  maxDisplay?: number;
  disabled?: boolean;
  required?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  error,
  helperText,
  options,
  value = [],
  onChange,
  placeholder = "Seleccionar opciones...",
  size = 'md',
  variant = 'default',
  searchable = false,
  maxDisplay = 3,
  disabled = false,
  required = false
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const hasError = !!error;

  // Filter options based on search term
  const filteredOptions = React.useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (optionValue: string) => {
    if (disabled) return;
    
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    onChange(newValue);
  };

  const handleRemoveOption = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(value.filter(v => v !== optionValue));
  };

  const getSelectedLabels = () => {
    return value.map(v => options.find(opt => opt.value === v)?.label || v);
  };

  const selectedLabels = getSelectedLabels();
  const displayText = selectedLabels.length === 0 
    ? placeholder 
    : selectedLabels.length <= maxDisplay
      ? selectedLabels.join(', ')
      : `${selectedLabels.slice(0, maxDisplay).join(', ')} +${selectedLabels.length - maxDisplay}`;

  const variantClasses = {
    default: 'border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700',
    filled: 'border-0 bg-gray-100 dark:bg-gray-700',
    outlined: 'border-2 border-gray-300 bg-transparent dark:border-gray-600'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const errorClasses = hasError 
    ? 'border-red-300 focus-within:border-red-500 focus-within:ring-red-500 dark:border-red-600' 
    : 'focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500';

  return (
    <div className="space-y-1">
      {/* Label */}
      {label && (
        <label 
          className={cn(
            "block text-sm font-medium transition-colors",
            hasError 
              ? "text-red-700 dark:text-red-400" 
              : "text-gray-700 dark:text-gray-300",
            isFocused && !hasError && "text-blue-600 dark:text-blue-400"
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Multi-Select Container */}
      <div className="relative" ref={containerRef}>
        <div
          className={cn(
            "w-full rounded-lg transition-all duration-200 cursor-pointer",
            variantClasses[variant],
            sizeClasses[size],
            errorClasses,
            disabled && "opacity-50 cursor-not-allowed",
            "min-h-[2.5rem] flex items-center justify-between"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
        >
          <div className="flex-1 flex flex-wrap gap-1">
            {value.length === 0 ? (
              <span className="text-gray-500 dark:text-gray-400">{placeholder}</span>
            ) : (
              <span className="text-gray-900 dark:text-white truncate">
                {displayText}
              </span>
            )}
          </div>
          
          <ChevronDown className={cn(
            "h-4 w-4 ml-2 transition-transform",
            isOpen && "rotate-180",
            hasError ? "text-red-400" : "text-gray-400"
          )} />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Buscar opciones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            )}

            {/* Options */}
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No se encontraron opciones
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      className={cn(
                        "flex items-center px-3 py-2 cursor-pointer transition-colors",
                        option.disabled 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-700",
                        isSelected && "bg-blue-50 dark:bg-blue-900/20"
                      )}
                      onClick={() => !option.disabled && handleToggleOption(option.value)}
                    >
                      <div className="flex items-center justify-center w-4 h-4 mr-3">
                        {isSelected && (
                          <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <span className="flex-1 text-sm text-gray-900 dark:text-white">
                        {option.label}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Selected Items Tags */}
      {value.length > 0 && value.length <= 5 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {value.map((selectedValue) => {
            const option = options.find(opt => opt.value === selectedValue);
            return option ? (
              <span
                key={selectedValue}
                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md"
              >
                {option.label}
                <button
                  type="button"
                  onClick={(e) => handleRemoveOption(selectedValue, e)}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}

      {/* Helper Text or Error */}
      {(error || helperText) && (
        <div className="space-y-1">
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
              <span className="inline-block w-1 h-1 bg-red-500 rounded-full mr-2"></span>
              {error}
            </p>
          )}
          {helperText && !error && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {helperText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};