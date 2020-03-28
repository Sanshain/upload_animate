dom = document;
dom.get = document.querySelector;

// import on base

// assign here that its using:
// using call_error

//- using call_error
call_error = {
	connection : function(sender){
		
		var erLogger = document.createElement('div');
		erLogger.className = "upload_error";
		erLogger.innerText = "Не удалось получить данные с сервера";

		if (sender.nextSibling){

			sender.parentNode.insertBefore(erLogger, sender.nextSibling);
		}
		else sender.parentNode.appendChild(erLogger);

		// alert('Error connection. If you want refresh page, click here or turn around');
		
		return false;
	}
}


window.onload = function(){
	
	// find all upload buttons on page ( for this sample just one )
	var upload_buttons = document.querySelectorAll('.upload'); // or by [data-append_to]
	
	// set onclick event the func of upload_animate
	for (var i=0;i<upload_buttons.length;i++) upload_buttons[i].onclick = uploadAnimation;
	
}

// test:
// var data = null;
var page_index = 0;

/*! Function for generate demo fields (with demo data). 

	imitation for real page request by AJAX
*/
function ___getPage(uploader){
	
	setTimeout(function(){
		
		/// Create Demo Elements for new page:
		var page = document.createElement('div');
		page.id = "page_container_" + ++page_index;
		var _sec_items = dom.querySelectorAll('.container');
		
		for (var i=0;i<5;i++){
			
			var item = _sec_items[i].cloneNode(true);			
			page.appendChild(item);			
			item.innerText = i;
		}
		
		uploader.data = page;	
		
	}, 4000);	
}





