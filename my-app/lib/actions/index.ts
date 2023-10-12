"use server"    //all code written here will run on server
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productUrl : string) {
    if(!productUrl)  return;
    
    try {
        connectToDB();
        //scrap the product
        const scrapedProduct = await scrapeAmazonProduct(productUrl);
        if(!scrapedProduct) return;

        let product = scrapedProduct;
        
    } 
    catch (error: any) {
        throw new Error('Failed to create/update product: ${error.message}');
    }
}