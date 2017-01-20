var Coupon = function(id, amount_off, percent_off) {
	this.id = ko.observable(id);
	this.amount_off = amount_off != null ? ko.observable('$' + amount_off) : ko.observable();
	this.percent_off = percent_off != null ? ko.observable(percent_off + '%') : ko.observable();
};
 
