const spollerModule = ()=>{
    
    const spollerArray = document.querySelectorAll('[data-spollers]');//spoller wrapper (all spollers)

    if(spollerArray.length > 0){//if exist

        //Разделям сполеры на обычные и по брек поинту (Получаем обичные)
        const spollersRegular = Array.from(spollerArray).filter(function (item,index,self){
            return !item.dataset.spollers.split(",")[0]//return all USSUAL spollers that not contains ',' (Array)
        });

        if(spollersRegular.length > 0){//if ussual spollers exist
            initSpollers(spollersRegular);//Call Fun
        }

        const spollersMedia = Array.from(spollerArray).filter(function (item,index,self){
            return item.dataset.spollers.split(",")[0]//return all MEDIA spollers that contains ',' (Array)
        });


        if(spollersMedia.length > 0){//if media spollers exist

            const breakpointsArray = [];//этот масив будет наполняться параметрами

            spollersMedia.forEach(item=>{
                const params = item.dataset.spollers;//Строка с параметрами для каждого item (650,min) (800,max)
                const breakpoint = {};
                const paramsArray = params.split(",");//String to Array    now (["650", "min"])
                breakpoint.value = paramsArray[0]; // breakpoint.value = 650
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max"; // breakpoint.type = 'min'
                breakpoint.item = item; //breakpoint.item = '.main__block .main__block_3'

                breakpointsArray.push(breakpoint);//содержит два масив об'ектов ///0: {value: '650', type: 'min', item: div.main__block.main__block_2}   
            });


            //Якшо есть несколько болков с одинаковыми breakpoints - example: (data-spollers="650,min" , data-spollers="650,min")
            //Чтобы учесть повторения ми get unique breakpoints
            
            let mediaQueries = breakpointsArray.map(function (item){
                return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
            });// return: 0: "(min-width: 650px),650,min"

            mediaQueries = mediaQueries.filter(function (item, index, self){
                return self.indexOf(item) == index;
            });//return уникальное значение без повторов (Array) ("(min-width: 650px),650,min")


            //Работаем из каждым breakPoint

            mediaQueries.forEach(breakpoint=>{
                const paramsArray = breakpoint.split(","); //Розбиваем масив по ',' 0: '(min-width: 650px)' 1: '650' 2: 'min'
                const mediaBreakpoint = paramsArray[1]; // 650
                const mediaType = paramsArray[2]; // min
                const matchMedia = window.matchMedia(paramsArray[0]); // min-width: 650px
                //matchMedia - метод слушае ширину екрана и отрабатуе если сработал breakPoint

                //Собрати масив об'эктов шо соответсвует даному breakPoint
                const spollersArray = breakpointsArray.filter(function (item){
                    if(item.value === mediaBreakpoint && item.type == mediaType){
                        return true;
                    }
                });///0: {value: '650', type: 'min', item: div.main__block.main__block_2}   


                //Event
                matchMedia.addListener(function(){
                    initSpollers(spollersArray, matchMedia);
                });
                initSpollers(spollersArray, matchMedia);
                
            });

   

        }


        function initSpollers(spollersArray, matchMedia = false) {
            spollersArray.forEach(spollersBlock=>{
                spollersBlock = matchMedia ? spollersBlock.item : spollersBlock; // matchMedia NOT false so spollersBlock.item
               
                if(matchMedia.matches || !matchMedia){// matchMedia.matches брекПоинт сработал или matchMedia == false
                    spollersBlock.classList.add('_init'); //add class _init
                    initSpollerBody(spollersBlock);//func that work with content
                    spollersBlock.addEventListener('click',setSpollerAction)
                }else{//Коли брекПоин не срабатуе
                    spollersBlock.classList.remove('_init'); //add class _init
                    initSpollerBody(spollersBlock, false);//func that work with content
                    spollersBlock.removeEventListener('click',setSpollerAction)
                }
            })
        }

        function initSpollerBody(spollersBlock, hideSpollerBody = true) {
            const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');//in what we click (btn) All
            if(spollerTitles.length > 0){ // btn exist
                spollerTitles.forEach(spollerTitle=>{
                    if(hideSpollerBody){
                        spollerTitle.removeAttribute('tabindex');//Возможно переходити по клавiшi 'TAB' между кнопками
                        if(!spollerTitle.classList.contains('_active')){//якшо в btn нема класа '_active'
                            spollerTitle.nextElementSibling.hidden = true //Cкриваем контент
                        }
                    }else{//якшо hideSpollerBody = false
                        spollerTitle.setAttribute('tabindex', '-1');
                        spollerTitle.nextElementSibling.hidden = false //Показуем контент
                    }
                })
            }
        }

        function setSpollerAction(e) {//When we click on btn
            const el = e.target;
            if(el.hasAttribute('data-spoller') || el.closest('[data-spoller]')){//якшо то шо ми клiкнули мае атрибук 
                const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');//btn
                const spollersBlock = spollerTitle.closest('[data-spollers]');//block
                const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;//если есть 'data-one-spoller' буде true
                if(!spollersBlock.querySelectorAll('_slide').length ){ //Якшо нема '_slide' для коректной работы
                    if(oneSpoller && !spollerTitle.classList.contains('_active')){//oneSpoller == true  title нема '_active'
                        hideSpollerBody(spollersBlock);//Прячемо
                    }
                    spollerTitle.classList.toggle('_active');
                    _slideToggle(spollerTitle.nextElementSibling, 500)
                }
                e.preventDefault()

            }
        }

        function hideSpollerBody(spollersBody){
            const spollerActiveTitle = spollersBody.querySelector('[data-spoller]._active');
            if(spollerActiveTitle){//Якшо э активиний клас
                spollerActiveTitle.classList.remove('_active');
                _slideUp(spollerActiveTitle.nextElementSibling, 500)
            }
        }


    
    }
        
        //=================
        //SlideToggle

        let _slideUp = (target, duration = 500) => {
            if (!target.classList.contains('_slide')) {
                target.classList.add('_slide');
                target.style.transitionProperty = 'height, margin, padding';
                target.style.transitionDuration = duration + 'ms';
                target.style.height = target.offsetHeight + 'px';
                target.offsetHeight;
                target.style.overflow = 'hidden';
                target.style.height = 0;
                target.style.paddingTop = 0;
                target.style.paddingBottom = 0;
                target.style.marginTop = 0;
                target.style.marginBottom = 0;
                window.setTimeout(() => {
                    target.hidden = true;
                    target.style.removeProperty('height');
                    target.style.removeProperty('padding-top');
                    target.style.removeProperty('padding-bottom');
                    target.style.removeProperty('margin-top');
                    target.style.removeProperty('margin-bottom');
                    target.style.removeProperty('overflow');
                    target.style.removeProperty('transition-duration');
                    target.style.removeProperty('transition-property');
                    target.classList.remove('_slide');
                }, duration);
            }
        }
        let _slideDown = (target, duration = 500) => {
            if (!target.classList.contains('_slide')) {
                target.classList.add('_slide');
                if (target.hidden) {
                    target.hidden = false;
                }
                let height = target.offsetHeight;
                target.style.overflow = 'hidden';
                target.style.height = 0;
                target.style.paddingTop = 0;
                target.style.paddingBottom = 0;
                target.style.marginTop = 0;
                target.style.marginBottom = 0;
                target.offsetHeight;
                target.style.transitionProperty = "height, margin, padding";
                target.style.transitionDuration = duration + 'ms';
                target.style.height = height + 'px';
                target.style.removeProperty('padding-top');
                target.style.removeProperty('padding-bottom');
                target.style.removeProperty('margin-top');
                target.style.removeProperty('margin-bottom');
                window.setTimeout(() => {
                    target.style.removeProperty('height');
                    target.style.removeProperty('overflow');
                    target.style.removeProperty('transition-duration');
                    target.style.removeProperty('transition-property');
                    target.classList.remove('_slide');
                }, duration);
            }
        }
        let _slideToggle = (target, duration = 500) => {
            if (target.hidden) {
                return _slideDown(target, duration);
            } else {
                return _slideUp(target, duration);
            }
        }


}
export default spollerModule;