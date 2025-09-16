import React from 'react'

export default function SingleResultRow({result, totalScore}) {
  console.log("row", result);
  function fetchStudent(){

  }
  return (
    <div className="grid w-full grid-cols-3 p-2 py-4 font-semibold text-gray-800 bg-white border-b-2">
    <span>{result.student}</span>
    <span>{totalScore}</span>
    <span>{result.score}</span>
   
  </div>
  )
}
