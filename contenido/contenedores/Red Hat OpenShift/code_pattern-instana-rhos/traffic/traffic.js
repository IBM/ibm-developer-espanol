const puppeteer = require("puppeteer");
const fs = require("fs");

async function run () {
	const content = fs.readFileSync("./destination.json");
  	const destinations = JSON.parse(content);
    const browser = await puppeteer.launch( { headless: true } );
    const page = await browser.newPage();
    for (let i = 0; i < Number(process.argv[2]); i++) {
    	console.log("Destination Call: " + (i + 1));

    	// destination
	    let rand_dest = Math.floor(Math.random() * 181);
	    let city = destinations[rand_dest].city.toLowerCase().replace(" ", "-");
	    let country = destinations[rand_dest].country.toLowerCase().replace(" ", "-");
	    // dates
	    let from = new Date();
	    from.setDate(from.getDate() + 1); 
	    let fromDay = String(from.getDate()).padStart(2, '0');
	    let fromMonth = String(from.getMonth() + 1).padStart(2, '0'); //January is 0!
	    let fromYear = from.getFullYear();
	    let to = new Date();
	    to.setDate(from.getDate() + 7); 
	    let toDay = String(to.getDate()).padStart(2, '0');
	    let toMonth = String(to.getMonth() + 1).padStart(2, '0'); //January is 0!
	    let toYear = to.getFullYear();

	    let hotel = `/destinations/${country}/${city}?hdfrom=${fromYear}-${fromMonth}-${fromDay}&hdto=${toYear}-${toMonth}-${toDay}`;
	    let carrental = `/destinations/${country}/${city}/cars?cdfrom=${fromYear}-${fromMonth}-${fromDay}&cdto=${toYear}-${toMonth}-${toDay}`;
		console.log(hotel);
		await page.goto(process.argv[3] + hotel);
		await page.waitFor(1000);
		console.log(carrental);
		await page.goto(process.argv[3] + carrental);
		await page.waitFor(1000);
    }
    await page.goto(process.argv[3]);
    browser.close();
}
run();