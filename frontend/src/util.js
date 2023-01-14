export const getError = (error) => {
	return error.response && error.response.data.message
		? error.response.data.message
		: error.message;
};

export const createFormData = (formData, productInfo) => {
	productInfo.imageFiles.forEach((file) =>
		formData.append('imageFiles[]', file)
	);
	formData.append('itemName', productInfo.itemName);
	formData.append('itemPrice', productInfo.itemPrice);
	formData.append('itemCategory', productInfo.itemCategory);
	formData.append('itemDescription', productInfo.itemDescription);
	formData.append('itemCount', productInfo.itemCount);
	const indexArr = new Array(productInfo.itemImages.length).fill(null);
	for (let i = 0; i < productInfo.itemImages.length; i++) {
		const curr = productInfo.itemImages[i];
		if (curr.startsWith('blob')) {
			const ind = productInfo.imageFiles.findIndex((file) => file.src === curr);
			indexArr[i] = ind;
		}
	}
	productInfo.itemImages.forEach((img) => formData.append('itemImages[]', img));
	indexArr.forEach((i) => formData.append('itemIndices[]', i));
};
