"use client"
import { scrapeAndStoreProduct } from '@/lib/actions';
import React from 'react'
import {FormEvent, useState} from 'react'

const isValidAmazonProductURL = (url:string) => {
  try{
    const paredURL = new URL(url);
    const hostname = paredURL.hostname;

    //Check for valid amazon link as if hostname ontains amazon.in or amazon.com
    if(
      hostname.includes('amazon.com') ||
      hostname.includes('amazon.') ||
      hostname.includes('amazon')
      ) 
      {  return true;  }
  } catch(error){
    return false;
  }
}

const Searchbar = () => {

  const [SearchPrompt, setSearchPrompt] = useState('')
  const [isLoading, setisLoading] = useState(false)

  const handlesubmt = async (event : FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const isValidLink = isValidAmazonProductURL(SearchPrompt);

    if(!isValidLink)  alert("Please provide a valid Amazon Product Link")
//Now since we have already checked for the valid amzon link
//we can proceed
    try{
      setisLoading(true);
      //Server in action
      //Creating functionality
      //Scraoing the data
      const product = await scrapeAndStoreProduct(SearchPrompt);

    }catch(error){
      console.log(error);
    }finally{
      setisLoading(false);
    }
  }

  return (
    <form 
        className='flex flex-wrap gap-4 mt-12'
        onSubmit={handlesubmt}
    >
        <input 
            type="text"
            value={SearchPrompt}
            onChange={(e)=>setSearchPrompt(e.target.value)}
            placeholder='Enter product link'
            className='searchbar-input'
        />

        <button 
          type="submit" 
          className="searchbar-btn"
          disabled = {SearchPrompt === ''}
        >
          {isLoading ? 'Searching' : 'Search'}
        </button>
        
    </form>
  )
}

export default Searchbar