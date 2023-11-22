const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');

puppeteer.use(pluginStealth());

async  function NSW (){
    const browser = await puppeteer.launch({headless:false});
    const page1 = await browser.newPage();

    await page1.goto('https://suppliers.buy.nsw.gov.au/opportunity/search?query=&categories=&types=Tenders');

    //finding the number of pages and page links
        await page1.waitForSelector('#search-results');
        // const pageLinks = await page1.evaluate(()=>Array.from(document.querySelector('#search-results > div:nth-child(3) > ul > li:nth-child(2)'),))
        await page1.click('#search-results > nav:nth-child(3) > .nsw-pagination > li:nth-child(2)');
        await page1.waitForNavigation()
        const page1Url = await page1.url();
        console.log("first page url : " , page1Url);
        

        let tempPageUrl = page1Url;
        let links = [];//tender links
        

            // navgating to the last page
            await page1.click('#search-results > nav:nth-child(3) > .nsw-pagination > li:nth-last-child(2) > a ');
            await page1.waitForNavigation();
            const lastPageUrl = await page1.url();
            console.log('last page url', lastPageUrl);

    //traversing to each page and collecting all tender links
        
        while(tempPageUrl!= lastPageUrl){

            const tempPage = await browser.newPage();
            await tempPage.goto(tempPageUrl);

            //scrapes the current page links
            const tempLinks = await tempPage.evaluate(()=>Array.from(document.querySelectorAll('#search-results > ul:nth-child(4) > li > div > a:nth-child(2)'),(e)=>e.href));
            links = links.concat(tempLinks);
            await tempPage.click('#search-results > nav:nth-child(3) > .nsw-pagination > li:last-child > a ');
            await tempPage.waitForNavigation()
            tempPageUrl = await tempPage.url();
            tempPage.close()
        }
        console.log(links);
        console.log("total tenders : ", links.length);
        

    //navigating inside each tender link and extracting tender data
        // for(const link of links){
        //     const page2 = await browser.newPage();
        //     await page2.goto(link);

        //         //extracting title

        //         //extracting agency

        //         //extracting atmID

        //         //extracting category

        //         //extracting location

        //         //extracting region

        //         //extracting idNumber

        //         //extracting publishedDate

        //         //extracting closingDate

        //         //extracting description

        //         //extracting link

        //         //extracting updatedDateTime





        // }


    browser.close();
}


NSW();