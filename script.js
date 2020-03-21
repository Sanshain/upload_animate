dom = document;
dom.get = document.querySelector;

// import on base

// assign here that its using:
// using call_error

//- using call_error
call_error = {
	connection : function(){
		
		alert('Error connection. If you want refresh page, click here or turn around');
		
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
var data = null;

/*! Function for generate demo fields (with demo data). 

	imitation for real page request by AJAX
*/
function getPage(){
	
	setTimeout(function(){
		
		/// Create Demo Elements for new page:
		var page = document.createElement('div');
		var _items = [];
		
		for (var i=0;i<5;i++){
			
			var item = item.cloneNode(true);
			_items.push(item);
			page.appendChild(item);			
			item.innerText = i;
		}
		
		data = page;	
		
	}, 4000);	
}





uploadAnimation.prototype = {
	startTimeOut : 1500,
	timeOut : 1000,
	attemptLot : 5,
	finishScroll : 3
}
function uploadAnimation(event, clback) {
	
	if (!(this instanceof uploadAnimation)) {
		
		var _animation = new uploadAnimation(event, clback);
		
		return;
	}
	
	var self = this;
	this.responseData = null;
	
	/*! Start animation for clicked element
		
		@param:
			event - event or object containing `target` property specified on clicked HTML element
			clback - optional argument for callback if the func called by user code (no event) by proxy func
	*/
	this.upload_animate = function(event, clback){

		this.sender = event.target;									// the clicked button

		// var tgt = sender.dataset['_refresh']; 			//       sender.dataset['append_to'] ||
		// tgt - нужен будет, если будет надо вставить не перед кнопкой, а в др месте 
		// (введем по мере необходимости) tgt = sender.parentElement

		this.sender.scrollIntoView(true);   		// scroll to full bottom view before animation	
		this.sender.style.opacity = '0.5'; //slow hiding: unnecessary (this animate has be perform by `page_leaser`)  
		this.sender.onclick = null;
		
		var sender_height = append_friends.offsetHeight;
		
		var pages_panel = dom.get('.pages');									
		pages_panel.style.opacity = '0';
		
		var bottomMoreButton = this.sender.cloneNode(true);
		
		setTimeout(function(){
			
			// bottomMoreButton.style.display = 'none';			// finish hide the clicked button
			
			pages_panel.style.display = 'none';					
			
			this.sender.parentNode.insertBefore(bottomMoreButton, dom.get('.pages'));
			
			this.animation = InitializeAnimate(bottomMoreButton, sender_height);


	// animation:

			var key = 0;

			elems = this.animation.elem.querySelectorAll('.circle');

			this.animation['started'] = setInterval(function(){

				var pre = key > 0 ? key - 1  : 2;
				elems[key].className = 'circle active';
				elems[pre].className = 'circle';

				if (key<2) {key+=1} else key=0;
			  
			},500);   

			if (clback) clback(this.animation);
			
		},250);//*/	
		
		var attempts = 0;
		setTimeout(function wait_contant(){ 
		
			if (!data && attempts<self.attemptLot){
				
				attempts = setTimeout(wait_contant, self.timeOut);
				return;
			}
			else if(!data && attempts>=self.attemptLot) return call_error['connection']();
			
		
			// if data is received
			
			
			bottomMoreButton.style.opacity = '1';
			bottomMoreButton.onclick = upload_animate;
			pages_panel.style.display = 'block';
			
			var currentPage = content_load(data, [pages_panel])
			
			
			// var active_lick = dom.get('.pages .active')
			var pages_links = dom.get('.pages').children;
			if (pages_links[0].className.indexOf('active') == 0){
				
				pages_links[0].className = '';
				pages_links[0].children[0].href = '#page_'+ 1;
				pages_links[1].className = 'active';
				
			}
			else {
				
				var stored_page = pages_links[0].cloneNode(true);
				var future_page = pages_links[0].cloneNode(true);
				future_page.children[0].innerText = "...";
				
				for (var i=0;i<pages_links.length;i++){
					
					var new_num = Number(pages_links[i].children[0].innerText); //(Number(pages_links[i].children[0].href.slice(5)) + 1);
					pages_links[i].children[0].href = "#page_"+ (1 + new_num);
					pages_links[i].children[0].innerText = new_num + 1;						
					/*
					if (pages_links[i].children.length){
						
						var new_num = (Number(pages_links[i].children[0].href.slice(5)) + 1);
						pages_links[i].children[0].href = "page_"+ new_num;
						pages_links[i].children[0].innerText = new_num;
						
					}
					else pages_links[i].innerText = Number(pages_links[i].innerText) + 1;//*/
					
				}//*/
				
				pages_links[0].parentNode.insertBefore(stored_page, pages_links[0]);
				pages_links[0].parentNode.appendChild(future_page);
				
			}
			
		}, 4000);
		
	}	

	/*! slow content loading  after animation (called inside upload_animate)
		плавная подгрузка контента после анимации
		
		@params:
			upload - clicked button that transform here to page number label
	*/
	var content_load = function(nav_elems){
	
		var upload = self.sender;  // upload - clicked button that transform here to page number label
	
	// stop animation
		clearInterval(self.animation.start);
		self.animation.elem.style.transition = '1s';
		self.animation.elem.style.opacity = '0';
		


		var item = document.querySelector('.container');	
		
		var currentPage = { previous : true, next : true }
		

	// get current Page: (number)	
		var active_link = dom.get('.pages .active');
		var pageNumber = parseInt(dom.get('.pages .active').innerText); 	
		
		setTimeout(()=>{
			
	// finish hide and remove animation
			self.animation.elem.style.display = 'none';
			self.animation.elem.parentElement.removeChild(self.animation.elem);
			
	// set page_number for next page instead upload button		
			upload.style.display = 'block';
			upload.style.opacity = '1';
			upload.style.margin = '10px auto';
			upload.id = 'page_' + pageNumber;
			upload.innerText = pageNumber;	
			
	// insert new page after number page(before new next page) 
			upload.parentNode.insertBefore(page, upload.nextSibling);
			
	// 	show pages navigation panel (vs numbers of nearest pages):
			for (var i=0;i<nav_elems.length;i++) nav_elems[i].style.opacity = '1';
			
	// smooth scroll if browser supports it:		
			if (upload.style.scrollBehavior !== void 0){
				
				data[self.finishScroll].scrollIntoView({
					behavior : 'smooth', 
					block: "end", 
					inline: "center"
				});
			}

		}, 1000);//*/
		
		return currentPage;
		
	}

	this.upload_animate(event, clback);

};












/*! Start animation for clicked element
	
	@param:
		event - event or object containing `target` property specified on clicked HTML element
		clback - optional argument for callback if the func called by user code (no event) by proxy func
*/
function upload_animate(event, clback){

	var sender = event.target;									// the clicked button

	// var tgt = sender.dataset['_refresh']; 			//       sender.dataset['append_to'] ||
	// tgt - нужен будет, если будет надо вставить не перед кнопкой, а в др месте 
	// (введем по мере необходимости) tgt = sender.parentElement

	sender.scrollIntoView(true);   								// scroll to down before animation	
	sender.style.opacity = '0.5'; //slow hiding: unnecessary (this animate has be perform by `page_leaser`)  
	sender.onclick = null;
	
	var sender_height = append_friends.offsetHeight;
	
	var pages = dom.get('.pages');
	pages.style.opacity = '0';
	
	var bottomMoreButton = sender.cloneNode(true);
	
	setTimeout(function(){
		
		// bottomMoreButton.style.display = 'none';			// finish hide the clicked button
		
		pages.style.display = 'none';					
		
		sender.parentNode.insertBefore(bottomMoreButton, dom.get('.pages'));
		
		dots_animate = InitializeAnimate(bottomMoreButton, sender_height);


// animation:

		var key = 0;

		elems = dots_animate.elem.querySelectorAll('.circle');

		dots_animate['started'] = setInterval(function(){

			var pre = key > 0 ? key - 1  : 2;
			elems[key].className = 'circle active';
			elems[pre].className = 'circle';

			if (key<2) {key+=1} else key=0;
		  
		},500);   

		if (clback) clback(dots_animate);
		
	},250);//*/	
	
	
	setTimeout(function(){ 
	
		bottomMoreButton.style.opacity = '1';
		bottomMoreButton.onclick = upload_animate;
		pages.style.display = 'block';
	
		
	
		var currentPage = content_load(dots_animate, sender, [pages]) 		
		
		
		

		// var active_lick = dom.get('.pages .active')
		var pages_links = dom.get('.pages').children;
		if (pages_links[0].className.indexOf('active') == 0){
			
			pages_links[0].className = '';
			pages_links[0].children[0].href = '#page_'+ 1;
			pages_links[1].className = 'active';
			
		}
		else {
			
			var stored_page = pages_links[0].cloneNode(true);
			var future_page = pages_links[0].cloneNode(true);
			future_page.children[0].innerText = "...";
			
			for (var i=0;i<pages_links.length;i++){
				
				var new_num = Number(pages_links[i].children[0].innerText); //(Number(pages_links[i].children[0].href.slice(5)) + 1);
				pages_links[i].children[0].href = "#page_"+ (1 + new_num);
				pages_links[i].children[0].innerText = new_num + 1;						
				/*
				if (pages_links[i].children.length){
					
					var new_num = (Number(pages_links[i].children[0].href.slice(5)) + 1);
					pages_links[i].children[0].href = "page_"+ new_num;
					pages_links[i].children[0].innerText = new_num;
					
				}
				else pages_links[i].innerText = Number(pages_links[i].innerText) + 1;//*/
				
			}//*/
			
			pages_links[0].parentNode.insertBefore(stored_page, pages_links[0]);
			pages_links[0].parentNode.appendChild(future_page);
			
		}
		
	}, 4000);
	
}







/*! slow content loading  after animation (called inside upload_animate)
	плавная подгрузка контента после анимации
	
	@params:
		animat - object containing `started` - the `setInterval` index for clearInterval it inside and `elem` - container for working animation 
		upload - clicked button that transform here to page number label
*/
function content_load(animat, upload, nav_elems){
	

	clearInterval(animat.started);									// stop animation
	animat.elem.style.transition = '1s';
	animat.elem.style.opacity = '0';
	
	
	var currentPage = { previous : true, next : true }				// create page environment
	
	
	var active_link = dom.get('.pages .active');					// get current Page: (number)	
	var pageNumber = parseInt(dom.get('.pages .active').innerText); 	
	
	
	setTimeout(()=>{
		
		animat.elem.style.display = 'none';						// finish hiding and removing animation
		animat.elem.parentElement.removeChild(animat.elem);
		

		upload.style.display = 'block';				// set page_number for next page instead upload button
		upload.style.opacity = '1';
		upload.style.margin = '10px auto';
		upload.id = 'page_' + pageNumber;
		upload.innerText = pageNumber;	
		
// insert new page after number page(before new next page) 
		upload.parentNode.insertBefore(data, upload.nextSibling);
		
// 	show pages navigation panel (vs numbers of nearest pages):
		for (var i=0;i<nav_elems.length;i++) nav_elems[i].style.opacity = '1';
		
// smooth scroll if browser supports it:		
		if (upload.style.scrollBehavior !== void 0){
			
			data.children[3].scrollIntoView({behavior : 'smooth', block: "end", inline: "center"});
		}

	}, 1000);//*/
	
	return currentPage;
	
}




/*! Creation of animation elements
	
	@params:
		sender - clicked button
		sender_height - height for animate container (arrived separated, because height of sender for unvisible style is null)
*/
function InitializeAnimate(sender, sender_height){

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













/*! Instead directly calling the InitializeAnimate from upload_animate in case await_animate is exists
	
	@params:
		sender - clicked button
*/
function findAnimates(sender, sender_height){
	
	
	for (var i=0;i<3;i++){		
		
		var await_animate = sender.previousSibling();
		
		if (await_animate){
			
			if (await_animate.className == 'await_animate') return { elem : await_animate };
		}
		else break;
		
	}
	
	/*
	var await_animate = null; 
	if (await_animate = findBefore(sender, 'await_animate'))  return { elem : await_animate }
	else 
		return InitializeAnimate(sender, sender_height)
	//*/
	
	return InitializeAnimate(sender, sender_height)

}

/*! Obsolete for findAnimates
*/
function findBefore(sender, tip, attr='className', n=3){	
	
	for (var i=0;i<n;i++){
		await_animate = sender.previousSibling();
		
		if (await_animate[attr] == tip) return await_animate;
	}
	
	return null;
}