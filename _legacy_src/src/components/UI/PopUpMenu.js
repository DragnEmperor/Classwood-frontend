import React, {Fragment} from 'react'
import { Link } from 'react-router-dom';
import { Menu, Transition } from "@headlessui/react";
import VirticalDotsIcon from "../../assets/icons/VerticalDots";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

export default function PopUpMenu({menuList}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
    <div>
      <Menu.Button className="inline-flex justify-center w-full text-sm font-semibold text-gray-900 ">
        <VirticalDotsIcon className="w-6 h-6" />
      </Menu.Button>
    </div>

    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
            {menuList.map((listItem, index)=>{
                return (localStorage.getItem("UserType")==="Staff" && listItem.deleteType) ? undefined : <Menu.Item key={index}>
                {({ active }) => (
                  listItem.title!=="View Class Student" && listItem.title!=="View Attendence" ? <span
                    className={classNames(
                      active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700",
                        listItem.deleteType ? "text-red-400 border-t-[1px]" :"",
                      "block px-4 py-2 text-sm cursor-pointer"
                    )}
                    onClick={() => {
                        listItem.function()
                    }}
                  >
                    {listItem.title}
                  </span> : <Link
                  to={localStorage.getItem("UserType")==="School" ? "/school/students" : "/staff/students"}
                    className={classNames(
                      active
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700",
                      "block px-4 py-2 text-sm cursor-pointer"
                    )}
                    onClick={() => {
                        listItem.function()
                    }}
                  >
                    {listItem.title}
                  </Link>
                )}
              </Menu.Item>
            })}
         

          
          
        </div>
      </Menu.Items>
    </Transition>
  </Menu>
  )
}
