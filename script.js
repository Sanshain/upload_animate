window.onload = function(){
	
	// find all upload buttons on page ( for this sample just one )
	var upload_buttons = document.querySelectorAll('.upload'); // or by [data-append_to]
	
	// set onclick event the func of upload_animate
	for (var i=0;i<uploads.length;i++) upload_buttons[i].onclick = upload_animate;
	
}

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
		
		_items[0].scrollIntoView({behavior : 'smooth'});
		
	}, 1000);//*/
		
}



function upload_animate(event, clback){

	var sender = event.target;

	// var tgt = sender.dataset['_refresh']; 			//       sender.dataset['append_to'] ||
	// tgt - нужен будет, если будет надо вставить не перед кнопкой, а в др месте 
	// (введем по мере необходимости) tgt = sender.parentElement

	sender.scrollIntoView(true);   								// scroll to down before animation

	/* this animate has be perform by page_leaser library */
	sender.style.opacity = '0';
	
	var sender_height = append_friends.offsetHeight;
	
	setTimeout(function(){
		
		sender.style.display = 'none';
		
		dots_animate = InitializeAnimate(sender, sender_height)

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
		

		content_load(dots_animate, sender);
	}, 4000);
	
}



function InitializeAnimate(sender, sender_height){

	/* создает: */
	var await_animate = document.createElement('div');
	
	await_animate.className = 'await_animate';
	await_animate.style.height = sender_height + 'px';
	for (var i=0;i<3;i++){
		var dot = document.createElement('div');
		dot.className = 'circle';
		await_animate.appendChild(dot);
	}
	sender.parentElement.insertBefore(await_animate, sender);
	

	setTimeout(function(){
		
		await_animate.style.opacity = '1';
	},10);//*/	
	
	var animat = {		
		elem : await_animate
	}	
	
	return animat;
}




/* получает, если существует */
function __getAnimateFor(sender){
	
	for (var i=0;i<3;i++){
		await_animate = sender.previousSibling();
		
		if (await_animate.className == 'await_animate') {
			
			break;
		}
	}
	
	if (!await_animate) return InitializeAnimate(sender)
	
	var animat = {		
		elem : await_animate
	}	
	
	return animat;
}


function previous(sender, tip, attr='className', n=3){	
	
	for (var i=0;i<n;i++){
		await_animate = sender.previousSibling();
		
		if (await_animate[attr] == tip) return await_animate;
	}
	
	return null;
}