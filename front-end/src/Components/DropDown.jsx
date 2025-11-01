import { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function DropDowns({ onFilterChange }) {
  const [selectedOption, setSelectedOption] = useState('Filter By');

  const handleSelect = (option) => {
    setSelectedOption(option);
    if (onFilterChange) {
      onFilterChange(option);
    }
  };

  const handleClearFilter = () => {
    setSelectedOption('Filter By');
    if (onFilterChange) {
      onFilterChange('All');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Menu as="div" className="relative inline-block text-left">
        <div className="flex items-center gap-2">
          <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
            {selectedOption}
            <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400 transition-transform duration-200" />
          </MenuButton>
          
          {selectedOption !== 'Filter By' && (
            <button 
              onClick={handleClearFilter}
              className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 transition-all duration-200"
              title="Clear filter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <MenuItems 
          transition
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div className="py-1">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => handleSelect('All')}
                  className={`${
                    active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  } block w-full text-left px-4 py-2 text-sm transition-colors duration-150`}
                >
                  All
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => handleSelect('Academic')}
                  className={`${
                    active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  } block w-full text-left px-4 py-2 text-sm transition-colors duration-150`}
                >
                  Academic
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => handleSelect('Event')}
                  className={`${
                    active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  } block w-full text-left px-4 py-2 text-sm transition-colors duration-150`}
                >
                  Event
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => handleSelect('Finance')}
                  className={`${
                    active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  } block w-full text-left px-4 py-2 text-sm transition-colors duration-150`}
                >
                  Finance
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => handleSelect('System')}
                  className={`${
                    active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  } block w-full text-left px-4 py-2 text-sm transition-colors duration-150`}
                >
                  System
                </button>
              )}
            </MenuItem>
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={() => handleSelect('Emergency')}
                  className={`${
                    active ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  } block w-full text-left px-4 py-2 text-sm transition-colors duration-150`}
                >
                  Emergency
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    </div>
  );
}