uploadAnimation.prototype = {
	startTimeOut : 4000,
	timeOut : 1000,
	attemptLot : 5,
	finishScroll : 3,
	styleClass : {
		container : 'await_animate',
		content : 'circle'
	}
}
function uploadAnimation(event, clback) {
	
	if (!(this instanceof uploadAnimation)) {
		
		var _animation = new uploadAnimation(event, clback);
		
		return;
	}
	
	var self = this;
	this.responseData = null;									// ?
	
	___getPage(self);

	
	/*! Start animation for clicked element
		Главный метод: он запускает анимацию и 	

		@param:
			event - event or object containing `target` property specified on clicked HTML element
			clback - optional argument for callback if the func called by user code (no event) by proxy func
	*/
	this.uploadAnimate = function(event, clback){

		this.sender = event.target;									// the clicked button		

		// var tgt = sender.dataset['_refresh']; 			//       sender.dataset['append_to'] ||
		// tgt - нужен будет, если будет надо вставить не перед кнопкой, а в др месте 
		// (введем по мере необходимости) tgt = sender.parentElement

		this.sender.scrollIntoView(true);   				// scroll to full bottom view before animation	
		this.sender.style.opacity = '0.5'; 					// slow hiding: unnecessary (this animate has be perform by `page_leaser`)  
		this.sender.onclick = null;							// disable onclick
		
		var sender_height = append_friends.offsetHeight;	// sender_height for to set block height in _InitialAnimation
		
		var pages_panel = dom.get('.pages');				// get page_panel								
		pages_panel.style.opacity = '0';					// slow hide
		
		var bottomMoreButton = this.sender.cloneNode(true); // new `MoreButton` for appearance after animation
		
		setTimeout(function(){
			

			self._StartAnimation(pages_panel, bottomMoreButton, sender_height, clback);
			
		},250);
		
		var attempts = 0;
		

		setTimeout(function wait_contant(){ 
		
			var backUpValue = self.sender.innerText;			
			
			if (!self.data && attempts++ < self.attemptLot){

				self.sender.innerText = "Попытка № " + attempts;
				setTimeout(wait_contant, self.timeOut);					// recursive wait_contant

				return;
			}
			else if(!self.data && attempts>=self.attemptLot) {
						
				self.sender.innerText = "Попробовать еще";					
				_HideAnimation();

				return call_error['connection'](self.sender);			// error on no-data
			}
			else {

				self.sender.innerText = backUpValue;		
				contentReceived(bottomMoreButton, pages_panel);  		// if data is received
			}

			
		}, self.startTimeOut);

	}	


	/*!
		- Резко и финишно показывает bottomMoreButton
		- Резко и финишно показывает панель страниц
		- (Загружает data из contentUpload()):
			- плавно скрывает анимацию 
			- Удаляет анимацию (в новом фрейме)
			- Назначает номер страницы для существующего контента (в новом фрейме)		

		- меняет содержимое панели страниц
	*/
	function contentReceived(bottomMoreButton, pages_panel) {

		// show bottomMoreButton
		bottomMoreButton.style.display = 'block';
		bottomMoreButton.style.opacity = '1';
		bottomMoreButton.onclick = uploadAnimation;
		// show pages_panel
		pages_panel.style.display = 'block';
		pages_panel.style.opacity = 1;

		var currentPage = contentUpload(self.data, [pages_panel]);
		// var active_lick = dom.get('.pages .active')

		var pages_links = dom.get('.pages').children;
		if (pages_links[0].className.indexOf('active') == 0) {
			pages_links[0].className = '';
			pages_links[0].children[0].href = '#page_' + 1;
			pages_links[1].className = 'active';
		}
		else {
			var stored_page = pages_links[0].cloneNode(true);
			var future_page = pages_links[0].cloneNode(true);
			future_page.children[0].innerText = "...";
			for (var i = 0; i < pages_links.length; i++) {
				var new_num = Number(pages_links[i].children[0].innerText); //(Number(pages_links[i].children[0].href.slice(5)) + 1);
				pages_links[i].children[0].href = "#page_" + (1 + new_num);
				pages_links[i].children[0].innerText = new_num + 1;
				/*
				if (pages_links[i].children.length){
				    
					var new_num = (Number(pages_links[i].children[0].href.slice(5)) + 1);
					pages_links[i].children[0].href = "page_"+ new_num;
					pages_links[i].children[0].innerText = new_num;
				    
				}
				else pages_links[i].innerText = Number(pages_links[i].innerText) + 1;//*/
			} //*/
			pages_links[0].parentNode.insertBefore(stored_page, pages_links[0]);
			pages_links[0].parentNode.appendChild(future_page);
		}
	}




	/*! slow content loading  after animation (called inside upload_animate)
		плавная подгрузка контента после анимации:
			- плавно скрывает анимацию 
			- Удаляет анимацию (в новом фрейме)
			- Назначает номер страницы для существующего контента (в новом фрейме)

		
		@params:
			upload - clicked button that transform here to page number label
	*/
	var contentUpload = function(nav_elems){
	
		var uploadBtn = self.sender;  // uploadBtn - clicked button that transform here to page number label		
	
		_HideAnimation();

		var currentPage = { previous : true, next : true }
		

	// get current Page: (number)	
		var active_link = dom.get('.pages .active');		//?
		var pageNumber = parseInt(dom.get('.pages .active').innerText); 	
		
		setTimeout(()=>{
				
			_RemoveAnimation();
			
	// set page_number for next page instead upload button		
			uploadBtn.style.display = 'block';
			uploadBtn.style.opacity = '1';
			uploadBtn.style.margin = '10px auto';
			uploadBtn.id = 'page_' + pageNumber;
			uploadBtn.innerText = pageNumber;	
			
	// insert new page after number page(before new next page) 
			uploadBtn.parentNode.insertBefore(self.data, uploadBtn.nextSibling);
			
	// 	show pages navigation panel (vs numbers of nearest pages):
			for (var i=0;i<nav_elems.length;i++) nav_elems[i].style.opacity = '1';
			
	// smooth scroll if browser supports it:		
			if (uploadBtn.style.scrollBehavior !== void 0){
				
				self.data[self.finishScroll].scrollIntoView({
					behavior : 'smooth', 
					block: "end", 
					inline: "center"
				});
			}

		}, 1000);//*/
		
		return currentPage;
		
	}



	this.uploadAnimate(event, clback);


	/*! Creation of animation elements
		Создает элементы анимации, назначает им классы стилей и возвращает их контейнер как объект
		
		@params:
			sender - clicked button
			sender_height - height for animate container (arrived separated, because height of sender for unvisible style is null)
	*/
	this._InitialAnimation = function(sender, sender_height)
	{

		var await_animate = document.createElement('div');		/* создает контейнер для анимации */
		
		await_animate.className = 'await_animate';
		await_animate.style.height = sender_height + 'px';
		for (var i=0;i<3;i++){									/* создает субъекты анимации */
			var dot = document.createElement('div');
			dot.className = 'circle';
			await_animate.appendChild(dot);
		}
		sender.parentElement.insertBefore(await_animate, sender);  /* set animate container to page */
		
		setTimeout(function(){ await_animate.style.opacity = '1' }, 10); /* slow appearance the container */
		
		return { elem : await_animate };
	}	
	


	/*! hide and insert new MoreButton and than _InitialAnimation() and start animation in 
		place before bottomMoreButton

		Скрывает кнопку "Показать еще", инициализирует объекты анимации и запускает setInterval для их анимации
		(Заполняет объект self.animation данными об инициализированном объекте анимации и статусе анимации - 
			индексе setInterval)
	*/
	this._StartAnimation = function(pages_panel, bottomMoreButton, sender_height, clback) {

		// bottomMoreButton.style.display = 'none';			// finish hide the clicked button

		pages_panel.style.display = 'none'; 				// hide page panel

		bottomMoreButton.style.display = 'none';			// hide new MoreButton

		self.sender.parentNode.insertBefore(bottomMoreButton, pages_panel); // insert the MoreButton before pages_panel

		self.animation = self._InitialAnimation(bottomMoreButton, sender_height);

		// animation:
		var key = 0;

		elems = self.animation.elem.querySelectorAll('.circle');

		self.animation['started'] = setInterval(function () {

			var pre = key > 0 ? key - 1 : 2;
			elems[key].className = 'circle active';
			elems[pre].className = 'circle';

			if (key < 2) 
				key += 1;
			else 
				key = 0;

		}, 500);
		
		if (clback) clback(self.animation);
	}

	/*! Hiding animation
	*/
	function _HideAnimation() {

		clearInterval(self.animation.start);
		self.animation.elem.style.transition = '1s';
		self.animation.elem.style.opacity = '0';
	}



	/// finish hide and remove animation
	function _RemoveAnimation() {
		self.animation.elem.style.display = 'none';
		self.animation.elem.parentElement.removeChild(self.animation.elem);
	}

};