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
        

    // navigating inside each tender link and extracting tender data
        //intializing an array to store scraped data
        let scrapedData = [];
        let finTenders = 1;// counter for scraped tenders

        let count =0;
        for(const elm of links){

            count++;
            if(count == 5){
                break;
            }
            const page2 = await browser.newPage();
            await page2.goto(elm);
            await page2.waitForSelector('.main')

            //extracting title
            let title = "";
            try{
                title = await page2.evaluate(()=>{
        
                    let titleElement = document.querySelector('.main > .headline > .container > h1').innerText;
                    titleElement ? titleElement = titleElement.split("-"): titleElement = "";
                    return titleElement[0];
        
                })
            }catch(error){
                console.log(error);
            }
        

            //extracting agency
            let agency = "";
            try{
                agency = await page2.evaluate(()=>{
                    let agencyElement = document.querySelector('#main-content > .row > div:nth-child(1) > .info > div:nth-child(6) > span:nth-child(2)').innerText;
                    return agencyElement;
                })
            }catch(error){
                    console.log(error);
            }

            //extracting atmID

            let atmId = "";
            try{
                atmId = await page2.evaluate(()=>{
                    let atmIdElement = document.querySelector('#main-content > .row > div:nth-child(1) > .info > div:nth-child(1) > span:nth-child(2)').innerText;
                    return atmIdElement;
                })
            }catch(error){
                    console.log(error);
            }
        

            //extracting category

            let category = "";
            try{
                category = await page2.evaluate(()=>{
                
                    let categoryElment = document.querySelector('#main-content > .row > div:nth-child(1) > .info > #RFT-SB-Agency > span:nth-child(2)').innerText;
                    // categoryElment ? categoryElment = categoryElment.replace(/\n+/g,"\n"): categoryElment = ""
                    return categoryElment;
                })
            }catch(error){
                console.log(error);
            } 

            //extracting location
            let location = ["AUS"];
            
            //extracting region
            let region = ['not specified']
            try{
                const tempRegion = await page2.evaluate(()=>{
                    let regionElement = document.querySelector('#main-content > .row > div:nth-child(2) > div > div > div:nth-child(2) > div').innerText;
                    if (regionElement == 'Refer to Additional Details / Instructions') {
                        regionElement = [""];
                    } else {
                          regionElement = regionElement.split(",");
                      }
                      
                    return regionElement
                    
                })
                if(tempRegion !== ""){
                    region.pop();
                    region = region.concat(tempRegion);
                }
                else{
                    region = ['not specified'];
                }
            }catch(error){
                console.log(error);
            }

            //extracting idNumber
            let idNumber = "";
            try{
                idNumber = await page2.evaluate(()=>{
                    let idNumberElement = document.querySelector('#main-content > .row > div:nth-child(1) > .info > div:nth-child(1) > span:nth-child(2)').innerText;
                    return idNumberElement;
                })
            }catch(error){
                console.log(error);
            }

                

            //extracting publishedDate
            let publishedDate = "No date found";
            try{
                publishedDate = await page2.evaluate(()=>{
                    let publishedDateElement = document.querySelector('#main-content > .row > div:nth-child(1) > .info > div:nth-child(3) > span:nth-child(2)').innerText;
                    if(publishedDateElement == null){
                        publishedDateElement = "No date found";
                    }
                    else{
                        publishedDateElement = publishedDateElement.replace(/-/g," ")
                    }
                    return publishedDateElement;  
                });
            }catch(error){
                console.log(error);
            }

            //extracting closingDate
            let closingDate = "No date found";
            try{
                closingDate = await page2.evaluate(()=>{
                    let closingDateElement = document.querySelector('#main-content > .row > div:nth-child(1) > .info > div:nth-child(4) > span:nth-child(2)').innerText;
                    if(closingDateElement == null){
                        closingDateElement = "No date found";
                    }
                    else{
                        closingDateElement = closingDateElement.split(' ');
                        closingDateElement = closingDateElement[0].replace(/-/g," ")
                    }
                    return closingDateElement;  
                });
            }catch(error){
                console.log(error);
            }



            //extracting description
            let description = "";
            try{
                description = await page2.evaluate(()=>{
                    let descriptionElement = document.querySelector('#main-content > .row > div:nth-child(2) > div > div > div:nth-child(1) > div ').innerText;
                    descriptionElement ? descriptionElement = descriptionElement.replace(/\n+/g,"\n").replace(/\n+/g,""): descriptionElement="";
                    descriptionElement = (descriptionElement === "No" || descriptionElement === "Yes") ? "" : descriptionElement;
                    return descriptionElement;
                })
            }catch(error){
                console.log(error);
            }

            //extracting link
            const link = elm;

            //extracting updatedDateTime
            const updatedDateTime = "No date found"


            //pushing the scraped data
            scrapedData.push({
                title,
                agency,
                atmId,
                category,
                location,
                region,
                idNumber,
                publishedDate,
                closingDate,
                description,
                link,
                updatedDateTime,
            });

            page2.close();

            console.log(`scraping tenders ${finTenders}`);
            finTenders++;


        }

        console.log(scrapedData);


    browser.close();
}


NSW();