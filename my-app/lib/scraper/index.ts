import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractPrice, extractCurrency } from "../utility";

export async function scrapeAmazonProduct(url:string) {
    if(!url)    return;
    //curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_2334c692-zone-pricewise:fb2imh8hui99 -k https://lumtest.com/myip.json

    //Brightdata proxy configuration

    const userName = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000*Math.random()) |0;

    //with this options ibject we will make request to access data from Bright data
    
    const options = {
        auth : {
            username : '${userName}-session-${session_id}',
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
//This all needs to run. I have placed it inside comment 
        
        /*const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('.a-price.a-text-price'),
            $('span.a-offscreen'),
            $('#priceblock_ourprice'),                  // Main product price
            $('#priceblock_dealprice'),                 // Deal price (if available)
            $('.a-price span.a-offscreen'),             // Additional prices (e.g., used, new)
            $('#price_inside_buybox'),
            $('reinventPricePriceToPayMargin')
        );*/
     
        const images = 
          $('#imgBlkFront').attr('data-a-dynamic-image') ||
          $('#landingImage').attr('data-a-dynamic-image') ||
          '{}'

        const imageUrls = Object.keys(JSON.parse(images));
        console.log(response);
        //const currency = extractCurrency($('.a-price-symbol'))
        //const discountRate = $('.savingsPercentage,').text().replace(/[-%]/g, "");
        console.log({title, images});
        //console.log({currency});
        //console.log({currentPrice});
        //console.log({discountRate});  
        

    } 
    catch (error: any) {
        throw new Error('Failed to scrape product : ${error.message}')
    }
}