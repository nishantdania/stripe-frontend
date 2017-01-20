var CouponsViewModel = function() {
	self = this;
	this.message = ko.observable();

	this.coupons = ko.observableArray([]);

	this.id = ko.observable();
	this.percent_off = ko.observable();
	this.amount_off = ko.observable();
	this.max_redemptions = ko.observable();
	this.duration_in_months = ko.observable();
	this.redeem_by = ko.observable();
	var Duration = function(text, value) {
		this.durationType = text;
		this.durationValue = value;
	};
	self.duration = ko.observableArray([
		new Duration('once', 'once'),
		new Duration('forever', 'forever'),
		new Duration('multi-month', 'repeating')
	]);
	self.selectedDuration = ko.observable(self.duration[0]);

	this.updateCoupons = function(data) {
		self.coupons([]);
		data.forEach(function(item) {
			var coupon = new Coupon(item.id, item.amount_off, item.percent_off);
			self.coupons.push(coupon);
		});
	}

	this.pageLoad = function() {
		if(localStorage.getItem("token") !== null) {
			var authToken = 'Bearer ' + localStorage.getItem("token");
			$.ajax({
				method:'GET',
				beforeSend: function(request) {
					request.setRequestHeader("Authorization", authToken);
				},
				url: 'http://localhost:1337/api/userCoupons/',
				crossDomain: true,
				success: function(returnedData) 
				{ 
					self.updateCoupons(returnedData.coupons.data);
					console.log(returnedData.coupons.data);
				},
				error: function() { 
					localStorage.removeItem("token");	
					window.location.replace("http://localhost:3000/");
				 }
			});
		}
		else {
			window.location.replace("http://localhost:3000/");
		}
	}
	this.pageLoad();

	ko.bindingHandlers.datePicker = {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel) {                    
			ko.utils.registerEventHandler(element, "change", function () {            
				var value = valueAccessor();
				value(new Date(element.value));            
			  });
		  },
		update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
			var value =  valueAccessor();        
			element.value = value().toISOString();
		}
	};	

	this.handleCreateCoupon = function() {
		var authToken = 'Bearer ' + localStorage.getItem("token");
		var data = {};
		this.coupon = {};
		this.coupon.id = this.id();
		if(this.percent_off() != undefined && this.percent_off() != '')
			this.coupon.percent_off = this.percent_off();
		if(this.amount_off() != undefined && this.amount_off() != '')
			this.coupon.amount_off = this.amount_off();
		this.coupon.max_redemptions = this.max_redemptions();
		this.coupon.duration_in_months = this.duration_in_months();
		if(this.redeem_by())
			this.coupon.redeem_by = parseInt((new Date(this.redeem_by()).getTime() / 1000).toFixed(0));
		this.coupon.duration = this.selectedDuration().durationValue;
		this.coupon.currency = 'usd';
		data.coupon = this.coupon;
		$.ajax({
			method:'POST',
			url: 'http://localhost:1337/api/addCoupon/',
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", authToken);
			},
			data: JSON.stringify(data),
			crossDomain: true,
			dataType: 'json',
			contentType: 'json',
			success: function(returnedData) 
			{ 
				self.pageLoad();
			},
			error: function(returnedData) { 
				var error =  returnedData.responseJSON.err.param ? returnedData.responseJSON.err.message.toString() + returnedData.responseJSON.err.param.toString(): returnedData.responseJSON.err.message.toString();
				self.message(error);
				$("#message").show().delay(5000).fadeOut();
			 }
		});
	};

	this.removeCoupon = function() {
		var authToken = 'Bearer ' + localStorage.getItem("token");
		var data = {};
		data.id = this.id();
		var that = this;
		$.ajax({
			method:'POST',
			url: 'http://localhost:1337/api/removeCoupon/',
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", authToken);
			},
			data: JSON.stringify(data),
			crossDomain: true,
			dataType: 'json',
			contentType: 'json',
			success: function(returnedData) 
			{ 
				self.coupons.remove(that);
				console.log(self.coupons());
			},
			error: function(returnedData) { 
				alert('An error occurred');
			 }
		});
	}
};
 
ko.applyBindings(new CouponsViewModel());
