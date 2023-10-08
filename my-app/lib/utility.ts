//all utility functions

export function extractPrice(...elements: any) {
    for (const element of elements) {
        const priceText = element.text.trim();

        if (priceText) {
            const price = priceText.replace(/[^\d.]/g, ''); // removes all non-digits
            if (price) {
                return price;
            }
        }
    }
    return '';
}

export function extractCurrency(element: any) {
    
    const currencyText = element.text.trim().slice(0,1);
    return currencyText ? currencyText : '';
}