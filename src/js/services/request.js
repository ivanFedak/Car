const getResource = async (url)=>{
    let res = await fetch(url);

    if(!res.ok){
        throw new Error('There\'s error')
    }
    
    return await res.json();
};
export default getResource;