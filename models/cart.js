module.exports = function Cart(oldCart){
	//Khởi tạo(rỗng)
	this.items = oldCart.items || {};
	this.totalQty = oldCart.totalQty || 0;
	this.totalPrice = oldCart.totalPrice || 0;
	
	//check
	this.add = function(item, id){
		var storedItem = this.items[id];
		
		//Nếu chưa có sp thì tạo mới
		if(!storedItem){
			storedItem = this.items[id] = {item:item, qty: 0, price: 0};
		}
		//Ngược lại
		storedItem.qty++;
		storedItem.price = storedItem.item.price * storedItem.qty;
		this.totalQty++;
		this.totalPrice += storedItem.price;
	};
	
	//List
	this.generateArray = function(){
		var arr = [];
		for(var id in this.items){
			arr.push(this.items[id]);
		}
		return arr;
	}
}