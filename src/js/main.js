import def from './services/default'
import burger from './modules/burger'
import spollerModule from './modules/spoller'



// import getResource from './services/request'


window.onload = function (){
    def();
    burger();
    spollerModule();
}