"use server"    //all code written here will run o
import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl : string) {
    if(!productUrl)  return;
    
    try {
        //scrap the product
        const scrapedProduct = await scrapeAmazonProduct(productUrl);
    } 
    catch (error: any) {
        throw new Error('Failed to create/update product: ${error.message}');
    }
}