import React, {Fragment} from 'react'
import { Link } from 'react-router-dom';
import { Menu, Transition } from "@headlessui/react";
import { FiUser } from "react-icons/fi";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

export default function ProfilePopUpMenu({menuList}) {
  return (
    <Menu as="div" className="relative inline-block text-left">
    <div className='h-fit flex'>
      <Menu.Button className="inline-flex justify-center w-full text-sm font-semibold text-gray-900 ">
      <div className=" p-2 md:p-3 ml-2 bg-[#D9D9D9] rounded-full">
        <FiUser className="h-4 w-4 min-[480px]:h-6 min-[480px]:w-6  text-[#5F6368]" />       
        </div>
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
                return  <Menu.Item key={index}>
                {({ active }) => (
                  listItem.title!=="View Class Student" ? <span
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
