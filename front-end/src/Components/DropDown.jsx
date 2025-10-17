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

  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
        {selectedOption}
        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
      </MenuButton>

      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
        <div className="py-1">
          <MenuItem>
            {({ active }) => (
              <button
                onClick={() => handleSelect('All')}
                className={`${
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } block w-full text-left px-4 py-2 text-sm`}
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
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } block w-full text-left px-4 py-2 text-sm`}
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
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } block w-full text-left px-4 py-2 text-sm`}
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
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } block w-full text-left px-4 py-2 text-sm`}
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
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } block w-full text-left px-4 py-2 text-sm`}
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
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                } block w-full text-left px-4 py-2 text-sm`}
              >
                Emergency
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}