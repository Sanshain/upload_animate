

window.onload = function(){
	
	// find all upload buttons on page ( for this sample just one )
	var upload_buttons = document.querySelectorAll('.upload'); // or by [data-append_to]
	
	// set onclick event the func of upload_animate
	for (var i=0;i<upload_buttons.length;i++) upload_buttons[i].onclick = upload_animate;
	
}


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
	sender.style.opacity = '0'; //slow hiding: unnecessary (this animate has be perform by `page_leaser`)  
	
	var sender_height = append_friends.offsetHeight;
	
	setTimeout(function(){
		
		sender.style.display = 'none';									// finish hide the clicked button
		
		dots_animate = InitializeAnimate(sender, sender_height)


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
	
		content_load(dots_animate, sender) 
	}, 4000);
	
}


/*! slow content loading  after animation 
	
	@params:
		animat - object containing `started` - the `setInterval` index for clearInterval it inside and `elem` - container for working animation 
		upload - clicked button that transform here to page number label
*/
function content_load(animat, upload){
	
	clearInterval(animat.started);
	animat.elem.style.transition = '1s';
	animat.elem.style.opacity = '0';
	

	var item = document.querySelector('.container');
	
	var _items = [];
	
	for (var i=0;i<5;i++){
		
		_items.push(item.cloneNode(true))		
	}
	
	
	setTimeout(()=>{
		
		animat.elem.style.display = 'none';
		animat.elem.parentElement.removeChild(animat.elem);
		
		
	
		
		upload.style.display = 'block';
		upload.style.opacity = '1';
		upload.style.margin = '10px auto';
		upload.onclick = null;
		upload.innerText = '1';
		
		
		
		for (var i=0;i<_items.length;i++){
			
			item.parentNode.appendChild(_items[i]);		
			_items[i].innerText = i;
		}	
		
		if (upload.style.scrollBehavior !== void 0){
			
			_items[1].scrollIntoView({behavior : 'smooth', block: "end", inline: "nearest"});
		}		

	}, 1000);//*/
	
	

		
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