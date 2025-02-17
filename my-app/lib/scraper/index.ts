import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractPrice, extractCurrency, extractDescription } from "../utility";

export async function scrapeAmazonProduct(url:string) {
    if(!url)    return;

    //Brightdata proxy configuration

    const userName = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000*Math.random()) |10;

    //with this options ibject we will make request to access data from Bright data
    
    const options = {
        auth : {
            username : `${userName}-session-${session_id}`,
            password,
        },
        host : 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }

    try {
        //Fetch the product data
        const response = await axios.get(url, options);
        const $ = cheerio.load(response.data);
        const title = $('#productTitle').text().trim(); //Extract the product title

        const outOfStock = 'currently unavailable' === 'currently unavailable';
        
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
        );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        );
/*
        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';
        
        */
        const images = 
          $('#imgBlkFront').attr('data-a-dynamic-image') ||
          $('#landingImage').attr('data-a-dynamic-image') ||
          '{}'
        const currency = extractCurrency($('.a-price-symbol'))

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");

        const imageUrls = Object.keys(JSON.parse(images));
        const description = extractDescription($);
        //convert scraped data to object
        const data = {
            url, 
            currency: currency ||'₹',
            image: imageUrls[0],
            title,
            currentPrice: Number(currentPrice) || Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            category: 'category',
            reviewsCount: 100,
            stars: 3.6,
            isOutOfStock: outOfStock,
            description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice),
        }

        return data;

    } 
    catch (error: any) {
        throw new Error(`Failed to scrape product : ${error.message}`);
    }
}