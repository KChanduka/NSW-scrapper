const puppeteer = require('puppeteer-extra');
const pluginStealth = require('puppeteer-extra-plugin-stealth');


puppeteer.use(pluginStealth ());

async function test(){
    const browser = await puppeteer.launch({headless: false});
    const page2 = await browser.newPage();

    await page2.goto('https://www.tenders.nsw.gov.au/doe/?event=public.rft.show&RFTUUID=07C58408-E1E3-D24C-192147BCFBF4AB9F');
    // await page2.goto('https://www.tenders.nsw.gov.au/?event=public.rft.show&RFTUUID=1A9E3C0D-D2FA-2FE1-4AFFE04897D7595E');

    await page2.screenshot({path:'first.png' , fullPage: true});

    


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

    console.log(title);


    let agency = "";
    try{
        agency = await page2.evaluate(()=>{
            let agencyElement = document.querySelector('#main-content > .row > div:nth-child(1) > .info > div:nth-child(6) > span:nth-child(2)').innerText;
            return agencyElement;
        })
    }catch(error){
            console.log(error);
    }

    console.log(agency);


    let atmId = "";
    try{
        atmId = await page2.evaluate(()=>{
            let atmIdElement = document.querySelector('#main-content > .row > div:nth-child(1) > .info > div:nth-child(1) > span:nth-child(2)').innerText;
            return atmIdElement;
        })
    }catch(error){
            console.log(error);
    }

    console.log(atmId)


    let category = "";
    try{
        category = await page2.evaluate(()=>{
        
            let categoryElment = document.querySelector('#main-content > .row > div:nth-child(1) > .info > div:nth-child(5) > span:nth-child(2)').innerText;
            // categoryElment ? categoryElment = categoryElment.replace(/\n+/g,"\n"): categoryElment = ""
            return categoryElment;
        })
    }catch(error){
        console.log(error);
    } 

    console.log('category : ',category);


    let location = ["NSW"];


    console.log("location : ",location)

    
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
        region = region.concat(tempRegion);
    }catch(error){
        console.log(error);
    }

    console.log('region : ', region);

    let idNumber = "";
    try{
        idNumber = await page2.evaluate(()=>{
            let idNumberElement = document.querySelector('#main-content > .row > div:nth-child(1) > .info > div:nth-child(1) > span:nth-child(2)').innerText;
            return idNumberElement;
        })
    }catch(error){
        console.log(error);
    }

    console.log("id Number : ",idNumber);

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
    console.log("publishedDate:",publishedDate);

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

    console.log('closingDate :',closingDate);


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

    console.log('description : ',description);

    browser.close();

}

test();