import reader from "xlsx"
import fetch from "node-fetch"

//Reading and making a seperate data url 
//json array from given excel file

const file = reader.readFile('./ZoeyOrignal.xlsx')
	

// const url = "https://api.wappalyzer.com/v2/lookup/?url=https://www.ritukumar.com/"
const options = {
	headers: {
		"x-api-key": "sfeoQRRJPz5XGXhirfs9v4WGyULh48uI1yhJWSCf" 
	}
}
  const finalArray = []


	// constants

	const WOOCOMMERCE = 'WOOCOMMERCE'
	const SHOPIFY = 'SHOPIFY'
	const BIGCOMMERCE = 'BIGCOMMERCE'
	const MAGENTO = 'MAGENTO'
	const OTHERS = 'OTHERS'
	const NOT_WORKING = 'NOT_WORKING'


	function calldata(urlArray , index){
		let flag = true;
		let flag_to_check_working = false;
		if(index == urlArray.length){
			console.log("I am here")
			const temp1 = reader.utils.sheet_to_json(
				file.Sheets[file.SheetNames[0]])
				temp1.forEach((res, index) => {
					res['Category'] = finalArray[index]
				})
				console.log(temp1);

			const ws = reader.utils.json_to_sheet(temp1)
			const wb = reader.utils.book_new()
			reader.utils.book_append_sheet(wb, ws, 'Responses')
			reader.writeFile(wb, './ZoeyOrignal.xlsx')
			return;
				}
				console.log(urlArray[index]);
				let url = `https://api.wappalyzer.com/v2/lookup/?url=${urlArray[index]}`
				fetch(url, options).then((data)=>{
					const finalData = data.json()
					finalData.then((d)=>{
						 d[0].technologies?.forEach(element => {
							flag_to_check_working = true;
							 if(element.slug === "shopify" || element.slug === "woocommerce" || element.slug === "magento" || element.slug === "bigcommerce"){
								flag = false;
								 if(element.name == 'WooCommerce') finalArray.push(WOOCOMMERCE)
								 else if(element.name == 'Shopify') finalArray.push(SHOPIFY)
								 else if(element.name == 'BigCommerce') finalArray.push(BIGCOMMERCE)
								 else if(element.name == 'Magento') finalArray.push(MAGENTO)
								}
							})
						}).then((d)=>{
							if(!flag_to_check_working){
								finalArray.push(NOT_WORKING)
							}
							if(flag_to_check_working && flag){
								finalArray.push(OTHERS)
							}

						index++;
						calldata(urlArray, index);
					})
				})
			}
	
			let dataUrl = []
			let index = 0;
			const temp = reader.utils.sheet_to_json(
				file.Sheets[file.SheetNames[0]])
			temp.forEach((res) => {
				dataUrl.push(res)
			})

			let res = dataUrl.map(function(item) {
				return Object.values(item);
			});
			let urlArray = [].concat(...res)
			calldata(urlArray, index);


			// const temp1 = reader.utils.sheet_to_json(
			// 	file.Sheets[file.SheetNames[0]])
			// 	console.log(temp1);
			// temp1.forEach((res, index) => {
			// 	 res['Category'] = dataUrlsss[index]
			// 	})

			// const ws = reader.utils.json_to_sheet(temp1)
			// const wb = reader.utils.book_new()
			// reader.utils.book_append_sheet(wb, ws, 'Responses')
			// reader.writeFile(wb, './ZoeyOrignal.xlsx')