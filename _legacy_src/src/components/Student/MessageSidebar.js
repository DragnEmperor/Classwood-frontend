import React,{useState} from 'react'

export default function MessageSidebar({selectedChat, setSelectedChat, chatList}) {
  return (
    <div className={`cursor-pointer flex-row flex-shrink-0 ${selectedChat=== -1 ? "flex w-full":"hidden"} p-4 bg-gray-100 lg:flex lg:w-96`}>
      
    <div className="flex flex-col w-full h-full py-4 pl-4 pr-4 -mr-4">
      <div className="flex flex-row items-center">
        <div className="flex flex-row items-center">
          <div className="text-xl font-semibold">Messages</div>
          <div className="flex items-center justify-center w-5 h-5 ml-2 text-xs font-medium text-white bg-red-500 rounded-full">5</div>
        </div>
        <div className="ml-auto">
          <button className="flex items-center justify-center text-gray-500 bg-gray-200 rounded-full h-7 w-7">
            <svg className="w-4 h-4 strokeLcurrent"
                 fill="none"
                 stroke="currentColor"
                 viewBox="0 0 24 24"
                 xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>
      </div>
     
      
      <div className="mt-2">
        <div className="flex flex-col -mx-4">
          {chatList.map((chat,index)=>{
            
              return <div key={index} className={`relative flex flex-row items-center p-4 ${selectedChat===index?"bg-gray-200":undefined}`  } onClick={()=>setSelectedChat(index)}>
              <div className="absolute top-0 right-0 mt-3 mr-4 text-xs text-gray-500">5 min</div>
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-bold text-pink-300 bg-pink-500 rounded-full">
                {chat.icon}
              </div>
              <div className="flex flex-col flex-grow ml-3">
                <div className="text-sm font-medium">{chat.name}</div>
                <div className="w-40 text-xs truncate">{chat.desc}</div>
              </div>
              <div className="self-end flex-shrink-0 mb-1 ml-2">
                <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">5</span>
              </div>
            </div>
          })}
          
        </div>
      </div>
     
    
    </div>
  </div>
  )
}
