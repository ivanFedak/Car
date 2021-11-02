import getResource from "../services/request"
const showStyleBlock = (trigger, wrap)=>{
    const btn = document.querySelector(trigger);

    btn.addEventListener('click', function(){
        getResource('http://localhost:3000/styles')
            .then(res =>createCard(res))
            .catch(e=>console.log(e));

    this.remove();
    });



    function createCard(response){
        response.forEach(card=>{

            let cards = document.createElement('div');

            cards.classList.add('animated', 'fadeInUp',  'col-sm-3', 'col-sm-offset-0', 'col-xs-10', 'col-xs-offset-1');

            const {src, title, link} = card;

            cards.innerHTML = `
                    <div class=styles-block>
						<img src="${src}" alt="${title}">
						<h4>${title}</h4>
						<a href="${link}">Подробнее</a>
					</div>
            `
            document.querySelector(wrap).appendChild(cards);
        });
    }
}
export default showStyleBlock;