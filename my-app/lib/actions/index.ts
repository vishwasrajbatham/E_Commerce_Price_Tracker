"use server"    //all code written here will run on server
import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utility";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

export async function scrapeAndStoreProduct(productUrl : string) {
    if(!productUrl)  return;
    
    try {
        connectToDB();
        const scrapedProduct = await scrapeAmazonProduct(productUrl);
        if(!scrapedProduct) return;

        let product = scrapedProduct;
       
        const existingProduct = await Product.findOne({url: scrapedProduct.url});
        if(existingProduct){
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory,
                {price:scrapedProduct.currentPrice}  
            ]

            product = {
                ...scrapedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
            }
        }

        const newProduct = await Product.findOneAndUpdate(
            {url: scrapedProduct.url},
            product,
            {upsert: true, new: true}
        );
        //need to revalidate the path
        revalidatePath(`/products/${newProduct._id}`)
    } 
    catch (error: any) {
        throw new Error(`Failed to create/update product: ${error.message}`);
    }
}

export async function getProductById(productId: string){
    try {
        connectToDB();
        const product = await Product.findOne({_id:productId});
        if(!product)    return null;
        return product;
    } 
    catch (error) {
        console.log(error);
    }
}

export async function getAllProducts(){
    try {
        connectToDB();
        const products = await Product.find();
        return products;
    } 
    catch (error) {
        console.log(error);
    }
}

export async function getSimilarProducts(productId: string){
    try {
        //here we need to connect to databse again because this connection happedns
        //independent of the function so that the load on the server doesnt increase too much
        connectToDB();
        const product = await Product.findOne({_id:productId});
        if(!product)    return null;
        return product;
    } 
    catch (error) {
        console.log(error);
    }
}

export async function addUserEmailToProduct(productId:string, userEmail:string) {
    try {
        const product = await Product.findById(productId);
        if(!productId) return;

        const userExists = product.users.some((user: User) =>
            user.email === userEmail
        );

        if(!userExists){
            product.users.push({email: userEmail});
            await product.save();
            const emailContent = await generateEmailBody(product, "WELCOME"); 

            await sendEmail(emailContent, [userEmail]);
        }
    } 
    catch (error) {
        console.log(error);
    }    
}