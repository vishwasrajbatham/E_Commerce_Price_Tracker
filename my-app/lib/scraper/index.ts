import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractPrice } from '../utility';

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

        //Extract the product title
        const title = $('#productTitle').text().trim();
        const currentPrice = extractPrice(
            $('.priceToPay span .a-price-whole'),
            $('a.size.base .a-color-price'),
            $('a-button-selected .a-color-base'),
        );

        console.log({title, currentPrice});

    } 
    catch (error: any) {
        throw new Error('Failed to scrape product : ${error.message}')
    }
}